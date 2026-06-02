import { useTranslation } from 'react-i18next'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface BaseFieldProps {
  className?: string
  error?: string
  helperText?: string
  label: string
  register: UseFormRegisterReturn
  required?: boolean
}

interface InputFieldProps extends BaseFieldProps {
  type: string
}

interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ label: string; value: string }>
}

export function InputField({
  className,
  error,
  helperText,
  label,
  register,
  required = true,
  type,
}: InputFieldProps) {
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
      <input
        id={id}
        className={`form-control ${error ? 'has-error' : ''}`}
        type={type}
        aria-label={label}
        aria-invalid={Boolean(error)}
        aria-required={required}
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
        aria-invalid={Boolean(error)}
        aria-required={required}
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
