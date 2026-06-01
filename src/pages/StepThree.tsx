import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AITextarea } from '../components/AITextarea'
import { ApplicationShell } from '../components/ApplicationShell'
import { useApplication } from '../context/ApplicationContext'
import {
  narrativeSchema,
  type NarrativeFormValues,
} from '../schemas/narrativeSchema'

export function StepThree() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { formData, updateFormData } = useApplication()
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NarrativeFormValues>({
    defaultValues: {
      currentFinancialSituation: formData.currentFinancialSituation,
      employmentCircumstances: formData.employmentCircumstances,
      reasonForApplying: formData.reasonForApplying,
    },
    mode: 'onChange',
    resolver: zodResolver(narrativeSchema),
  })
  const watchedValues = useWatch({ control })

  useEffect(() => {
    updateFormData(watchedValues)
  }, [updateFormData, watchedValues])

  const onSubmit = (values: NarrativeFormValues) => {
    updateFormData(values)
    void navigate('/review')
  }

  return (
    <ApplicationShell
      currentStep={3}
      title={t('stepThreeTitle')}
      description={t('stepThreeDescription')}
      actions={
        <>
          <button className="ghost-button" type="button" onClick={() => void navigate('/step-2')}>
            {t('back')}
          </button>
          <button
            className="primary-button"
            type="submit"
            form="step-three-form"
            disabled={!isValid}
          >
            {t('review')}
          </button>
        </>
      }
    >
      <form id="step-three-form" className="stacked-form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="currentFinancialSituation"
          render={({ field }) => (
            <AITextarea
              error={errors.currentFinancialSituation?.message}
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
              error={errors.employmentCircumstances?.message}
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
              error={errors.reasonForApplying?.message}
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
