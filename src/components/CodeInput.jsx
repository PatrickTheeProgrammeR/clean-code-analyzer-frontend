import { useState } from 'react'

function CodeInput({ onAnalyze, isLoading }) {
  const [code, setCode] = useState('')

  function handleSubmit() {
    if (code.trim()) {
      onAnalyze(code)
    }
  }

  return (
    <div className="card">
      <h2>Wklej kod Python</h2>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="def moja_funkcja():\n    pass"
        rows={12}
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Analizuję...' : 'Analizuj kod'}
      </button>
    </div>
  )
}

export default CodeInput