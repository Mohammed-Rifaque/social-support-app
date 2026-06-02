import { useEffect, type PropsWithChildren, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { useLocalizedPath } from '../hooks/useLocalizedNavigate'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ProgressBar } from './ProgressBar'
import { SaveIndicator } from './SaveIndicator'

interface ApplicationShellProps extends PropsWithChildren {
  completedSteps?: 0 | 1 | 2 | 3
  currentStep: 1 | 2 | 3
  title: string
  description: string
  actions?: ReactNode
  showProgress?: boolean
  showSubmissionsLink?: boolean
}

export function ApplicationShell({
  children,
  completedSteps,
  currentStep,
  title,
  description,
  actions,
  showProgress = true,
  showSubmissionsLink = true,
}: ApplicationShellProps) {
  const { i18n, t } = useTranslation()
  const location = useLocation()
  const localizedPath = useLocalizedPath()

  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <main className="app-shell">
      <section className="hero-card two-column">
        <div className="hero-topbar">
          <div>
            <p className="eyebrow">{t('appTitle')}</p>
            <h1>{title}</h1>
            <p className="hero-subtitle">{description}</p>
          </div>
          <div className="hero-tools">
            {showSubmissionsLink ? (
              <Link className="toolbar-link" to={localizedPath('/submissions')}>
                {t('viewSubmissions')}
              </Link>
            ) : null}
            <LanguageSwitcher />
            <SaveIndicator />
          </div>
        </div>

        <div className="hero-body">
          <div className="hero-body-form">
            <div className="form-card">
              {children}
              {actions ? <div className="action-row">{actions}</div> : null}
            </div>
          </div>
          {showProgress ? (
            <div className="hero-body-progress">
              <ProgressBar
                completedSteps={completedSteps}
                currentStep={currentStep}
              />
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
