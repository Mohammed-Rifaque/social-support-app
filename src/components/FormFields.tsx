import { useTranslation } from 'react-i18next'
import type { UseFormRegisterReturn } from 'react-hook-form'
import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from 'react'

interface BaseFieldProps {
  className?: string
  error?: string
  helperText?: string
  label: string
  register: UseFormRegisterReturn
  required?: boolean
  tooltip?: string
}

interface InputFieldProps extends BaseFieldProps {
  autoComplete?: HTMLInputAutoCompleteAttribute
  inputMode?: 'email' | 'numeric' | 'search' | 'tel' | 'text' | 'url'
  placeholder?: string
  type: HTMLInputTypeAttribute
}

interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ label: string; value: string }>
}

export function InputField({
  className,
  autoComplete,
  error,
  helperText,
  inputMode,
  label,
  placeholder,
  register,
  required = true,
  tooltip,
  type,
}: InputFieldProps) {
  const id = register.name
  const errorId = `${id}-error`
  const helperId = `${id}-helper`
  const tooltipId = `${id}-tooltip`
  const tooltipText = tooltip ?? helperText
  const describedBy = [error ? errorId : null, helperText ? helperId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`field-group ${className ?? ''}`.trim()}>
      <label className="field-label" htmlFor={id}>
        <span>{label}</span>
        {tooltipText ? (
          <span
            className="field-tooltip"
            aria-label={tooltipText}
            aria-describedby={tooltipId}
            tabIndex={0}
            role="img"
          >
            ⓘ
            <span id={tooltipId} className="field-tooltip-content" role="tooltip">
              {tooltipText}
            </span>
          </span>
        ) : null}
        {required ? <span className="required-mark" aria-hidden="true">*</span> : null}
      </label>
      <input
        id={id}
        className={`form-control ${error ? 'has-error' : ''}`}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-label={label}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required ? 'true' : 'false'}
        aria-describedby={describedBy || undefined}
        required={required}
        {...register}
      />
      <div className="field-meta">
        <span
          id={errorId}
          className={`field-error ${error ? 'is-visible' : ''}`}
          role={error ? 'alert' : undefined}
        >
          {error}
        </span>
        {helperText && !error ? (
          <span id={helperId} className="field-helper">
            {helperText}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function SelectField({
  className,
  error,
  helperText,
  label,
  options,
  register,
  required = true,
}: SelectFieldProps) {
  const { t } = useTranslation()
  const id = register.name
  const errorId = `${id}-error`
  const helperId = `${id}-helper`
  const describedBy = [error ? errorId : null, helperText ? helperId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`field-group ${className ?? ''}`.trim()}>
      <label className="field-label" htmlFor={id}>
        <span>{label}</span>
        {required ? <span className="required-mark" aria-hidden="true">*</span> : null}
      </label>
      <select
        id={id}
        className={`form-control ${error ? 'has-error' : ''}`}
        aria-label={label}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required ? 'true' : 'false'}
        aria-describedby={describedBy || undefined}
        required={required}
        {...register}
      >
        <option value="">{t('selectOption')}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="field-meta">
        <span
          id={errorId}
          className={`field-error ${error ? 'is-visible' : ''}`}
          role={error ? 'alert' : undefined}
        >
          {error}
        </span>
        {helperText && !error ? (
          <span id={helperId} className="field-helper">
            {helperText}
          </span>
        ) : null}
      </div>
    </div>
  )
}
