import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { ApplicationShell } from '../components/ApplicationShell'
import { useApplication } from '../context/ApplicationContext'
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'
import { formatApplicationValue } from '../utils/applicationDisplay'

export function Submissions() {
  const navigate = useLocalizedNavigate()
  const { t } = useTranslation()
  const { resetFormData, submittedApplications } = useApplication()

  const handleStartNew = () => {
    resetFormData()
    toast.success(t('applicationReset'))
    navigate('/step-1')
  }

  return (
    <ApplicationShell
      currentStep={3}
      title={t('submissionsTitle')}
      description={t('submissionsDescription')}
      showProgress={false}
      showSubmissionsLink={false}
      actions={
        <button className="primary-button" type="button" onClick={handleStartNew}>
          {t('startNew')}
        </button>
      }
    >
      {submittedApplications.length === 0 ? (
        <div className="empty-state">
          <h2>{t('noSubmissionsTitle')}</h2>
          <p>{t('noSubmissionsDescription')}</p>
        </div>
      ) : (
        <div className="submission-list">
          {submittedApplications.map((application) => (
            <article key={application.id} className="submission-record">
              <div className="submission-record-header">
                <div>
                  <p className="eyebrow">{t('applicationId')}</p>
                  <h2>{application.id}</h2>
                </div>
                <p className="submission-record-time">
                  {new Date(application.submittedAt).toLocaleString()}
                </p>
              </div>

              <dl className="submission-record-grid">
                <div className="review-item">
                  <dt>{t('name')}</dt>
                  <dd>{application.data.name || '-'}</dd>
                </div>
                <div className="review-item">
                  <dt>{t('email')}</dt>
                  <dd>{application.data.email || '-'}</dd>
                </div>
                <div className="review-item">
                  <dt>{t('phone')}</dt>
                  <dd>{application.data.phone || '-'}</dd>
                </div>
                <div className="review-item">
                  <dt>{t('employmentStatus')}</dt>
                  <dd>
                    {formatApplicationValue(
                      'employmentStatus',
                      application.data.employmentStatus,
                      t,
                    ) || '-'}
                  </dd>
                </div>
                <div className="review-item">
                  <dt>{t('monthlyIncome')}</dt>
                  <dd>
                    {formatApplicationValue(
                      'monthlyIncome',
                      application.data.monthlyIncome,
                      t,
                    )}
                  </dd>
                </div>
                <div className="review-item">
                  <dt>{t('reasonForApplying')}</dt>
                  <dd>{application.data.reasonForApplying || '-'}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </ApplicationShell>
  )
}
