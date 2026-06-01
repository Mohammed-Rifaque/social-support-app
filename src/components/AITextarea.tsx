import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { useApplication } from '../context/ApplicationContext'
import { generateSuggestion } from '../services/openai.service'
import type { NarrativeField } from '../types/application'
import { AiSuggestionModal } from './AiSuggestionModal'

interface AITextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  fieldType: NarrativeField
  error?: string
}

export function AITextarea({
  label,
  value,
  onChange,
  fieldType,
  error,
}: AITextareaProps) {
  const { t } = useTranslation()
  const { formData } = useApplication()
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleGenerateSuggestion = async () => {
    setIsGenerating(true)

    try {
      const nextSuggestion = await generateSuggestion({
        application: formData,
        currentValue: value,
        fieldType,
      })

      setSuggestion(nextSuggestion)
      setIsModalOpen(true)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to generate a suggestion right now.',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <div className="field-group">
        <div className="field-header">
          <label className="field-label" htmlFor={fieldType}>
            {label}
          </label>
          <button
            className="secondary-button"
            type="button"
            onClick={handleGenerateSuggestion}
            disabled={isGenerating}
          >
            {isGenerating ? t('loading') : t('helpMeWrite')}
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
        />

        <div className="field-footer">
          <span className={`field-error ${error ? 'is-visible' : ''}`}>
            {error}
          </span>
          <span className="character-count">
            {t('characters')}: {value.length} / 500
          </span>
        </div>

        <p className="helper-text">{t('optionalAiHint')}</p>
      </div>

      <AiSuggestionModal
        key={suggestion || fieldType}
        isOpen={isModalOpen}
        suggestion={suggestion}
        onAccept={(nextValue) => {
          onChange(nextValue)
          setIsModalOpen(false)
        }}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
