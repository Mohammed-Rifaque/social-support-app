import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { ApplicationShell } from '../components/ApplicationShell'
import { InputField, SelectField } from '../components/FormFields'
import { useApplication } from '../context/ApplicationContext'
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'
import { useSyncedFormDraft } from '../hooks/useSyncedFormDraft'
import {
  personalSchema,
  type PersonalFormValues,
} from '../schemas/personalSchema'
import { genderOptions, getLocalizedOptions } from '../utils/applicationOptions'
import {
  getFieldErrorMessage,
  getFirstErrorMessage,
} from '../utils/formErrors'

export function StepOne() {
  const navigate = useLocalizedNavigate()
  const { t } = useTranslation()
  const { formData, updateFormData } = useApplication()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<PersonalFormValues>({
    defaultValues: {
      name: formData.name,
      nationalId: formData.nationalId,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender || undefined,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
    },
    mode: 'onChange',
    resolver: zodResolver(personalSchema),
    shouldFocusError: true,
  })
  useSyncedFormDraft<PersonalFormValues>(control, updateFormData)

  const onSubmit: SubmitHandler<PersonalFormValues> = (values) => {
    updateFormData(values)
    toast.success(t('stepOneSaved'))
    navigate('/step-2')
  }

  const onInvalid: SubmitErrorHandler<PersonalFormValues> = (errors) => {
    toast.error(getFirstErrorMessage(errors, t) || t('validationErrors'))
  }

  const submitCurrentStep = handleSubmit(onSubmit, onInvalid)
  const firstErrorMessage = getFirstErrorMessage(errors, t)

  return (
    <ApplicationShell
      currentStep={1}
      title={t('stepOneTitle')}
      description={t('stepOneDescription')}
      actions={
        <button
          className="primary-button"
          type="button"
          onClick={() => void submitCurrentStep()}
        >
          {t('next')}
        </button>
      }
    >
      <form
        id="step-one-form"
        className="form-grid"
        noValidate
        onSubmit={submitCurrentStep}
      >
        {submitCount > 0 && firstErrorMessage ? (
          <p className="form-alert span-two" role="alert">
            {firstErrorMessage}
          </p>
        ) : null}
        <InputField
          error={getFieldErrorMessage(errors.name, t)}
          label={t('name')}
          register={register('name')}
          type="text"
        />
        <InputField
          error={getFieldErrorMessage(errors.nationalId, t)}
          helperText={t('nationalIdHint')}
          label={t('nationalId')}
          register={register('nationalId')}
          type="text"
        />
        <InputField
          error={getFieldErrorMessage(errors.dateOfBirth, t)}
          label={t('dateOfBirth')}
          register={register('dateOfBirth')}
          type="date"
        />
        <SelectField
          error={getFieldErrorMessage(errors.gender, t)}
          label={t('gender')}
          register={register('gender')}
          options={getLocalizedOptions(genderOptions, t)}
        />
        <InputField
          className="span-two"
          error={getFieldErrorMessage(errors.address, t)}
          label={t('address')}
          register={register('address')}
          type="text"
        />
        <InputField
          error={getFieldErrorMessage(errors.city, t)}
          label={t('city')}
          register={register('city')}
          type="text"
        />
        <InputField
          error={getFieldErrorMessage(errors.state, t)}
          label={t('state')}
          register={register('state')}
          type="text"
        />
        <InputField
          error={getFieldErrorMessage(errors.country, t)}
          label={t('country')}
          register={register('country')}
          type="text"
        />
        <InputField
          error={getFieldErrorMessage(errors.phone, t)}
          label={t('phone')}
          register={register('phone')}
          type="tel"
        />
        <InputField
          error={getFieldErrorMessage(errors.email, t)}
          className="span-two"
          label={t('email')}
          register={register('email')}
          type="email"
        />
      </form>
    </ApplicationShell>
  )
}
