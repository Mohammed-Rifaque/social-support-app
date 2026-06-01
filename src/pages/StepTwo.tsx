import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ApplicationShell } from '../components/ApplicationShell'
import { useApplication } from '../context/ApplicationContext'
import { familySchema, type FamilyFormValues } from '../schemas/familySchema'

export function StepTwo() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { formData, updateFormData } = useApplication()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FamilyFormValues>({
    defaultValues: {
      maritalStatus: formData.maritalStatus,
      dependents: formData.dependents,
      employmentStatus: formData.employmentStatus,
      monthlyIncome: formData.monthlyIncome,
      housingStatus: formData.housingStatus,
    },
    mode: 'onChange',
    resolver: zodResolver(familySchema),
  })
  const watchedValues = useWatch({ control })

  useEffect(() => {
    updateFormData(watchedValues)
  }, [updateFormData, watchedValues])

  const onSubmit = (values: FamilyFormValues) => {
    updateFormData(values)
    void navigate('/step-3')
  }

  return (
    <ApplicationShell
      currentStep={2}
      title={t('stepTwoTitle')}
      description={t('stepTwoDescription')}
      actions={
        <>
          <button className="ghost-button" type="button" onClick={() => void navigate('/step-1')}>
            {t('back')}
          </button>
          <button
            className="primary-button"
            type="submit"
            form="step-two-form"
            disabled={!isValid}
          >
            {t('next')}
          </button>
        </>
      }
    >
      <form id="step-two-form" className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        <SelectField
          error={errors.maritalStatus?.message}
          label={t('maritalStatus')}
          register={register('maritalStatus')}
          options={[
            { label: t('single'), value: 'single' },
            { label: t('married'), value: 'married' },
            { label: t('divorced'), value: 'divorced' },
            { label: t('widowed'), value: 'widowed' },
          ]}
        />
        <SelectField
          error={errors.dependents?.message}
          label={t('dependents')}
          register={register('dependents', {
            setValueAs: (value: string) => Number(value),
          })}
          options={[
            { label: '0', value: '0' },
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4+', value: '4' },
          ]}
        />
        <SelectField
          error={errors.employmentStatus?.message}
          label={t('employmentStatus')}
          register={register('employmentStatus')}
          options={[
            { label: t('employedFullTime'), value: 'employed-full-time' },
            { label: t('employedPartTime'), value: 'employed-part-time' },
            { label: t('selfEmployed'), value: 'self-employed' },
            { label: t('unemployed'), value: 'unemployed' },
            { label: t('student'), value: 'student' },
          ]}
        />
        <SelectField
          error={errors.monthlyIncome?.message}
          label={t('monthlyIncome')}
          register={register('monthlyIncome', {
            setValueAs: (value: string) => Number(value),
          })}
          options={[
            { label: '$0 - $500', value: '500' },
            { label: '$501 - $1,000', value: '1000' },
            { label: '$1,001 - $2,000', value: '2000' },
            { label: '$2,001 - $4,000', value: '4000' },
            { label: '$4,000+', value: '4001' },
          ]}
        />
        <SelectField
          error={errors.housingStatus?.message}
          label={t('housingStatus')}
          register={register('housingStatus')}
          options={[
            { label: t('renting'), value: 'renting' },
            { label: t('ownHome'), value: 'own-home' },
            { label: t('livingWithFamily'), value: 'living-with-family' },
            { label: t('temporaryShelter'), value: 'temporary-shelter' },
          ]}
        />
      </form>
    </ApplicationShell>
  )
}

interface SelectFieldProps {
  error?: string
  label: string
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
