import type { TFunction } from 'i18next'

import {
  employmentStatusOptions,
  genderOptions,
  getLocalizedOptionLabel,
  housingStatusOptions,
  maritalStatusOptions,
  monthlyIncomeOptions,
} from './applicationOptions'

export function formatDateOfBirth(value: string) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatApplicationValue(
  field:
    | 'gender'
    | 'maritalStatus'
    | 'employmentStatus'
    | 'housingStatus'
    | 'monthlyIncome',
  value: string | number,
  t: TFunction,
) {
  const stringValue = String(value)

  switch (field) {
    case 'gender':
      return getLocalizedOptionLabel(genderOptions, stringValue, t)
    case 'maritalStatus':
      return getLocalizedOptionLabel(maritalStatusOptions, stringValue, t)
    case 'employmentStatus':
      return getLocalizedOptionLabel(employmentStatusOptions, stringValue, t)
    case 'housingStatus':
      return getLocalizedOptionLabel(housingStatusOptions, stringValue, t)
    case 'monthlyIncome':
      return getLocalizedOptionLabel(monthlyIncomeOptions, stringValue, t)
    default:
      return stringValue
  }
}
