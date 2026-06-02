import { useTranslation } from 'react-i18next'

import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'
import { getCompletedStepCount } from '../utils/applicationProgress'
import { stepMeta } from '../utils/steps'
import { useApplication } from '../context/ApplicationContext'

interface ProgressBarProps {
  completedSteps?: 0 | 1 | 2 | 3
  currentStep: 1 | 2 | 3
}

const steps = [1, 2, 3] as const

export function ProgressBar({
  currentStep,
  completedSteps = (currentStep - 1) as 0 | 1 | 2,
}: ProgressBarProps) {
  const { t } = useTranslation()
  const { formData } = useApplication()
  const navigate = useLocalizedNavigate()
  const completed = getCompletedStepCount(formData)

  return (
    <section className="progress-card" aria-label={t('applicationProgress')}>
      <div className="progress-header">
        <div>
          <p className="eyebrow">{t('applicationProgress')}</p>
          <h2 className="progress-title">
            {t('stepCount', { step: currentStep, total: 3 })}
          </h2>
        </div>
      </div>

      <ol className="progress-stepper vertical">
        {steps.map((step) => {
          const isComplete = step <= completed
          const isCurrent = step === currentStep && !isComplete
          const isClickable = step <= completed + 1 // allow current and next unlocked

          return (
            <li
              key={step}
              className={[
                'progress-step',
                isComplete ? 'is-complete' : '',
                isCurrent ? 'is-current' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <button
                className="progress-step-button"
                type="button"
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) {
                    navigate(`/step-${step}`)
                  }
                }}
              >
                <span className="progress-step-marker">
                  <StepIcon isComplete={isComplete} step={step} />
                </span>
                <span className="progress-step-label">
                  {t(stepMeta[step].labelKey)}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

interface StepIconProps {
  isComplete: boolean
  step: 1 | 2 | 3
}

function StepIcon({ isComplete, step }: StepIconProps) {
  if (isComplete) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="progress-step-icon"
        fill="none"
      >
        <path
          d="M5 12l4 4 10-10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
      </svg>
    )
  }

  if (step === 1) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="progress-step-icon"
        fill="none"
      >
        <path
          d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 8v6M21 11h-6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    )
  }

  if (step === 2) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="progress-step-icon"
        fill="none"
      >
        <path
          d="M5 5h14v14H5zM8 9h8M8 13h8M8 17h5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="progress-step-icon"
      fill="none"
    >
      <path
        d="M9 5h6M9 5v3h6V5M7 8H5v14h14V8h-2M8 15l2 2 5-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
