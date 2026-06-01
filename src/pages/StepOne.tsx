import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ApplicationShell } from '../components/ApplicationShell'
import { useApplication } from '../context/ApplicationContext'
import {
  personalSchema,
  type PersonalFormValues,
} from '../schemas/personalSchema'

export function StepOne() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { formData, updateFormData } = useApplication()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PersonalFormValues>({
    defaultValues: {
      name: formData.name,
      nationalId: formData.nationalId,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
    },
    mode: 'onChange',
    resolver: zodResolver(personalSchema),
  })
  const watchedValues = useWatch({ control })

  useEffect(() => {
    updateFormData(watchedValues)
  }, [updateFormData, watchedValues])

  const onSubmit = (values: PersonalFormValues) => {
    updateFormData(values)
    void navigate('/step-2')
  }

  return (
    <ApplicationShell
      currentStep={1}
      title={t('stepOneTitle')}
      description={t('stepOneDescription')}
      actions={
        <button
          className="primary-button"
          type="submit"
          form="step-one-form"
          disabled={!isValid}
        >
          {t('next')}
        </button>
      }
    >
      <form id="step-one-form" className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          error={errors.name?.message}
          label={t('name')}
          register={register('name')}
          type="text"
        />
        <InputField
          error={errors.nationalId?.message}
          label={t('nationalId')}
          register={register('nationalId')}
          type="text"
        />
        <InputField
          error={errors.dateOfBirth?.message}
          label={t('dateOfBirth')}
          register={register('dateOfBirth')}
          type="date"
        />
        <SelectField
          error={errors.gender?.message}
          label={t('gender')}
          register={register('gender')}
          options={[
            { label: t('male'), value: 'male' },
            { label: t('female'), value: 'female' },
            { label: t('other'), value: 'other' },
          ]}
        />
        <InputField
          className="span-two"
          error={errors.address?.message}
          label={t('address')}
          register={register('address')}
          type="text"
        />
        <InputField
          error={errors.city?.message}
          label={t('city')}
          register={register('city')}
          type="text"
        />
        <InputField
          error={errors.state?.message}
          label={t('state')}
          register={register('state')}
          type="text"
        />
        <InputField
          error={errors.country?.message}
          label={t('country')}
          register={register('country')}
          type="text"
        />
        <InputField
          error={errors.phone?.message}
          label={t('phone')}
          register={register('phone')}
          type="tel"
        />
        <InputField
          error={errors.email?.message}
          label={t('email')}
          register={register('email')}
          type="email"
        />
      </form>
    </ApplicationShell>
  )
}

interface BaseFieldProps {
  error?: string
  label: string
}

interface InputFieldProps extends BaseFieldProps {
  className?: string
  register: UseFormRegisterReturn
  type: string
}

function InputField({
  className,
  error,
  label,
  register,
  type,
}: InputFieldProps) {
  const id = register.name

  return (
    <div className={`field-group ${className ?? ''}`.trim()}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`form-control ${error ? 'has-error' : ''}`}
        type={type}
        aria-label={label}
        aria-invalid={Boolean(error)}
        aria-required="true"
        {...register}
      />
      <span className={`field-error ${error ? 'is-visible' : ''}`}>{error}</span>
    </div>
  )
}

interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ label: string; value: string }>
  register: UseFormRegisterReturn
}

function SelectField({ error, label, options, register }: SelectFieldProps) {
  const { t } = useTranslation()
  const id = register.name

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={`form-control ${error ? 'has-error' : ''}`}
        aria-label={label}
        aria-invalid={Boolean(error)}
        aria-required="true"
        {...register}
      >
        <option value="">{t('selectOption')}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={`field-error ${error ? 'is-visible' : ''}`}>{error}</span>
    </div>
  )
}
