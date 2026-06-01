import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div className="language-switcher" role="group" aria-label="Language switcher">
      <button
        className={i18n.language === 'en' ? 'is-selected' : ''}
        type="button"
        onClick={() => void i18n.changeLanguage('en')}
      >
        {t('languageEnglish')}
      </button>
      <span aria-hidden="true">|</span>
      <button
        className={i18n.language === 'ar' ? 'is-selected' : ''}
        type="button"
        onClick={() => void i18n.changeLanguage('ar')}
      >
        {t('languageArabic')}
      </button>
    </div>
  )
}
