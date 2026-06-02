import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { ApplicationShell } from '../components/ApplicationShell'
import { SelectField } from '../components/FormFields'
import { useApplication } from '../context/ApplicationContext'
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'
import { useSyncedFormDraft } from '../hooks/useSyncedFormDraft'
import { familySchema, type FamilyFormValues } from '../schemas/familySchema'
import {
  dependentsOptions,
  employmentStatusOptions,
  getLocalizedOptions,
  housingStatusOptions,
  maritalStatusOptions,
  monthlyIncomeOptions,
} from '../utils/applicationOptions'
import {
  getFieldErrorMessage,
  getFirstErrorMessage,
} from '../utils/formErrors'

export function StepTwo() {
  const navigate = useLocalizedNavigate()
  const { t } = useTranslation()
  const { formData, updateFormData } = useApplication()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<FamilyFormValues>({
    defaultValues: {
      maritalStatus: formData.maritalStatus || undefined,
      dependents: formData.dependents,
      employmentStatus: formData.employmentStatus || undefined,
      monthlyIncome: formData.monthlyIncome || undefined,
      housingStatus: formData.housingStatus || undefined,
    },
    mode: 'onChange',
    resolver: zodResolver(familySchema),
    shouldFocusError: true,
  })
  useSyncedFormDraft<FamilyFormValues>(control, updateFormData)

  const onSubmit: SubmitHandler<FamilyFormValues> = (values) => {
    updateFormData(values)
    toast.success(t('stepTwoSaved'))
    navigate('/step-3')
  }

  const onInvalid: SubmitErrorHandler<FamilyFormValues> = (errors) => {
    toast.error(getFirstErrorMessage(errors, t) || t('validationErrors'))
  }

  const submitCurrentStep = handleSubmit(onSubmit, onInvalid)
  const firstErrorMessage = getFirstErrorMessage(errors, t)

  return (
    <ApplicationShell
      currentStep={2}
      title={t('stepTwoTitle')}
      description={t('stepTwoDescription')}
      actions={
        <>
          <button className="ghost-button" type="button" onClick={() => navigate('/step-1')}>
            {t('back')}
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => void submitCurrentStep()}
          >
            {t('next')}
          </button>
        </>
      }
    >
      <form
        id="step-two-form"
        className="form-grid"
        noValidate
        onSubmit={submitCurrentStep}
      >
        {submitCount > 0 && firstErrorMessage ? (
          <p className="form-alert span-two" role="alert">
            {firstErrorMessage}
          </p>
        ) : null}
        <SelectField
          error={getFieldErrorMessage(errors.maritalStatus, t)}
          label={t('maritalStatus')}
          register={register('maritalStatus')}
          options={getLocalizedOptions(maritalStatusOptions, t)}
        />
        <SelectField
          error={getFieldErrorMessage(errors.dependents, t)}
          label={t('dependents')}
          register={register('dependents', {
            setValueAs: (value: string) => Number(value),
          })}
          options={getLocalizedOptions(dependentsOptions, t)}
        />
        <SelectField
          error={getFieldErrorMessage(errors.employmentStatus, t)}
          label={t('employmentStatus')}
          register={register('employmentStatus')}
          options={getLocalizedOptions(employmentStatusOptions, t)}
        />
        <SelectField
          error={getFieldErrorMessage(errors.monthlyIncome, t)}
          label={t('monthlyIncome')}
          register={register('monthlyIncome', {
            setValueAs: (value: string) => Number(value),
          })}
          options={getLocalizedOptions(monthlyIncomeOptions, t)}
        />
        <SelectField
          className="span-two"
          error={getFieldErrorMessage(errors.housingStatus, t)}
          label={t('housingStatus')}
          register={register('housingStatus')}
          options={getLocalizedOptions(housingStatusOptions, t)}
        />
      </form>
    </ApplicationShell>
  )
}
