import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'

import { LoadingIndicator } from './LoadingIndicator'

interface AiSuggestionModalProps {
  isOpen: boolean
  isLoading: boolean
  suggestion: string
  onAccept: (value: string) => void
  onClose: () => void
}

export function AiSuggestionModal({
  isOpen,
  isLoading,
  suggestion,
  onAccept,
  onClose,
}: AiSuggestionModalProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(() => suggestion)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previousFocusRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), textarea:not(:disabled), [href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )

      if (!focusableElements?.length) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    previousFocusRef.current = document.activeElement
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      window.clearTimeout(focusTimer)

      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-suggestion-title"
        aria-describedby={
          isLoading ? 'ai-suggestion-loading' : 'ai-suggestion-body'
        }
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">AI</p>
            <h2 id="ai-suggestion-title">{t('generatedSuggestion')}</h2>
          </div>
          <button
            ref={closeButtonRef}
            className="ghost-button"
            type="button"
            onClick={onClose}
            aria-label={t('discard')}
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div
            id="ai-suggestion-loading"
            className="modal-loading"
            aria-live="polite"
            aria-busy="true"
          >
            <LoadingIndicator label={t('generatingSuggestion')} />
            <div className="skeleton-block">
              <span className="skeleton-line skeleton-line-long" />
              <span className="skeleton-line skeleton-line-medium" />
              <span className="skeleton-line skeleton-line-long" />
              <span className="skeleton-line skeleton-line-short" />
            </div>
          </div>
        ) : isEditing ? (
          <textarea
            id="ai-suggestion-body"
            className="modal-textarea"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={8}
          />
        ) : (
          <p id="ai-suggestion-body" className="modal-copy">{draft}</p>
        )}

        <div className="modal-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={() => setIsEditing((currentValue) => !currentValue)}
            disabled={isLoading}
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
            disabled={isLoading}
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
