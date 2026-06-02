import type { TFunction } from 'i18next'
import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form'

export function translateErrorMessage(
  message: string | undefined,
  t: TFunction,
) {
  if (!message) {
    return undefined
  }

  const translatedMessage = t(message)

  return translatedMessage === message
    ? t('validation.invalidField')
    : translatedMessage
}

export function getFieldErrorMessage(
  error: FieldError | undefined,
  t: TFunction,
) {
  return translateErrorMessage(error?.message, t)
}

export function getFirstErrorMessage<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  t: TFunction,
) {
  const firstError = Object.values(errors)[0]

  if (!firstError || typeof firstError !== 'object' || !('message' in firstError)) {
    return undefined
  }

  return typeof firstError.message === 'string'
    ? translateErrorMessage(firstError.message, t)
    : undefined
}
