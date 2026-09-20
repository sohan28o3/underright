import { z } from "zod";

const optionalEmail = z
  .union([
    z.string().trim().email("Enter a valid email address."),
    z.literal(""),
  ])
  .optional();

export const createApplicationSchema = z.object({
  applicantName: z
    .string()
    .trim()
    .min(2, "Applicant name is required.")
    .max(150),

  email: optionalEmail,

  employmentType: z
    .string()
    .trim()
    .min(1, "Employment type is required.")
    .max(80),

  employmentMonths: z.coerce
    .number()
    .int()
    .min(0)
    .max(720),

  creditPurpose: z
    .string()
    .trim()
    .min(1, "Credit purpose is required.")
    .max(150),

  monthlyIncome: z.coerce
    .number()
    .positive("Monthly income must be greater than zero.")
    .max(100000000),

  requestedAmount: z.coerce
    .number()
    .positive("Requested amount must be greater than zero.")
    .max(1000000000),

  existingMonthlyDebt: z.coerce
    .number()
    .min(0)
    .max(100000000),

  averageMonthlyBalance: z.coerce
    .number()
    .min(0)
    .max(1000000000),

  monthlyCredits: z.coerce
    .number()
    .min(0)
    .max(1000000000),

  monthlyDebits: z.coerce
    .number()
    .min(0)
    .max(1000000000),

  incomeRegularity: z.enum([
    "High",
    "Medium",
    "Low",
  ]),

  utilityPaymentRate: z.coerce
    .number()
    .min(0)
    .max(100),

  missedPayments: z.coerce
    .number()
    .int()
    .min(0)
    .max(120),

  accountAgeMonths: z.coerce
    .number()
    .int()
    .min(0)
    .max(1200),
});