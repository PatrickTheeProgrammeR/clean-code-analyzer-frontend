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

  async function handleAnalyze(code) {
    setIsAnalyzing(true)
    setAnalysis(null)
    setReview(null)
    const result = await analyzeCode(code)
    setOriginalCode(code)
    setAnalysis(result)
    setIsAnalyzing(false)
  }

  async function handleReview(original, fix) {
    setIsReviewing(true)
    const result = await reviewUserFix(original, fix)
    setReview(result)
    setIsReviewing(false)
  }

  return (
    <div className="container">
      <h1>Clean Code Analyzer</h1>
      <p className="subtitle">Analizuj swój kod Python pod kątem zasad Clean Code</p>

      <CodeInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

      {analysis && (
        <AnalysisResult result={analysis} />
      )}

      {analysis && (
        <FixInput
          originalCode={originalCode}
          onReview={handleReview}
          isLoading={isReviewing}
        />
      )}

      {review && (
        <ReviewResult result={review} />
      )}
    </div>
  )
}

export default App