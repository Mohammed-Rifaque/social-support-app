import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { ApplicationShell } from '../components/ApplicationShell'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { useApplication } from '../context/ApplicationContext'
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'
import { submitApplication } from '../services/application.service'
import {
  formatApplicationValue,
  formatDateOfBirth,
} from '../utils/applicationDisplay'

export function Review() {
  const navigate = useLocalizedNavigate()
  const { t } = useTranslation()
  const { formData, saveSubmittedApplication } = useApplication()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const submittedApplication = await submitApplication(formData)
      saveSubmittedApplication(submittedApplication)
      toast.success(t('applicationSubmitted'))
      navigate('/success', {
        state: { applicationId: submittedApplication.id },
      })
    } catch {
      toast.error(t('submissionFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ApplicationShell
      completedSteps={3}
      currentStep={3}
      title={t('reviewTitle')}
      description={t('reviewDescription')}
      actions={
        <>
          <button className="ghost-button" type="button" onClick={() => navigate('/step-3')}>
            {t('back')}
          </button>
          <button className="primary-button" type="button" onClick={() => void handleSubmit()} disabled={isSubmitting}>
            {isSubmitting ? (
              <LoadingIndicator label={t('submitting')} />
            ) : (
              t('submit')
            )}
          </button>
        </>
      }
    >
      <div className="review-grid">
        <ReviewSection
          onEdit={() => navigate('/step-1')}
          title={t('reviewSectionPersonal')}
          items={[
            [t('name'), formData.name],
            [t('nationalId'), formData.nationalId],
            [t('dateOfBirth'), formatDateOfBirth(formData.dateOfBirth)],
            [t('gender'), formatApplicationValue('gender', formData.gender, t)],
            [t('address'), formData.address],
            [t('city'), formData.city],
            [t('state'), formData.state],
            [t('country'), formData.country],
            [t('phone'), formData.phone],
            [t('email'), formData.email],
          ]}
        />
        <ReviewSection
          onEdit={() => navigate('/step-2')}
          title={t('reviewSectionFamily')}
          items={[
            [
              t('maritalStatus'),
              formatApplicationValue('maritalStatus', formData.maritalStatus, t),
            ],
            [t('dependents'), String(formData.dependents)],
            [
              t('employmentStatus'),
              formatApplicationValue(
                'employmentStatus',
                formData.employmentStatus,
                t,
              ),
            ],
            [
              t('monthlyIncome'),
              formatApplicationValue('monthlyIncome', formData.monthlyIncome, t),
            ],
            [
              t('housingStatus'),
              formatApplicationValue('housingStatus', formData.housingStatus, t),
            ],
          ]}
        />
        <ReviewSection
          onEdit={() => navigate('/step-3')}
          title={t('reviewSectionNarrative')}
          items={[
            [t('currentFinancialSituation'), formData.currentFinancialSituation],
            [t('employmentCircumstances'), formData.employmentCircumstances],
            [t('reasonForApplying'), formData.reasonForApplying],
          ]}
        />
      </div>
    </ApplicationShell>
  )
}

interface ReviewSectionProps {
  items: Array<[string, string]>
  onEdit: () => void
  title: string
}

function ReviewSection({ items, onEdit, title }: ReviewSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="review-section">
      <div className="review-section-header">
        <h2>{title}</h2>
        <button className="secondary-button" type="button" onClick={onEdit}>
          {t('edit')}
        </button>
      </div>
      <dl>
        {items.map(([label, value]) => (
          <div key={label} className="review-item">
            <dt>{label}</dt>
            <dd>{value || '-'}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
