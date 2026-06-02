interface LoadingIndicatorProps {
  label: string
}

export function LoadingIndicator({ label }: LoadingIndicatorProps) {
  return (
    <span className="loading-indicator" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}
