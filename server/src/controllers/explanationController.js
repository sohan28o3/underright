import pool from "../config/db.js";

import {
  generateAssessmentExplanation,
} from "../services/geminiService.js";

function mapApplication(row) {
  return {
    id: Number(row.id),

    applicationReference:
      row.application_reference,

    employmentType:
      row.employment_type,

    employmentMonths:
      row.employment_months,

    creditPurpose:
      row.credit_purpose,

    monthlyIncome:
      Number(row.monthly_income),

    requestedAmount:
      Number(row.requested_amount),

    existingMonthlyDebt:
      Number(
        row.existing_monthly_debt,
      ),

    averageMonthlyBalance:
      Number(
        row.average_monthly_balance,
      ),

    monthlyCredits:
      Number(row.monthly_credits),

    monthlyDebits:
      Number(row.monthly_debits),

    incomeRegularity:
      row.income_regularity,

    utilityPaymentRate:
      Number(
        row.utility_payment_rate,
      ),

    missedPayments:
      row.missed_payments,

    accountAgeMonths:
      row.account_age_months,
  };
}

function mapAssessment(row) {
  return {
    id:
      Number(
        row.assessment_id,
      ),

    applicationId:
      Number(row.id),

    totalScore:
      row.total_score,

    riskLevel:
      row.risk_level,

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
  };
}

export async function generateExplanation(
  req,
  res,
) {
  const applicationId =
    Number(req.params.id);

  if (
    !Number.isInteger(applicationId) ||
    applicationId <= 0
  ) {
    return res
      .status(400)
      .json({
        message:
          "Invalid application ID.",
      });
  }

  const regenerate =
    req.body?.regenerate === true;

  const result =
    await pool.query(
      `
        SELECT
          a.*,

          s.id AS assessment_id,
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
          s.updated_at

        FROM applications a

        JOIN assessments s
          ON s.application_id = a.id

        WHERE a.id = $1
      `,
      [applicationId],
    );

  if (
    result.rowCount === 0
  ) {
    return res
      .status(404)
      .json({
        message:
          "Application not found.",
      });
  }

  const row =
    result.rows[0];

  if (
    row.ai_explanation &&
    !regenerate
  ) {
    return res
      .status(200)
      .json({
        available: true,

        cached: true,

        explanation:
          row.ai_explanation,

        generatedAt:
          row.updated_at,
      });
  }

  const application =
    mapApplication(row);

  const assessment =
    mapAssessment(row);

  try {
    const explanation =
      await generateAssessmentExplanation(
        application,
        assessment,
      );

    const updateResult =
      await pool.query(
        `
          UPDATE assessments

          SET
            ai_explanation = $1,
            updated_at = CURRENT_TIMESTAMP

          WHERE application_id = $2

          RETURNING updated_at
        `,
        [
          explanation,
          applicationId,
        ],
      );

    return res
      .status(200)
      .json({
        available: true,

        cached: false,

        explanation,

        generatedAt:
          updateResult.rows[0]
            .updated_at,
      });
  } catch (error) {
    const providerMessage =
      error.cause?.message ||
      error.message ||
      "";

    console.error(
      "Gemini explanation error:",
      providerMessage,
    );

    if (
      error.code ===
      "GEMINI_NOT_CONFIGURED"
    ) {
      return res
        .status(503)
        .json({
          available: false,

          message:
            "AI explanation is currently unavailable because Gemini has not been configured.",

          fallback:
            "The deterministic Credit Intelligence Score, component breakdown and underlying signals remain fully available.",
        });
    }

    if (
      error.code ===
        "GEMINI_RATE_LIMITED" ||
      providerMessage.includes(
        "429",
      )
    ) {
      return res
        .status(429)
        .json({
          available: false,

          message:
            "AI explanation is temporarily unavailable because the Gemini API usage limit has been reached.",

          fallback:
            "The deterministic Credit Intelligence Score and factor breakdown remain fully available. Please try again later.",
        });
    }

    return res
      .status(502)
      .json({
        available: false,

        message:
          "AI explanation is currently unavailable.",

        fallback:
          "The deterministic Credit Intelligence Score and factor breakdown remain available. Gemini does not affect the underlying assessment.",
     