/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react'

import { useLocalStorage, type SaveStatus } from '../hooks/useLocalStorage'
import {
  applicationFormDefaults,
  type ApplicationForm,
} from '../types/application'

interface ApplicationContextValue {
  formData: ApplicationForm
  updateFormData: (updates: Partial<ApplicationForm>) => void
  resetFormData: () => void
  saveStatus: SaveStatus
}

const ApplicationContext = createContext<ApplicationContextValue | null>(null)

const STORAGE_KEY = 'social-support-application'

export function ApplicationProvider({ children }: PropsWithChildren) {
  const {
    value: formData,
    setValue: setFormData,
    clear,
    saveStatus,
  } = useLocalStorage<ApplicationForm>(STORAGE_KEY, applicationFormDefaults)

  const updateFormData = useCallback(
    (updates: Partial<ApplicationForm>) => {
      setFormData((currentValue) => ({ ...currentValue, ...updates }))
    },
    [setFormData],
  )

  const resetFormData = useCallback(() => {
    clear()
    setFormData(applicationFormDefaults)
  }, [clear, setFormData])

  const contextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      resetFormData,
      saveStatus,
    }),
    [formData, resetFormData, saveStatus, updateFormData],
  )

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplication() {
  const context = useContext(ApplicationContext)

  if (!context) {
    throw new Error('useApplication must be used within ApplicationProvider.')
  }

  return context
}
