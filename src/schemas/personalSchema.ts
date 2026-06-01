import { z } from 'zod'

const phonePattern = /^\+?[0-9\s-]{8,20}$/

export const personalSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  nationalId: z.string().min(1, 'National ID is required.'),
  dateOfBirth: z.string().min(1, 'Date of birth is required.'),
  gender: z.string().min(1, 'Gender is required.'),
  address: z.string().min(1, 'Address is required.'),
  city: z.string().min(1, 'City is required.'),
  state: z.string().min(1, 'State is required.'),
  country: z.string().min(1, 'Country is required.'),
  phone: z
    .string()
    .min(1, 'Phone number is required.')
    .regex(phonePattern, 'Enter a valid phone number.'),
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
})

export type PersonalFormValues = z.infer<typeof personalSchema>
