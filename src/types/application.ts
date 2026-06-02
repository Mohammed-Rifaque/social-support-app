import type {
  EmploymentStatusValue,
  GenderValue,
  HousingStatusValue,
  MaritalStatusValue,
  MonthlyIncomeValue,
} from '../utils/applicationOptions'

export interface ApplicationForm {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: GenderValue | ''
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  maritalStatus: MaritalStatusValue | ''
  dependents: number
  employmentStatus: EmploymentStatusValue | ''
  monthlyIncome: MonthlyIncomeValue | 0
  housingStatus: HousingStatusValue | ''
  currentFinancialSituation: string
  employmentCircumstances: string
  reasonForApplying: string
}

export interface SubmittedApplication {
  id: string
  submittedAt: string
  data: ApplicationForm
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
