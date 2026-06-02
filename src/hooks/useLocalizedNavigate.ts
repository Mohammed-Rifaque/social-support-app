import { useCallback } from 'react'
import {
  useNavigate,
  useParams,
  type NavigateOptions,
} from 'react-router-dom'

import { withLocalePrefix } from '../utils/localizedRoutes'

export function useLocalizedNavigate() {
  const navigate = useNavigate()
  const { locale } = useParams()

  return useCallback(
    (path: string, options?: NavigateOptions) => {
      void navigate(withLocalePrefix(path, locale), options)
    },
    [locale, navigate],
  )
}

export function useLocalizedPath() {
  const { locale } = useParams()

  return useCallback(
    (path: string) => withLocalePrefix(path, locale),
    [locale],
  )
}
