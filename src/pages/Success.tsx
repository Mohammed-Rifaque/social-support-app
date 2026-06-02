import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { ApplicationShell } from '../components/ApplicationShell'
import { useApplication } from '../context/ApplicationContext'
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'

export function Success() {
  const navigate = useLocalizedNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { latestSubmittedApplication, resetFormData } = useApplication()
  const submittedApplicationId =
    typeof location.state?.applicationId === 'string'
      ? location.state.applicationId
      : latestSubmittedApplication?.id
  const submittedAt = latestSubmittedApplication?.submittedAt
    ? new Date(latestSubmittedApplication.submittedAt).toLocaleString()
    : null

  const handleStartNew = () => {
    resetFormData()
    toast.success(t('applicationReset'))
    navigate('/step-1')
  }

  return (
    <ApplicationShell
      currentStep={3}
      title={t('successTitle')}
      description={t('successDescription')}
      showProgress={false}
      showSubmissionsLink={false}
      actions={
        <>
          <button
            className="ghost-button"
            type="button"
            onClick={() => navigate('/submissions')}
          >
            {t('viewSubmissions')}
          </button>
          <button className="primary-button" type="button" onClick={handleStartNew}>
            {t('startNew')}
          </button>
        </>
      }
    >
      <div className="success-card">
        <span className="success-badge">{t('submittedStatus')}</span>
        <p>{t('successDescription')}</p>
        {submittedApplicationId ? (
          <div className="submission-summary">
            <div className="submission-summary-item">
              <span>{t('applicationId')}</span>
              <strong>{submittedApplicationId}</strong>
            </div>
            {submittedAt ? (
              <div className="submission-summary-item">
                <span>{t('submittedAt')}</span>
                <strong>{submittedAt}</strong>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </ApplicationShell>
  )
}
