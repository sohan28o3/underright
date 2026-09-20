import pool from "../config/db.js";
import { calculateCreditScore } from "../services/scoringService.js";
import { createApplicationSchema } from "../validators/applicationValidator.js";
import { generateApplicationReference } from "../utils/applicationReference.js";

function mapApplication(row) {
  return {
    id: Number(row.id),
    applicationReference: row.application_reference,
    applicantName: row.applicant_name,
    email: row.email,
    employmentType: row.employment_type,
    employmentMonths: row.employment_months,
    creditPurpose: row.credit_purpose,
    monthlyIncome: Number(row.monthly_income),
    requestedAmount: Number(row.requested_amount),
    existingMonthlyDebt: Number(
      row.existing_monthly_debt,
    ),
    averageMonthlyBalance: Number(
      row.average_monthly_balance,
    ),
    monthlyCredits: Number(row.monthly_credits),
    monthlyDebits: Number(row.monthly_debits),
    incomeRegularity: row.income_regularity,
    utilityPaymentRate: Number(
      row.utility_payment_rate,
    ),
    missedPayments: row.missed_payments,
    accountAgeMonths: row.account_age_months,
    createdAt: row.created_at,
  };
}

function mapAssessment(row) {
  return {
    id: Number(row.assessment_id ?? row.id),
    applicationId: Number(row.application_id),
    totalScore: row.total_score,
    riskLevel: row.risk_level,
    components: {
      incomeStability:
        row.income_stability_score,
      debtCapacity:
        row.debt_capacity_score,
      paymentBehaviour:
        row.payment_behaviour_score,
      cashFlowStability:
        row.cash_flow_score,
      accountStability:
        row.account_stability_score,
    },
    positiveFactors:
      row.positive_factors ?? [],
    riskFactors:
      row.risk_factors ?? [],
    calculationDetails:
      row.calculation_details ?? [],
    aiExplanation:
      row.ai_explanation ?? null,
    createdAt:
      row.assessment_created_at ??
      row.created_at,
  };
}

export async function createApplication(req, res) {
  const validation =
    createApplicationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Application validation failed.",
      errors:
        validation.error.flatten().fieldErrors,
    });
  }

  const data = validation.data;

  const scoringResult =
    calculateCreditScore(data);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const applicationReference =
      generateApplicationReference();

    const applicationResult =
      await client.query(
        `
          INSERT INTO applications (
            application_reference,
            applicant_name,
            email,
            employment_type,
            employment_months,
            credit_purpose,
            monthly_income,
            requested_amount,
            existing_monthly_debt,
            average_monthly_balance,
            monthly_credits,
            monthly_debits,
            income_regularity,
            utility_payment_rate,
            missed_payments,
            account_age_months
          )
          VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11, $12,
            $13, $14, $15, $16
          )
          RETURNING *
        `,
        [
          applicationReference,
          data.applicantName,
          data.email || null,
          data.employmentType,
          data.employmentMonths,
          data.creditPurpose,
          data.monthlyIncome,
          data.requestedAmount,
          data.existingMonthlyDebt,
          data.averageMonthlyBalance,
          data.monthlyCredits,
          data.monthlyDebits,
          data.incomeRegularity,
          data.utilityPaymentRate,
          data.missedPayments,
          data.accountAgeMonths,
        ],
      );

    const application =
      applicationResult.rows[0];

    const assessmentResult =
      await client.query(
        `
          INSERT INTO assessments (
            application_id,
            total_score,
            risk_level,
            income_stability_score,
            debt_capacity_score,
            payment_behaviour_score,
            cash_flow_score,
            account_stability_score,
            positive_factors,
            risk_factors,
            calculation_details
          )
          VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9::jsonb,
            $10::jsonb,
            $11::jsonb
          )
          RETURNING *
        `,
        [
          application.id,
          scoringResult.totalScore,
          scoringResult.riskLevel,
          scoringResult.components
            .incomeStability,
          scoringResult.components
            .debtCapacity,
          scoringResult.components
            .paymentBehaviour,
          scoringResult.components
            .cashFlowStability,
          scoringResult.components
            .accountStability,
          JSON.stringify(
            scoringResult.positiveFactors,
          ),
          JSON.stringify(
            scoringResult.riskFactors,
          ),
          JSON.stringify(
            scoringResult.calculationDetails,
          ),
        ],
      );

    await client.query("COMMIT");

    const assessment =
      assessmentResult.rows[0];

    return res.status(201).json({
      message:
        "Credit assessment created successfully.",
      application: mapApplication(application),
      assessment: mapAssessment(assessment),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getApplicationById(
  req,
  res,
) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid application ID.",
    });
  }

  const result = await pool.query(
    `
      SELECT
        a.*,

        s.id AS assessment_id,
        s.application_id,
        s.total_score,
        s.risk_level,
        s.income_stability_score,
        s.debt_capacity_score,
        s.payment_behaviour_score,
        s.cash_flow_score,
        s.account_stability_score,
        s.positive_factors,
        s.risk_factors,
        s.calculation_details,
        s.ai_explanation,
        s.created_at AS assessment_created_at

      FROM applications a

      JOIN assessments s
        ON s.application_id = a.id

      WHERE a.id = $1
    `,
    [id],
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "Application not found.",
    });
  }

  const row = result.rows[0];

  return res.status(200).json({
    application: mapApplication(row),
    assessment: mapAssessment(row),
  });
}

export async function listApplications(
  req,
  res,
) {
  const {
    search = "",
    riskLevel = "",
    minScore = "",
    maxScore = "",
    page = "1",
    limit = "20",
  } = req.query;

  const safePage = Math.max(
    1,
    Number.parseInt(page, 10) || 1,
  );

  const safeLimit = Math.min(
    100,
    Math.max(
      1,
      Number.parseInt(limit, 10) || 20,
    ),
  );

  const conditions = [];
  const params = [];

  if (search.trim()) {
    params.push(`%${search.trim()}%`);

    conditions.push(`
      (
        a.applicant_name ILIKE $${params.length}
        OR
        a.application_reference ILIKE $${params.length}
      )
    `);
  }

  if (riskLevel.trim()) {
    params.push(riskLevel.trim());

    conditions.push(
      `s.risk_level = $${params.length}`,
    );
  }

  if (minScore !== "") {
    const value = Number(minScore);

    if (Number.isFinite(value)) {
      params.push(value);
      conditions.push(
        `s.total_score >= $${params.length}`,
      );
    }
  }

  if (maxScore !== "") {
    const value = Number(maxScore);

    if (Number.isFinite(value)) {
      params.push(value);
      conditions.push(
        `s.total_score <= $${params.length}`,
      );
    }
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const countResult = await pool.query(
    `
      SELECT COUNT(*)::int AS total

      FROM applications a

      JOIN assessments s
        ON s.application_id = a.id

      ${whereClause}
    `,
    params,
  );

  const offset =
    (safePage - 1) * safeLimit;

  const listParams = [...params];

  listParams.push(safeLimit);
  const limitParameter =
    `$${listParams.length}`;

  listParams.push(offset);
  const offsetParameter =
    `$${listParams.length}`;

  const result = await pool.query(
    `
      SELECT
        a.id,
        a.application_reference,
        a.applicant_name,
        a.requested_amount,
        a.created_at,

        s.total_score,
        s.risk_level

      FROM applications a

      JOIN assessments s
        ON s.application_id = a.id

      ${whereClause}

      ORDER BY a.created_at DESC

      LIMIT ${limitParameter}
      OFFSET ${offsetParameter}
    `,
    listParams,
  );

  const applications =
    result.rows.map((row) => ({
      id: Number(row.id),
      applicationReference:
        row.application_reference,
      applicantName:
        row.applicant_name,
      requestedAmount:
        Number(row.requested_amount),
      totalScore:
        row.total_score,
      riskLevel:
        row.risk_level,
      createdAt:
        row.created_at,
    }));

  const total =
    countResult.rows[0].total;

  return res.status(200).json({
    applications,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages:
        Math.ceil(total / safeLimit),
    },
  });
}