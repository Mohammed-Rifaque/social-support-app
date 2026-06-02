import { useEffect, useRef, useState } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const savedValue = window.localStorage.getItem(key)
      return savedValue ? (JSON.parse(savedValue) as T) : initialValue
    } catch {
      return initialValue
    }
  })
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    setSaveStatus('saving')

    let idleTimer: number | undefined
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
        setSaveStatus('saved')
        idleTimer = window.setTimeout(() => setSaveStatus('idle'), 1800)
      } catch {
        setSaveStatus('error')
      }
    }, 250)

    return () => {
      window.clearTimeout(timer)

      if (idleTimer) {
        window.clearTimeout(idleTimer)
      }
    }
  }, [key, value])

  const clear = () => {
    try {
      window.localStorage.removeItem(key)
      setSaveStatus('idle')
    } catch {
      setSaveStatus('error')
    }
  }

  return { value, setValue, clear, saveStatus }
}
