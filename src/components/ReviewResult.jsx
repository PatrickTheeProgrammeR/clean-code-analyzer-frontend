function ReviewResult({ result }) {
  if (!result) return null

  return (
    <div className="card">
      <h2>Ocena Twojej poprawki</h2>

      <div className="score">
        <span>Ocena poprawki:</span>
        <strong>{result.score} / 10</strong>
      </div>

      <h3>Feedback:</h3>
      <p>{result.feedback}</p>

      <h3>Porównanie:</h3>
      <p>{result.comparison}</p>

      <h3>Najlepsze rozwiązanie AI:</h3>
      <pre className="code-block">{result.best_solution}</pre>

      <h3>Dlaczego to najlepsze rozwiązanie:</h3>
      <p>{result.best_solution_explanation}</p>
    </div>
  )
}

export default ReviewResult