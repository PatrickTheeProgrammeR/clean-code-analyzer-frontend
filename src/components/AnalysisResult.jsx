function AnalysisResult({ result }) {
  if (!result) return null

  const issues = Array.isArray(result.issues) ? result.issues : []
  const summary =
    typeof result.summary === 'string' ? result.summary.trim() : ''

  return (
    <div className="card">
      <h2>Wynik analizy</h2>

      <div className="score">
        <span>Ocena kodu:</span>
        <strong>{result.score} / 10</strong>
      </div>

      {summary ? (
        <div className="analysis-summary">
          <h3>Wskazówka przed poprawką</h3>
          <p>{summary}</p>
        </div>
      ) : null}

      <h3>Szczegółowe uwagi</h3>
      {issues.length === 0 ? (
        <p className="analysis-empty">
          Brak listy uwag — przy tej ocenie możesz przejść do sekcji poprawki poniżej lub
          uruchomić analizę ponownie.
        </p>
      ) : (
        issues.map((issue, index) => (
          <div key={index} className="issue">
            <p>
              <strong>
                {issue.line > 0 ? `Linia ${issue.line}` : 'Cały plik / ogólne'}
              </strong>
            </p>
            <p>Problem: {issue.problem}</p>
            <p>Sugestia: {issue.suggestion}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default AnalysisResult
