import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ApplicationShell } from '../components/ApplicationShell'
import { useApplication } from '../context/ApplicationContext'
import { submitApplication } from '../services/application.service'

export function Review() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { formData } = useApplication()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await submitApplication()
      void navigate('/success')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ApplicationShell
      currentStep={3}
      title={t('reviewTitle')}
      description={t('reviewDescription')}
      actions={
        <>
          <button className="ghost-button" type="button" onClick={() => void navigate('/step-3')}>
            {t('back')}
          </button>
          <button className="primary-button" type="button" onClick={() => void handleSubmit()} disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
          </button>
        </>
      }
    >
      <div className="review-grid">
        <ReviewSection
          title={t('reviewSectionPersonal')}
          items={[
            [t('name'), formData.name],
            [t('nationalId'), formData.nationalId],
            [t('dateOfBirth'), formData.dateOfBirth],
            [t('gender'), formData.gender],
            [t('address'), formData.address],
            [t('city'), formData.city],
            [t('state'), formData.state],
            [t('country'), formData.country],
            [t('phone'), formData.phone],
            [t('email'), formData.email],
          ]}
        />
        <ReviewSection
          title={t('reviewSectionFamily')}
          items={[
            [t('maritalStatus'), formData.maritalStatus],
            [t('dependents'), String(formData.dependents)],
            [t('employmentStatus'), formData.employmentStatus],
            [t('monthlyIncome'), String(formData.monthlyIncome)],
            [t('housingStatus'), formData.housingStatus],
          ]}
        />
        <ReviewSection
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
  title: string
}

function ReviewSection({ items, title }: ReviewSectionProps) {
  return (
    <section className="review-section">
      <h2>{title}</h2>
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
