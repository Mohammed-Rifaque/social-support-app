import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'

import { useApplication } from '../context/ApplicationContext'
import { Review } from '../pages/Review'
import { StepOne } from '../pages/StepOne'
import { StepThree } from '../pages/StepThree'
import { StepTwo } from '../pages/StepTwo'
import { Submissions } from '../pages/Submissions'
import { Success } from '../pages/Success'
import { getCompletedStepCount } from '../utils/applicationProgress'
import {
  isSupportedLocale,
  withLocalePrefix,
} from '../utils/localizedRoutes'

export function AppRoutes() {
  const { i18n } = useTranslation()
  const fallbackLocale = isSupportedLocale(i18n.language) ? i18n.language : 'en'

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={`/${fallbackLocale}/step-1`} />} />
      <Route path="/:locale/*" element={<LocalizedApplicationRoutes />} />
      <Route path="*" element={<Navigate replace to={`/${fallbackLocale}/step-1`} />} />
    </Routes>
  )
}

function LocalizedApplicationRoutes() {
  const { i18n } = useTranslation()
  const { locale } = useParams()

  useEffect(() => {
    if (isSupportedLocale(locale) && i18n.language !== locale) {
      void i18n.changeLanguage(locale)
    }
  }, [i18n, locale])

  if (!isSupportedLocale(locale)) {
    return <Navigate replace to="/en/step-1" />
  }

  return (
    <Routes>
      <Route index element={<Navigate replace to={withLocalePrefix('/step-1', locale)} />} />
      <Route path="step-1" element={<StepOne />} />
      <Route
        path="step-2"
        element={
          <RequireCompletedSteps minimumCompletedSteps={1}>
            <StepTwo />
          </RequireCompletedSteps>
        }
      />
      <Route
        path="step-3"
        element={
          <RequireCompletedSteps minimumCompletedSteps={2}>
            <StepThree />
          </RequireCompletedSteps>
        }
      />
      <Route
        path="review"
        element={
          <RequireCompletedSteps minimumCompletedSteps={3}>
            <Review />
          </RequireCompletedSteps>
        }
      />
      <Route
        path="success"
        element={
          <RequireSubmittedApplication>
            <Success />
          </RequireSubmittedApplication>
        }
      />
      <Route path="submissions" element={<Submissions />} />
      <Route path="*" element={<Navigate replace to={withLocalePrefix('/step-1', locale)} />} />
    </Routes>
  )
}

interface RequireCompletedStepsProps {
  children: ReactNode
  minimumCompletedSteps: 1 | 2 | 3
}

function RequireCompletedSteps({
  children,
  minimumCompletedSteps,
}: RequireCompletedStepsProps) {
  const { locale } = useParams()
  const { formData } = useApplication()
  const completedSteps = getCompletedStepCount(formData)

  if (completedSteps < minimumCompletedSteps) {
    return <Navigate replace to={withLocalePrefix(`/step-${completedSteps + 1}`, locale)} />
  }

  return children
}

interface RequireSubmittedApplicationProps {
  children: ReactNode
}

function RequireSubmittedApplication({ children }: RequireSubmittedApplicationProps) {
  const { locale } = useParams()
  const location = useLocation()
  const { latestSubmittedApplication } = useApplication()

  const hasSubmission = Boolean(
    latestSubmittedApplication?.id || location.state?.applicationId,
  )

  if (!hasSubmission) {
    return <Navigate replace to={withLocalePrefix('/step-1', locale)} />
  }

  return children
}
