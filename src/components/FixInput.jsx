import { useState } from 'react'

function FixInput({ originalCode, onReview, isLoading }) {
  const [userFix, setUserFix] = useState('')

  function handleSubmit() {
    if (userFix.trim()) {
      onReview(originalCode, userFix)
    }
  }

  return (
    <div className="card">
      <h2>Twoja poprawka</h2>
      <p>Spróbuj poprawić kod według sugestii AI:</p>
      <textarea
        value={userFix}
        onChange={(e) => setUserFix(e.target.value)}
        placeholder="Wpisz poprawiony kod..."
        rows={12}
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Oceniam...' : 'Wyślij poprawkę'}
      </button>
    </div>
  )
}

export default FixInput