import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ApplicationShell } from '../components/ApplicationShell'
import { useApplication } from '../context/ApplicationContext'

export function Success() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { resetFormData } = useApplication()

  const handleStartNew = () => {
    resetFormData()
    toast.success(t('applicationReset'))
    void navigate('/step-1')
  }

  return (
    <ApplicationShell
      currentStep={3}
      title={t('successTitle')}
      description={t('successDescription')}
      actions={
        <button className="primary-button" type="button" onClick={handleStartNew}>
          {t('startNew')}
        </button>
      }
    >
      <div className="success-card">
        <span className="success-badge">Submitted</span>
        <p>
          {t('successDescription')}
        </p>
      </div>
    </ApplicationShell>
  )
}
