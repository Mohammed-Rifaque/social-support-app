import { useEffect, type PropsWithChildren, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from './LanguageSwitcher'
import { ProgressBar } from './ProgressBar'
import { SaveIndicator } from './SaveIndicator'

interface ApplicationShellProps extends PropsWithChildren {
  currentStep: 1 | 2 | 3
  title: string
  description: string
  actions?: ReactNode
}

export function ApplicationShell({
  children,
  currentStep,
  title,
  description,
  actions,
}: ApplicationShellProps) {
  const { i18n, t } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-topbar">
          <div>
            <p className="eyebrow">{t('appTitle')}</p>
            <h1>{title}</h1>
            <p className="hero-subtitle">{description}</p>
          </div>
          <div className="hero-tools">
            <LanguageSwitcher />
            <SaveIndicator />
          </div>
        </div>

        <ProgressBar currentStep={currentStep} />

        <div className="form-card">
          {children}
          {actions ? <div className="action-row">{actions}</div> : null}
        </div>
      </section>
    </main>
  )
}
