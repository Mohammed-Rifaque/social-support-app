import { useEffect, useRef } from 'react'
import { useWatch, type Control, type FieldValues } from 'react-hook-form'

export function useSyncedFormDraft<TFormValues extends FieldValues>(
  control: Control<TFormValues>,
  onChange: (values: Partial<TFormValues>) => void,
) {
  const watchedValues = useWatch({ control })
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    onChange(watchedValues)
  }, [onChange, watchedValues])
}
