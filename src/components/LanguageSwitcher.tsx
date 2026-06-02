import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  isSupportedLocale,
  type SupportedLocale,
} from '../utils/localizedRoutes'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

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
  }

  return (
    <div className="language-switcher" role="group" aria-label="Language switcher">
      <button
        className={i18n.language === 'en' ? 'is-selected' : ''}
        type="button"
        aria-current={i18n.language === 'en' ? 'true' : undefined}
        onClick={() => switchLanguage('en')}
      >
        {t('languageEnglish')}
      </button>
      <span className="language-divider" aria-hidden="true" />
      <button
        className={i18n.language === 'ar' ? 'is-selected' : ''}
        type="button"
        aria-current={i18n.language === 'ar' ? 'true' : undefined}
        onClick={() => switchLanguage('ar')}
      >
        {t('languageArabic')}
      </button>
    </div>
  )
}
