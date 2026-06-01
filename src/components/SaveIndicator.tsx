import { useTranslation } from 'react-i18next'

import { useApplication } from '../context/ApplicationContext'

export function SaveIndicator() {
  const { t } = useTranslation()
  const { saveStatus } = useApplication()

  if (saveStatus === 'idle') {
    return null
  }

  const contentMap = {
    error: t('saveError'),
    saved: `✓ ${t('saved')}`,
    saving: t('saving'),
  }

  return (
    <p className={`save-indicator ${saveStatus === 'error' ? 'is-error' : ''}`}>
      {contentMap[saveStatus]}
    </p>
  )
}
