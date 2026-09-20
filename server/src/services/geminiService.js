import { GoogleGenAI } from "@google/genai";

const BASE_SYSTEM_INSTRUCTION = `
You are part of UnderRight, a prototype credit intelligence decision-support system.

The numerical Credit Intelligence Score and risk classification are generated before you are called by a deterministic configurable scoring engine.

MANDATORY RULES:

1. Never calculate a replacement Credit Intelligence Score.
2. Never modify, increase, decrease, override, or reinterpret the supplied score.
3. Never change the supplied risk classification.
4. Never approve credit.
5. Never reject credit.
6. Never make the final lending decision.
7. Never invent applicant facts.
8. Only use information explicitly supplied in the context.
9. If requested information is unavailable, say that it is unavailable.
10. Never infer gender, race, ethnicity, religion, caste, health status, sexual orientation, political affiliation, or other protected or sensitive characteristics.
11. Never infer protected attributes from a name, financial activity, occupation, location, or other information.
12. Explain supplied financial factors neutrally and professionally.
13. Clearly distinguish observed facts from suggested manual verification.
14. Do not describe these prototype rules as production lending standards.
15. When appropriate, remind the user that the final lending decision belongs to an authorized human or governed process.
`;

const EXPLANATION_SYSTEM_INSTRUCTION = `
${BASE_SYSTEM_INSTRUCTION}

You are specifically generating a concise professional assessment explanation for a human underwriter.

Generative AI did not produce the score.
Your role is explanation only.
`;

const COPILOT_SYSTEM_INSTRUCTION = `
${BASE_SYSTEM_INSTRUCTION}

You are the UnderRight Underwriter Copilot.

Answer questions about one selected credit application.

Your role is to help the underwriter:
- understand why the supplied score exists
- identify the strongest supplied positive indicators
- understand supplied attention signals
- understand component-level scoring
- summarize the application
- identify information that may reasonably require manual verification

If asked "Should I approve this applicant?" or similar, do not answer yes or no.

Instead:
- summarize the relevant supplied factors
- explain what may warrant verification
- state that the final decision belongs to the authorized underwriting process

Keep answers concise and useful.
Normally use 2 to 5 short paragraphs or bullets.
`;

function getGeminiClient() {
  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error(
      "Gemini API key is not configured.",
    );

    error.code =
      "GEMINI_NOT_CONFIGURED";

    throw error;
  }

  return new GoogleGenAI({
    apiKey,
  });
}

function getModel() {
  return (
    process.env.GEMINI_MODEL ||
    "gemini-3.8-flash"
  );
}

function buildApplicationContext(
  application,
) {
  return {
    employmentType:
      application.employmentType,

    employmentMonths:
      application.employmentMonths,

    creditPurpose:
      application.creditPurpose,

    monthlyIncome:
      application.monthlyIncome,

    requestedAmount:
      application.requestedAmount,

    existingMonthlyDebt:
      application.existingMonthlyDebt,

    averageMonthlyBalance:
      application.averageMonthlyBalance,

    monthlyCredits:
      application.monthlyCredits,

    monthlyDebits:
      application.monthlyDebits,

    incomeRegularity:
      application.incomeRegularity,

    utilityPaymentRate:
      application.utilityPaymentRate,

    missedPayments:
      application.missedPayments,

    accountAgeMonths:
      application.accountAgeMonths,
  };
}

function buildAssessmentContext(
  assessment,
) {
  return {
    totalScore:
      assessment.totalScore,

    riskLevel:
      assessment.riskLevel,

    components:
      assessment.components,

    positiveFactors:
      assessment.positiveFactors,

    riskFactors:
      assessment.riskFactors,

    calculationDetails:
      assessment.calculationDetails,
  };
}

function normalizeGeminiError(error) {
  if (
    error.code ===
    "GEMINI_NOT_CONFIGURED"
  ) {
    return error;
  }

  const message =
    error?.message ||
    error?.cause?.message ||
    "";

  const wrappedError =
    new Error(
      "Gemini request failed.",
    );

  wrappedError.cause = error;

  if (
    message.includes("429") ||
    message
      .toLowerCase()
      .includes("rate limit") ||
    message
      .toLowerCase()
      .includes(
        "resource_exhausted",
      )
  ) {
    wrappedError.code =
      "GEMINI_RATE_LIMITED";
  } else {
    wrappedError.code =
      "GEMINI_REQUEST_FAILED";
  }

  return wrappedError;
}

async function runGemini({
  systemInstruction,
  prompt,
}) {
  const ai =
    getGeminiClient();

  try {
    const interaction =
      await ai.interactions.create({
        model: getModel(),

        system_instruction:
          systemInstruction,

        input: prompt,

        generation_config: {
          temperature: 0.2,
        },
      });

    const text =
      interaction.output_text?.trim();

    if (!text) {
      const error = new Error(
        "Gemini returned an empty response.",
      );

      error.code =
        "GEMINI_EMPTY_RESPONSE";

      throw error;
    }

    return text;
  } catch (error) {
    throw normalizeGeminiError(
      error,
    );
  }
}

export function isGeminiConfigured() {
  return Boolean(
    process.env.GEMINI_API_KEY,
  );
}

export async function generateAssessmentExplanation(
  application,
  assessment,
) {
  const applicationContext =
    buildApplicationContext(
      application,
    );

  const assessmentContext =
    buildAssessmentContext(
      assessment,
    );

  const prompt = `
Explain the following UnderRight prototype credit assessment for a human underwriter.

The supplied score and risk level are immutable.

APPLICATION FINANCIAL DATA:
${JSON.stringify(applicationContext, null, 2)}

DETERMINISTIC ASSESSMENT:
${JSON.stringify(assessmentContext, null, 2)}

Use exactly these sections:

Assessment Overview

Strongest Positive Signals

Main Attention Signals

Suggested Manual Verification

Advisory Note

Keep the response below approximately 350 words.
Do not use a markdown table.
`;

  return runGemini({
    systemInstruction:
      EXPLANATION_SYSTEM_INSTRUCTION,

    prompt,
  });
}

export async function askUnderwriterCopilot(
  application,
  assessment,
  conversation,
  question,
) {
  const applicationContext =
    buildApplicationContext(
      application,
    );

  const assessmentContext =
    buildAssessmentContext(
      assessment,
    );

  const recentConversation =
    conversation.map(
      (message) => ({
        role: message.role,
        message:
          message.message,
      }),
    );

  const prompt = `
You are answering a question about one UnderRight credit application.

APPLICATION FINANCIAL DATA:
${JSON.stringify(applicationContext, null, 2)}

IMMUTABLE DETERMINISTIC ASSESSMENT:
${JSON.stringify(assessmentContext, null, 2)}

RECENT COPILOT CONVERSATION:
${JSON.stringify(recentConversation, null, 2)}

CURRENT UNDERWRITER QUESTION:
${question}

Answer only from the supplied information.

Do not recalculate the score.
Do not change the risk level.
Do not approve or reject credit.
Do not invent missing information.

If the question requests unavailable information, clearly say it is not available in the supplied application.
`;

  return runGemini({
    systemInstruction:
      COPILOT_SYSTEM_INSTRUCTION,

    prompt,
  });
}