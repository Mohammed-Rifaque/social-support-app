import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AiSuggestionModalProps {
  isOpen: boolean
  suggestion: string
  onAccept: (value: string) => void
  onClose: () => void
}

export function AiSuggestionModal({
  isOpen,
  suggestion,
  onAccept,
  onClose,
}: AiSuggestionModalProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(() => suggestion)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-suggestion-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">AI</p>
            <h2 id="ai-suggestion-title">{t('generatedSuggestion')}</h2>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={onClose}
            aria-label={t('discard')}
          >
            ×
          </button>
        </div>

        {isEditing ? (
          <textarea
            className="modal-textarea"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={8}
          />
        ) : (
          <p className="modal-copy">{draft}</p>
        )}

        <div className="modal-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={() => setIsEditing((currentValue) => !currentValue)}
          >
            {t('edit')}
          </button>
          <button className="ghost-button" type="button" onClick={onClose}>
            {t('discard')}
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => onAccept(draft)}
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
