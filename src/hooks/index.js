import { useState, useEffect, useCallback } from 'react'
import { client } from '../config/appwrite'

// ─── useAsync: generic data fetching with loading/error state ─────────────────
export function useAsync(asyncFn, deps = []) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn()
      setData(result)
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { execute() }, [execute])

  return { data, loading, error, refetch: execute }
}

// ─── useRealtime: subscribe to Appwrite realtime events ───────────────────────
export function useRealtime(channel, callback) {
  useEffect(() => {
    const unsubscribe = client.subscribe(channel, callback)
    return () => unsubscribe()
  }, [channel, callback])
}

// ─── useDebounce ──────────────────────────────────────────────────────────────
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// ─── usePagination ────────────────────────────────────────────────────────────
export function usePagination(total, limit = 9) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(total / limit)
  const next = () => setPage(p => Math.min(p + 1, totalPages))
  const prev = () => setPage(p => Math.max(p - 1, 1))
  const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)))
  return { page, totalPages, next, prev, goTo, setPage }
}
