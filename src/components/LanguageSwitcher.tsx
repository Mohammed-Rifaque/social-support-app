import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  isSupportedLocale,
  type SupportedLocale,
} from '../utils/localizedRoutes'

interface LanguageSwitcherProps {
  onLanguageChange?: () => void
}

export function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const currentLocale = i18n.language.startsWith('ar') ? 'ar' : 'en'
  const nextLocale = currentLocale === 'en' ? 'ar' : 'en'

  const switchLanguage = (nextLocale: SupportedLocale) => {
    const pathSegments = location.pathname.split('/')
    const hasLocalePrefix = isSupportedLocale(pathSegments[1])
    const pathWithoutLocale = hasLocalePrefix
      ? `/${pathSegments.slice(2).join('/')}`
      : location.pathname
    const nextPath =
      pathWithoutLocale === '/' ? `/${nextLocale}/step-1` : `/${nextLocale}${pathWithoutLocale}`

    void i18n.changeLanguage(nextLocale)
    void navigate(`${nextPath}${location.search}${location.hash}`, {
      replace: true,
    })
    onLanguageChange?.()
  }

  return (
    <button
      className={`language-switcher is-${currentLocale}`}
      type="button"
      aria-label={t('switchLanguageTo', {
        language: nextLocale === 'ar' ? t('languageArabic') : t('languageEnglish'),
      })}
      onClick={() => switchLanguage(nextLocale)}
    >
      <span className="language-option language-option-en">EN</span>
      <span className="language-toggle-track" aria-hidden="true">
        <span className="language-toggle-thumb">
          {currentLocale === 'ar' ? '🇸🇦' : '🇬🇧'}
        </span>
      </span>
      <span className="language-option language-option-ar">AR</span>
    </button>
  )
}
