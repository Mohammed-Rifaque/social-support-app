import { z } from 'zod'

export const familySchema = z.object({
  maritalStatus: z.string().min(1, 'Marital status is required.'),
  dependents: z
    .number({ message: 'Dependents is required.' })
    .min(0, 'Dependents cannot be negative.'),
  employmentStatus: z.string().min(1, 'Employment status is required.'),
  monthlyIncome: z
    .number({ message: 'Monthly income is required.' })
    .min(0, 'Monthly income cannot be negative.'),
  housingStatus: z.string().min(1, 'Housing status is required.'),
})

export type FamilyFormValues = z.infer<typeof familySchema>
