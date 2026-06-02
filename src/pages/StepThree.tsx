import { zodResolver } from '@hookform/resolvers/zod'
import {
  Controller,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { AITextarea } from '../components/AITextarea'
import { ApplicationShell } from '../components/ApplicationShell'
import { useApplication } from '../context/ApplicationContext'
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'
import { useSyncedFormDraft } from '../hooks/useSyncedFormDraft'
import {
  narrativeSchema,
  type NarrativeFormValues,
} from '../schemas/narrativeSchema'
import {
  getFieldErrorMessage,
  getFirstErrorMessage,
} from '../utils/formErrors'

export function StepThree() {
  const navigate = useLocalizedNavigate()
  const { t } = useTranslation()
  const { formData, updateFormData } = useApplication()
  const {
    control,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<NarrativeFormValues>({
    defaultValues: {
      currentFinancialSituation: formData.currentFinancialSituation,
      employmentCircumstances: formData.employmentCircumstances,
      reasonForApplying: formData.reasonForApplying,
    },
    mode: 'onChange',
    resolver: zodResolver(narrativeSchema),
    shouldFocusError: true,
  })
  useSyncedFormDraft<NarrativeFormValues>(control, updateFormData)

  const onSubmit: SubmitHandler<NarrativeFormValues> = (values) => {
    updateFormData(values)
    toast.success(t('stepThreeSaved'))
    navigate('/review')
  }

  const onInvalid: SubmitErrorHandler<NarrativeFormValues> = (errors) => {
    toast.error(getFirstErrorMessage(errors, t) || t('validationErrors'))
  }

  const submitCurrentStep = handleSubmit(onSubmit, onInvalid)
  const firstErrorMessage = getFirstErrorMessage(errors, t)

  return (
    <ApplicationShell
      currentStep={3}
      title={t('stepThreeTitle')}
      description={t('stepThreeDescription')}
      actions={
        <>
          <button className="ghost-button" type="button" onClick={() => navigate('/step-2')}>
            {t('back')}
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => void submitCurrentStep()}
          >
            {t('review')}
          </button>
        </>
      }
    >
      <form
        id="step-three-form"
        className="stacked-form"
        noValidate
        onSubmit={submitCurrentStep}
      >
        {submitCount > 0 && firstErrorMessage ? (
          <p className="form-alert" role="alert">
            {firstErrorMessage}
          </p>
        ) : null}
        <Controller
          control={control}
          name="currentFinancialSituation"
          render={({ field }) => (
            <AITextarea
              error={getFieldErrorMessage(errors.currentFinancialSituation, t)}
              fieldType="currentFinancialSituation"
              label={t('currentFinancialSituation')}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="employmentCircumstances"
          render={({ field }) => (
            <AITextarea
              error={getFieldErrorMessage(errors.employmentCircumstances, t)}
              fieldType="employmentCircumstances"
              label={t('employmentCircumstances')}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="reasonForApplying"
          render={({ field }) => (
            <AITextarea
              error={getFieldErrorMessage(errors.reasonForApplying, t)}
              fieldType="reasonForApplying"
              label={t('reasonForApplying')}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
      </form>
    </ApplicationShell>
  )
}
