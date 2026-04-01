const API_URL = 'http://localhost:8000/api'

export async function analyzeCode(code) {
  const response = await fetch(`${API_URL}/analyze-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
  return response.json()
}

export async function reviewUserFix(originalCode, userFix) {
  const response = await fetch(`${API_URL}/review-user-fix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ original_code: originalCode, user_fix: userFix })
  })
  return response.json()
}