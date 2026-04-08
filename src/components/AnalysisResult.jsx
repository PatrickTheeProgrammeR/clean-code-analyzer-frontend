function AnalysisResult({ result, sourceCode = '' }) {
  if (!result) return null

  const issues = Array.isArray(result.issues) ? result.issues : []
  const summary =
    typeof result.summary === 'string' ? result.summary.trim() : ''
  const sourceLines = typeof sourceCode === 'string' ? sourceCode.split(/\r?\n/) : []

  function getLinePreview(lineNumber) {
    if (!Number.isInteger(lineNumber) || lineNumber <= 0) return null
    const lineText = sourceLines[lineNumber - 1]
    if (typeof lineText !== 'string') return null
    return {
      lineNumber,
      text: lineText.trim() || '(pusta linia)',
    }
  }

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
        issues.map((issue, index) => {
          const linePreview = getLinePreview(issue.line)
          return (
            <div key={index} className="issue">
              <p className="issue-line-row">
                <strong>
                  {issue.line > 0 ? `Linia ${issue.line}` : 'Cały plik / ogólne'}
                </strong>
                {linePreview ? <code className="issue-line-code">{linePreview.text}</code> : null}
              </p>
              <p>Problem: {issue.problem}</p>
              <p>Sugestia: {issue.suggestion}</p>
            </div>
          )
        })
      )}
    </div>
  )
}

export default AnalysisResult
