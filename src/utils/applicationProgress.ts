import { familySchema } from '../schemas/familySchema'
import { narrativeSchema } from '../schemas/narrativeSchema'
import { personalSchema } from '../schemas/personalSchema'
import type { ApplicationForm } from '../types/application'

export function getCompletedStepCount(formData: ApplicationForm) {
  const isStepOneComplete = personalSchema.safeParse(formData).success
  const isStepTwoComplete = familySchema.safeParse(formData).success
  const isStepThreeComplete = narrativeSchema.safeParse(formData).success

  if (!isStepOneComplete) {
    return 0
  }

  if (!isStepTwoComplete) {
    return 1
  }

  if (!isStepThreeComplete) {
    return 2
  }

  return 3
}

export function getFirstIncompleteStepPath(formData: ApplicationForm) {
  const completedSteps = getCompletedStepCount(formData)

  if (completedSteps >= 3) {
    return null
  }

  return `/step-${completedSteps + 1}`
}
