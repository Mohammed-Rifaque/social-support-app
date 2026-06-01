export interface ApplicationForm {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  maritalStatus: string
  dependents: number
  employmentStatus: string
  monthlyIncome: number
  housingStatus: string
  currentFinancialSituation: string
  employmentCircumstances: string
  reasonForApplying: string
}

export type ApplicationFormField = keyof ApplicationForm

export type NarrativeField =
  | 'currentFinancialSituation'
  | 'employmentCircumstances'
  | 'reasonForApplying'

export const applicationFormDefaults: ApplicationForm = {
  name: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  email: '',
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: 0,
  housingStatus: '',
  currentFinancialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
}
