import { useState } from 'react'
import CodeInput from './components/CodeInput'
import AnalysisResult from './components/AnalysisResult'
import FixInput from './components/FixInput'
import ReviewResult from './components/ReviewResult'
import { analyzeCode, reviewUserFix } from './services/api'
import './styles.css'

function App() {
  const [analysis, setAnalysis] = useState(null)
  const [review, setReview] = useState(null)
  const [originalCode, setOriginalCode] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)
  const [reviewError, setReviewError] = useState(null)

  async function handleAnalyze(code) {
    setAnalysisError(null)
    setReviewError(null)
    setAnalysis(null)
    setReview(null)
    setIsAnalyzing(true)
    try {
      const result = await analyzeCode(code)
      setOriginalCode(code)
      setAnalysis(result)
    } catch (e) {
      const timedOut =
        e?.name === 'TimeoutError' ||
        e?.name === 'AbortError' ||
        (e instanceof Error && e.message.includes('aborted'))
      const message = timedOut
        ? 'Przekroczono limit czasu oczekiwania (2 min). Skróć fragment kodu lub spróbuj ponownie później.'
        : e instanceof Error
          ? e.message
          : 'Nie udało się przeprowadzić analizy.'
      setAnalysisError(message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function handleReview(original, fix) {
    setReviewError(null)
    setIsReviewing(true)
    try {
      const result = await reviewUserFix(original, fix)
      setReview(result)
    } catch (e) {
      const timedOut =
        e?.name === 'TimeoutError' ||
        e?.name === 'AbortError' ||
        (e instanceof Error && e.message.includes('aborted'))
      const message = timedOut
        ? 'Przekroczono limit czasu oczekiwania (2 min). Spróbuj ponownie później.'
        : e instanceof Error
          ? e.message
          : 'Nie udało się ocenić poprawki.'
      setReviewError(message)
    } finally {
      setIsReviewing(false)
    }
  }

  return (
    <div className="container">
      <h1>Clean Code Analyzer</h1>
      <p className="subtitle">Analizuj swój kod Python pod kątem zasad Clean Code</p>

      {analysisError ? (
        <div className="banner-error" role="alert">
          {analysisError}
        </div>
      ) : null}

      <CodeInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

      {analysis && (
        <AnalysisResult result={analysis} />
      )}

      {analysis && (
        <>
          {reviewError ? (
            <div className="banner-error" role="alert">
              {reviewError}
            </div>
          ) : null}
          <FixInput
            originalCode={originalCode}
            onReview={handleReview}
            isLoading={isReviewing}
          />
        </>
      )}

      {review && (
        <ReviewResult result={review} />
      )}
    </div>
  )
}

export default App
