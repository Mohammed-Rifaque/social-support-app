import { useEffect, useState, type PropsWithChildren, type ReactNode } from 'react'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
        <header className="app-header">
          <Link className="app-brand" to={localizedPath('/step-1')}>
            {t('appTitle')}
          </Link>

          <div className="header-actions">
            <nav className="desktop-nav" aria-label={t('mainNavigation')}>
              {showSubmissionsLink ? (
                <Link className="toolbar-link" to={localizedPath('/submissions')}>
                  {t('viewSubmissions')}
                </Link>
              ) : null}
              <LanguageSwitcher />
            </nav>

            <SaveIndicator />

            <button
              className="menu-button"
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={t('menu')}
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>

          <nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label={t('mainNavigation')}
            hidden={!isMenuOpen}
          >
            {showSubmissionsLink ? (
              <Link
                className="toolbar-link"
                to={localizedPath('/submissions')}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('viewSubmissions')}
              </Link>
            ) : null}
            <LanguageSwitcher onLanguageChange={() => setIsMenuOpen(false)} />
          </nav>
        </header>

        <div className="hero-topbar">
          <div>
            <p className="eyebrow">
              {showProgress
                ? t('stepCount', { step: currentStep, total: 3 })
                : t('appTitle')}
            </p>
            <h1>{title}</h1>
            <p className="hero-subtitle">{description}</p>
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
