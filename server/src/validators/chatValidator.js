import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, "Please enter a question.")
    .max(
      1200,
      "Question must be 1200 characters or fewer.",
    ),
});