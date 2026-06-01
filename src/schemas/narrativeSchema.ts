import { z } from 'zod'

export const narrativeSchema = z.object({
  currentFinancialSituation: z
    .string()
    .min(20, 'Please provide a bit more detail about your current situation.')
    .max(500, 'Keep this answer within 500 characters.'),
  employmentCircumstances: z
    .string()
    .min(20, 'Please provide a bit more detail about your employment.')
    .max(500, 'Keep this answer within 500 characters.'),
  reasonForApplying: z
    .string()
    .min(20, 'Please explain why you are applying for support.')
    .max(500, 'Keep this answer within 500 characters.'),
})

export type NarrativeFormValues = z.infer<typeof narrativeSchema>
