import { z } from 'zod'

import {
  employmentStatusValues,
  housingStatusValues,
  maritalStatusValues,
  monthlyIncomeValues,
} from '../utils/applicationOptions'

export const familySchema = z.object({
  maritalStatus: z.enum(maritalStatusValues, {
    error: () => ({ message: 'validation.maritalStatusRequired' }),
  }),
  dependents: z
    .number({ message: 'validation.dependentsRequired' })
    .int('validation.dependentsInteger')
    .min(0, 'validation.dependentsMin')
    .max(4, 'validation.dependentsMax'),
  employmentStatus: z.enum(employmentStatusValues, {
    error: () => ({ message: 'validation.employmentStatusRequired' }),
  }),
  monthlyIncome: z.union(
    monthlyIncomeValues.map((value) => z.literal(value)) as [
      z.ZodLiteral<(typeof monthlyIncomeValues)[number]>,
      z.ZodLiteral<(typeof monthlyIncomeValues)[number]>,
      ...Array<z.ZodLiteral<(typeof monthlyIncomeValues)[number]>>,
    ],
    {
      error: () => ({ message: 'validation.monthlyIncomeRequired' }),
    },
  ),
  housingStatus: z.enum(housingStatusValues, {
    error: () => ({ message: 'validation.housingStatusRequired' }),
  }),
})

export type FamilyFormValues = z.infer<typeof familySchema>
