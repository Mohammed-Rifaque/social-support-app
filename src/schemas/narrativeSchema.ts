import { z } from 'zod'

const narrativeField = (requiredMessage: string) =>
  z
    .string()
    .trim()
    .min(30, requiredMessage)
    .max(500, 'validation.narrativeMax')

export const narrativeSchema = z.object({
  currentFinancialSituation: narrativeField(
    'validation.currentFinancialSituationMin',
  ),
  employmentCircumstances: narrativeField(
    'validation.employmentCircumstancesMin',
  ),
  reasonForApplying: narrativeField(
    'validation.reasonForApplyingMin',
  ),
})

export type NarrativeFormValues = z.infer<typeof narrativeSchema>
