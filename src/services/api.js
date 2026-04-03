function normalizeApiBase(raw) {
  const s = (raw ?? '').trim()
  if (!s) {
    if (import.meta.env.PROD) return null
    return 'http://localhost:8000/api'
  }
  const noTrailing = s.replace(/\/+$/, '')
  if (noTrailing.endsWith('/api')) return noTrailing
  return `${noTrailing}/api`
}

const API_URL = normalizeApiBase(import.meta.env.VITE_API_URL)

const AI_REQUEST_MS = 120_000
const GITHUB_FETCH_MS = 60_000

function requireApiUrl() {
  if (!API_URL) {
    throw new Error(
      'Brak VITE_API_URL. W Vercel → Environment Variables ustaw https://twoj-backend.onrender.com/api i Redeploy.'
    )
  }
}

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

async function fetchApi(path, init) {
  requireApiUrl()
  try {
    return await fetch(`${API_URL}${path}`, init)
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        'Brak połączenia z backendem (Render). Sprawdź VITE_API_URL i /api/health.'
      )
    }
    throw e
  }
}

export function isBackendConfigured() {
  return Boolean(API_URL)
}

export async function analyzeCode(code, apiKey) {
  const response = await fetchApi('/analyze-code', {
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
  const response = await fetchApi('/review-user-fix', {
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
  const response = await fetchApi('/fetch-github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
    signal: AbortSignal.timeout(GITHUB_FETCH_MS)
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
