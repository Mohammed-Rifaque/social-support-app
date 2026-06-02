import { z } from 'zod'

import { genderValues } from '../utils/applicationOptions'

const namePattern = /^[\p{L}][\p{L}\p{M}\s.'-]{1,79}$/u
const locationPattern = /^[\p{L}][\p{L}\p{M}\s.'-]{1,59}$/u
const nationalIdPattern = /^(?=.*\d)[\p{L}\p{N}\s-]{5,20}$/u
const phonePattern = /^\+?[0-9\s()-]{8,20}$/

function isValidDate(value: string) {
  const date = new Date(value)
  return !Number.isNaN(date.getTime())
}

function isNotFutureDate(value: string) {
  const date = new Date(value)
  const today = new Date()
  date.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return date <= today
}

export const personalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'validation.nameMin')
    .max(80, 'validation.nameMax')
    .regex(namePattern, 'validation.nameInvalid'),
  nationalId: z
    .string()
    .trim()
    .min(5, 'validation.nationalIdMin')
    .max(20, 'validation.nationalIdMax')
    .regex(
      nationalIdPattern,
      'validation.nationalIdInvalid',
    ),
  dateOfBirth: z
    .string()
    .min(1, 'validation.dateOfBirthRequired')
    .refine(isValidDate, 'validation.dateOfBirthInvalid')
    .refine(isNotFutureDate, 'validation.dateOfBirthFuture'),
  gender: z.enum(genderValues, {
    error: () => ({ message: 'validation.genderRequired' }),
  }),
  address: z
    .string()
    .trim()
    .min(5, 'validation.addressMin')
    .max(150, 'validation.addressMax'),
  city: z
    .string()
    .trim()
    .min(2, 'validation.cityMin')
    .max(60, 'validation.cityMax')
    .regex(locationPattern, 'validation.cityInvalid'),
  state: z
    .string()
    .trim()
    .min(2, 'validation.stateMin')
    .max(60, 'validation.stateMax')
    .regex(locationPattern, 'validation.stateInvalid'),
  country: z
    .string()
    .trim()
    .min(2, 'validation.countryMin')
    .max(60, 'validation.countryMax')
    .regex(locationPattern, 'validation.countryInvalid'),
  phone: z
    .string()
    .trim()
    .min(8, 'validation.phoneMin')
    .max(20, 'validation.phoneMax')
    .regex(phonePattern, 'validation.phoneInvalid')
    .refine(
      (value) => {
        const digitsOnly = value.replace(/\D/g, '')
        return digitsOnly.length >= 8 && digitsOnly.length <= 15
      },
      'validation.phoneDigits',
    ),
  email: z
    .string()
    .trim()
    .min(1, 'validation.emailRequired')
    .max(100, 'validation.emailMax')
    .email('validation.emailInvalid'),
})

export type PersonalFormValues = z.infer<typeof personalSchema>
