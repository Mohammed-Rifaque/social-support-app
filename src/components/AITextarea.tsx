import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { useApplication } from '../context/ApplicationContext'
import { generateSuggestion } from '../services/openai.service'
import type { NarrativeField } from '../types/application'
import { AiSuggestionModal } from './AiSuggestionModal'
import { LoadingIndicator } from './LoadingIndicator'

interface AITextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  fieldType: NarrativeField
  error?: string
}

const MIN_NARRATIVE_CHARACTERS = 30

export function AITextarea({
  label,
  value,
  onChange,
  fieldType,
  error,
}: AITextareaProps) {
  const { i18n, t } = useTranslation()
  const { formData } = useApplication()
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const errorId = `${fieldType}-error`
  const helperId = `${fieldType}-helper`
  const counterId = `${fieldType}-count`
  const isTooShort = value.trim().length > 0 && value.trim().length < MIN_NARRATIVE_CHARACTERS

  const handleGenerateSuggestion = async () => {
    setSuggestion('')
    setIsModalOpen(true)
    setIsGenerating(true)

    try {
      const nextSuggestion = await generateSuggestion({
        application: formData,
        currentValue: value,
        fieldType,
        language: i18n.language,
      })

      setSuggestion(nextSuggestion)
      setIsModalOpen(true)
      toast.success(t('suggestionGenerated'))
    } catch (error) {
      setIsModalOpen(false)
      const errorMessage =
        error instanceof Error && error.message.startsWith('aiError.')
          ? t(error.message)
          : t('aiError.unable')

      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <div className="field-group">
        <div className="field-header">
          <label className="field-label" htmlFor={fieldType}>
            <span>{label}</span>
            <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <button
          className="secondary-button"
          type="button"
          onClick={handleGenerateSuggestion}
          disabled={isGenerating}
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <LoadingIndicator label={t('generatingSuggestion')} />
          ) : (
            t('helpMeWrite')
          )}
        </button>
        </div>

        <textarea
          id={fieldType}
          className={`form-control textarea-control ${error ? 'has-error' : ''}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={7}
          maxLength={500}
          aria-label={label}
          aria-invalid={Boolean(error)}
          aria-required="true"
          aria-describedby={[error ? errorId : null, helperId, counterId].filter(Boolean).join(' ')}
          required
        />

        <div className="field-footer">
          <span
            id={errorId}
            className={`field-error ${error ? 'is-visible' : ''}`}
            role={error ? 'alert' : undefined}
          >
            {error}
          </span>
          <span
            id={counterId}
            className={`character-count ${isTooShort ? 'is-warning' : ''}`}
          >
            {t('characters')}: {value.length} / 500
          </span>
        </div>

        <p id={helperId} className="helper-text">
          {t('narrativeHint')}
        </p>
      </div>

      <AiSuggestionModal
        key={`${fieldType}-${suggestion}-${String(isGenerating)}`}
        isOpen={isModalOpen}
        isLoading={isGenerating}
        suggestion={suggestion}
        onAccept={(nextValue) => {
          onChange(nextValue)
          toast.success(t('suggestionApplied'))
          setIsModalOpen(false)
        }}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
