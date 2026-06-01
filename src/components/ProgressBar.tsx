import { stepMeta } from '../utils/steps'

interface ProgressBarProps {
  currentStep: 1 | 2 | 3
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const steps = [1, 2, 3] as const
  const { label, percentage } = stepMeta[currentStep]

  return (
    <section className="progress-card" aria-label="Application progress">
      <div className="progress-header">
        <div>
          <p className="eyebrow">{label}</p>
          <h2 className="progress-title">
            {label} {' '}
            {steps
              .map((step) => (step <= currentStep ? '●' : '○'))
              .join('──')}
          </h2>
        </div>
        <strong className="progress-percentage">{percentage}%</strong>
      </div>

      <div className="progress-track" aria-hidden="true">
        {steps.map((step) => (
          <div
            key={step}
            className={`progress-node ${step <= currentStep ? 'is-active' : ''}`}
          />
        ))}
      </div>
    </section>
  )
}
