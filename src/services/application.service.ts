import type { ApplicationForm, SubmittedApplication } from '../types/application'

export async function submitApplication(
  formData: ApplicationForm,
): Promise<SubmittedApplication> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 1500)
  })

  return {
    id: `SSA-${Date.now().toString().slice(-8)}`,
    submittedAt: new Date().toISOString(),
    data: formData,
  }
}
