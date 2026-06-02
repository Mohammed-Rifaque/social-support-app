export const supportedLocales = ['en', 'ar'] as const

export type SupportedLocale = (typeof supportedLocales)[number]

export function isSupportedLocale(locale: string | undefined): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale)
}

export function getSupportedLocale(locale: string | undefined): SupportedLocale {
  return isSupportedLocale(locale) ? locale : 'en'
}

export function withLocalePrefix(path: string, locale: string | undefined) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `/${getSupportedLocale(locale)}${normalizedPath}`
}
