const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const AI_REQUEST_MS = 120_000

function errorMessageFromBody(data) {
  const detail = data?.detail
  const err = data?.error
  if (typeof detail === 'string') return detail
  if (typeof err === 'string') return err
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || String(d)).join(', ')
  }
  return null
}

export async function analyzeCode(code, apiKey) {
  const response = await fetch(`${API_URL}/analyze-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, api_key: apiKey }),
    signal: AbortSignal.timeout(AI_REQUEST_MS)
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      errorMessageFromBody(data) ?? `Serwer zwrócił błąd (${response.status}).`
    )
  }
  return data
}

export async function reviewUserFix(originalCode, userFix, apiKey) {
  const response = await fetch(`${API_URL}/review-user-fix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ original_code: originalCode, user_fix: userFix, api_key: apiKey }),
    signal: AbortSignal.timeout(AI_REQUEST_MS)
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      errorMessageFromBody(data) ?? `Serwer zwrócił błąd (${response.status}).`
    )
  }
  return data
}

export async function fetchGithubCode(url) {
  const response = await fetch(`${API_URL}/fetch-github`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = data.detail
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg || d).join(', ')
          : 'Nie udało się pobrać pliku z GitHub.'
    throw new Error(message)
  }
  return data
}
