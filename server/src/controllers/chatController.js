import pool from "../config/db.js";

import {
  askUnderwriterCopilot,
} from "../services/geminiService.js";

import {
  chatMessageSchema,
} from "../validators/chatValidator.js";

function mapApplication(row) {
  return {
    id: Number(row.id),

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

async function loadApplicationContext(
  applicationId,
) {
  const result =
    await pool.query(
      `
        SELECT
          a.*,

          s.total_score,
          s.risk_level,
          s.income_stability_score,
          s.debt_capacity_score,
          s.payment_behaviour_score,
          s.cash_flow_score,
          s.account_stability_score,
          s.positive_factors,
          s.risk_factors,
          s.calculation_details

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
    return null;
  }

  const row =
    result.rows[0];

  return {
    application:
      mapApplication(row),

    assessment:
      mapAssessment(row),
  };
}

export async function getChatMessages(
  req,
  res,
) {
  const applicationId =
    Number(req.params.id);

  if (
    !Number.isInteger(
      applicationId,
    ) ||
    applicationId <= 0
  ) {
    return res
      .status(400)
      .json({
        message:
          "Invalid application ID.",
      });
  }

  const applicationResult =
    await pool.query(
      `
        SELECT id
        FROM applications
        WHERE id = $1
      `,
      [applicationId],
    );

  if (
    applicationResult.rowCount ===
    0
  ) {
    return res
      .status(404)
      .json({
        message:
          "Application not found.",
      });
  }

  const result =
    await pool.query(
      `
        SELECT
          id,
          role,
          message,
          created_at

        FROM chat_messages

        WHERE application_id = $1

        ORDER BY created_at ASC, id ASC
      `,
      [applicationId],
    );

  const messages =
    result.rows.map(
      (row) => ({
        id: Number(row.id),
        role: row.role,
        message: row.message,
        createdAt:
          row.created_at,
      }),
    );

  return res
    .status(200)
    .json({
      messages,
    });
}

export async function sendChatMessage(
  req,
  res,
) {
  const applicationId =
    Number(req.params.id);

  if (
    !Number.isInteger(
      applicationId,
    ) ||
    applicationId <= 0
  ) {
    return res
      .status(400)
      .json({
        message:
          "Invalid application ID.",
      });
  }

  const validation =
    chatMessageSchema.safeParse(
      req.body,
    );

  if (!validation.success) {
    return res
      .status(400)
      .json({
        message:
          "Chat message validation failed.",

        errors:
          validation.error
            .flatten()
            .fieldErrors,
      });
  }

  const context =
    await loadApplicationContext(
      applicationId,
    );

  if (!context) {
    return res
      .status(404)
      .json({
        message:
          "Application not found.",
      });
  }

  const historyResult =
    await pool.query(
      `
        SELECT
          role,
          message

        FROM chat_messages

        WHERE application_id = $1

        ORDER BY created_at DESC, id DESC

        LIMIT 12
      `,
      [applicationId],
    );

  const conversation =
    historyResult.rows.reverse();

  const question =
    validation.data.message;

  let answer;

  try {
    answer =
      await askUnderwriterCopilot(
        context.application,
        context.assessment,
        conversation,
        question,
      );
  } catch (error) {
    const providerMessage =
      error.cause?.message ||
      error.message ||
      "";

    console.error(
      "Gemini Copilot error:",
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
            "Underwriter Copilot is currently unavailable because Gemini has not been configured.",

          fallback:
            "The deterministic assessment, component scores and underlying signals remain available.",
        });
    }

    if (
      error.code ===
      "GEMINI_RATE_LIMITED"
    ) {
      return res
        .status(429)
        .json({
          available: false,

          message:
            "Underwriter Copilot is temporarily unavailable because the Gemini API usage limit has been reached.",

          fallback:
            "Please try again later. The deterministic assessment remains fully available.",
        });
    }

    return res
      .status(502)
      .json({
        available: false,

        message:
          "Underwriter Copilot is currently unavailable.",

        fallback:
          "The deterministic Credit Intelligence Score and factor breakdown remain available for review.",
      });
  }

  const client =
    await pool.connect();

  try {
    await client.query(
      "BEGIN",
    );

    const userResult =
      await client.query(
        `
          INSERT INTO chat_messages (
            application_id,
            role,
            message
          )

          VALUES (
            $1,
            'user',
            $2
          )

          RETURNING
            id,
            role,
            message,
            created_at
        `,
        [
          applicationId,
          question,
        ],
      );

    const assistantResult =
      await client.query(
        `
          INSERT INTO chat_messages (
            application_id,
            role,
            message
          )

          VALUES (
            $1,
            'assistant',
            $2
          )

          RETURNING
            id,
            role,
            message,
            created_at
        `,
        [
          applicationId,
          answer,
        ],
      );

    await client.query(
      "COMMIT",
    );

    const userMessage =
      userResult.rows[0];

    const assistantMessage =
      assistantResult.rows[0];

    return res
      .status(200)
      .json({
        available: true,

        userMessage: {
          id: Number(
            userMessage.id,
          ),

          role:
            userMessage.role,

          message:
            userMessage.message,

          createdAt:
            userMessage.created_at,
        },

        assistantMessage: {
          id: Number(
            assistantMessage.id,
          ),

          role:
            assistantMessage.role,

          message:
            assistantMessage.message,

          createdAt:
            assistantMessage.created_at,
        },
      });
  } catch (error) {
    await client.query(
      "ROLLBACK",
    );

    throw error;
  } finally {
    client.release();
  }
}