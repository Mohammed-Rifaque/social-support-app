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
  type SubmittedApplication,
} from '../types/application'

interface ApplicationContextValue {
  formData: ApplicationForm
  submittedApplications: SubmittedApplication[]
  latestSubmittedApplication: SubmittedApplication | null
  updateFormData: (updates: Partial<ApplicationForm>) => void
  saveSubmittedApplication: (application: SubmittedApplication) => void
  resetFormData: () => void
  saveStatus: SaveStatus
}

const ApplicationContext = createContext<ApplicationContextValue | null>(null)

const STORAGE_KEY = 'social-support-application'
const SUBMISSIONS_STORAGE_KEY = 'social-support-submissions'

export function ApplicationProvider({ children }: PropsWithChildren) {
  const {
    value: formData,
    setValue: setFormData,
    clear,
    saveStatus,
  } = useLocalStorage<ApplicationForm>(STORAGE_KEY, applicationFormDefaults)
  const {
    value: submittedApplications,
    setValue: setSubmittedApplications,
  } = useLocalStorage<SubmittedApplication[]>(SUBMISSIONS_STORAGE_KEY, [])

  const updateFormData = useCallback(
    (updates: Partial<ApplicationForm>) => {
      setFormData((currentValue) => {
        const hasChanges = Object.entries(updates).some(
          ([key, value]) =>
            currentValue[key as keyof ApplicationForm] !== value,
        )

        return hasChanges ? { ...currentValue, ...updates } : currentValue
      })
    },
    [setFormData],
  )

  const saveSubmittedApplication = useCallback(
    (application: SubmittedApplication) => {
      setSubmittedApplications((currentValue) => [application, ...currentValue])
    },
    [setSubmittedApplications],
  )

  const resetFormData = useCallback(() => {
    clear()
    setFormData(applicationFormDefaults)
  }, [clear, setFormData])

  const latestSubmittedApplication = submittedApplications[0] ?? null

  const contextValue = useMemo(
    () => ({
      formData,
      submittedApplications,
      latestSubmittedApplication,
      updateFormData,
      saveSubmittedApplication,
      resetFormData,
      saveStatus,
    }),
    [
      formData,
      latestSubmittedApplication,
      resetFormData,
      saveStatus,
      saveSubmittedApplication,
      submittedApplications,
      updateFormData,
    ],
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
