function AnalysisResult({ result }) {
  if (!result) return null

  return (
    <div className="card">
      <h2>Wynik analizy</h2>

      <div className="score">
        <span>Ocena kodu:</span>
        <strong>{result.score} / 10</strong>
      </div>

      <h3>Problemy:</h3>
      {result.issues.map((issue, index) => (
        <div key={index} className="issue">
          <p><strong>Linia {issue.line}</strong></p>
          <p>Problem: {issue.problem}</p>
          <p>Sugestia: {issue.suggestion}</p>
        </div>
      ))}
    </div>
  )
}

export default AnalysisResult