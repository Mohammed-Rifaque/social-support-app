import type { TFunction } from 'i18next'

export interface LocalizedOption<TValue extends string | number> {
  labelKey: string
  value: TValue
}

export const genderValues = ['male', 'female', 'other'] as const
export type GenderValue = (typeof genderValues)[number]
export const maritalStatusValues = [
  'single',
  'married',
  'divorced',
  'widowed',
] as const
export type MaritalStatusValue = (typeof maritalStatusValues)[number]
export const employmentStatusValues = [
  'employed-full-time',
  'employed-part-time',
  'self-employed',
  'unemployed',
  'student',
] as const
export type EmploymentStatusValue = (typeof employmentStatusValues)[number]
export const housingStatusValues = [
  'renting',
  'own-home',
  'living-with-family',
  'temporary-shelter',
] as const
export type HousingStatusValue = (typeof housingStatusValues)[number]
export const dependentsValues = [0, 1, 2, 3, 4] as const
export const monthlyIncomeValues = [500, 1000, 2000, 4000, 4001] as const
export type MonthlyIncomeValue = (typeof monthlyIncomeValues)[number]

export const genderOptions: ReadonlyArray<LocalizedOption<(typeof genderValues)[number]>> = [
  { labelKey: 'male', value: 'male' },
  { labelKey: 'female', value: 'female' },
  { labelKey: 'other', value: 'other' },
]

export const maritalStatusOptions: ReadonlyArray<
  LocalizedOption<(typeof maritalStatusValues)[number]>
> = [
  { labelKey: 'single', value: 'single' },
  { labelKey: 'married', value: 'married' },
  { labelKey: 'divorced', value: 'divorced' },
  { labelKey: 'widowed', value: 'widowed' },
]

export const employmentStatusOptions: ReadonlyArray<
  LocalizedOption<(typeof employmentStatusValues)[number]>
> = [
  { labelKey: 'employedFullTime', value: 'employed-full-time' },
  { labelKey: 'employedPartTime', value: 'employed-part-time' },
  { labelKey: 'selfEmployed', value: 'self-employed' },
  { labelKey: 'unemployed', value: 'unemployed' },
  { labelKey: 'student', value: 'student' },
]

export const housingStatusOptions: ReadonlyArray<
  LocalizedOption<(typeof housingStatusValues)[number]>
> = [
  { labelKey: 'renting', value: 'renting' },
  { labelKey: 'ownHome', value: 'own-home' },
  { labelKey: 'livingWithFamily', value: 'living-with-family' },
  { labelKey: 'temporaryShelter', value: 'temporary-shelter' },
]

export const dependentsOptions: ReadonlyArray<
  LocalizedOption<(typeof dependentsValues)[number]>
> = [
  { labelKey: 'dependents0', value: 0 },
  { labelKey: 'dependents1', value: 1 },
  { labelKey: 'dependents2', value: 2 },
  { labelKey: 'dependents3', value: 3 },
  { labelKey: 'dependents4Plus', value: 4 },
]

export const monthlyIncomeOptions: ReadonlyArray<
  LocalizedOption<(typeof monthlyIncomeValues)[number]>
> = [
  { labelKey: 'incomeRange0To500', value: 500 },
  { labelKey: 'incomeRange501To1000', value: 1000 },
  { labelKey: 'incomeRange1001To2000', value: 2000 },
  { labelKey: 'incomeRange2001To4000', value: 4000 },
  { labelKey: 'incomeRange4000Plus', value: 4001 },
]

export function getLocalizedOptions<TValue extends string | number>(
  options: ReadonlyArray<LocalizedOption<TValue>>,
  t: TFunction,
) {
  return options.map((option) => ({
    label: t(option.labelKey),
    value: String(option.value),
  }))
}

export function getLocalizedOptionLabel<TValue extends string | number>(
  options: ReadonlyArray<LocalizedOption<TValue>>,
  value: TValue | string | number,
  t: TFunction,
) {
  const matchedOption = options.find(
    (option) => String(option.value) === String(value),
  )

  return matchedOption ? t(matchedOption.labelKey) : String(value)
}
