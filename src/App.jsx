import { useEffect, useState } from 'react'
import CodeInput from './components/CodeInput'
import AnalysisResult from './components/AnalysisResult'
import FixInput from './components/FixInput'
import ReviewResult from './components/ReviewResult'
import { analyzeCode, reviewUserFix, isBackendConfigured } from './services/api'
import { supabase, isSupabaseConfigured } from './services/supabase'
import './styles.css'

function App() {
  function validatePasswordForSignUp(value) {
    const hasMinLength = value.length > 6
    const hasLetter = /[A-Za-z]/.test(value)
    const hasNumber = /\d/.test(value)

    if (!hasMinLength || !hasLetter || !hasNumber) {
      return 'Hasło musi mieć więcej niż 6 znaków i zawierać litery oraz cyfry.'
    }

    return null
  }

  const [analysis, setAnalysis] = useState(null)
  const [review, setReview] = useState(null)
  const [originalCode, setOriginalCode] = useState('')
  const [activeApiKey, setActiveApiKey] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)
  const [reviewError, setReviewError] = useState(null)
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [authInfo, setAuthInfo] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false)
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined

    let mounted = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return
      if (error) {
        setAuthError('Nie udało się pobrać sesji użytkownika.')
        return
      }
      setUser(data.session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSignIn(event) {
    event.preventDefault()

    if (!supabase) {
      setAuthError(
        'Logowanie jest chwilowo niedostępne. Ustaw VITE_SUPABASE_URL oraz VITE_SUPABASE_ANON_KEY.',
      )
      return
    }

    if (!email.trim()) {
      setAuthError('Podaj adres e-mail, aby się zalogować.')
      return
    }
    if (!password) {
      setAuthError('Podaj hasło.')
      return
    }

    setAuthError(null)
    setAuthInfo(null)
    setIsAuthSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setIsAuthSubmitting(false)

    if (error) {
      setAuthError('Nie udało się zalogować. Sprawdź e-mail i hasło.')
      return
    }

    setAuthInfo('Zalogowano pomyślnie. Trwa odświeżanie widoku...')
    window.location.reload()
  }

  async function handleSignUp() {
    if (!supabase) {
      setAuthError(
        'Logowanie jest chwilowo niedostępne. Ustaw VITE_SUPABASE_URL oraz VITE_SUPABASE_ANON_KEY.',
      )
      return
    }
    if (!email.trim()) {
      setAuthError('Podaj adres e-mail, aby utworzyć konto.')
      return
    }
    if (!password) {
      setAuthError('Podaj hasło.')
      return
    }
    const passwordValidationError = validatePasswordForSignUp(password)
    if (passwordValidationError) {
      setAuthError(passwordValidationError)
      return
    }

    setAuthError(null)
    setAuthInfo(null)
    setIsAuthSubmitting(true)

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })
    setIsAuthSubmitting(false)

    if (error) {
      setAuthError('Nie udało się utworzyć konta. Spróbuj ponownie.')
      return
    }

    setAuthInfo('Konto utworzone. Sprawdź e-mail i potwierdź rejestrację, a następnie zaloguj się.')
  }

  async function handleSignOut() {
    if (!supabase) return

    setAuthError(null)
    setAuthInfo(null)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setAuthError('Nie udało się wylogować.')
      return
    }
    setAuthInfo('Wylogowano.')
  }

  function handleShowLogin() {
    setAuthError(null)
    setAuthInfo(null)
    setIsLoginFormVisible(true)
  }

  async function handleAnalyze(code, apiKey, analysisStandard) {
    setAnalysisError(null)
    setReviewError(null)
    setAnalysis(null)
    setReview(null)
    setIsAnalyzing(true)
    setActiveApiKey(apiKey)
    try {
      const result = await analyzeCode(code, apiKey, analysisStandard)
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

  async function handleReview(original, fix, apiKey) {
    setReviewError(null)
    setIsReviewing(true)
    try {
      const result = await reviewUserFix(original, fix, apiKey)
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
      <header className="hero-header">
        <div className="hero-title-row">
          <img src="/favicon.svg" alt="" className="hero-logo" />
          <h1 className="hero-title">Clean Code Analyzer</h1>
          <img src="/favicon.svg" alt="" className="hero-logo" />
        </div>
        <p className="subtitle hero-subtitle">Analizuj swój kod Python pod kątem zasad Clean Code</p>
      </header>
      {!isLoginFormVisible ? (
        <div className="auth-row">
          <button type="button" className="btn-secondary" onClick={handleShowLogin}>
            Zaloguj
          </button>
          {user ? (
            <>
              <span className="auth-status">{`Zalogowano jako: ${user.email ?? user.id}`}</span>
              <button type="button" className="btn-secondary" onClick={handleSignOut}>
                Wyloguj
              </button>
            </>
          ) : null}
        </div>
      ) : (
        <form className="auth-row" onSubmit={handleSignIn}>
          <input
            type="email"
            className="auth-email-input"
            placeholder="Podaj e-mail do logowania"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isSupabaseConfigured || isAuthSubmitting}
          />
          <input
            type="password"
            className="auth-email-input"
            placeholder="Podaj hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isSupabaseConfigured || isAuthSubmitting}
          />
          <button type="submit" className="btn-secondary" disabled={!isSupabaseConfigured || isAuthSubmitting}>
            {isAuthSubmitting ? 'Trwa logowanie...' : 'Zaloguj'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSignUp}
            disabled={!isSupabaseConfigured || isAuthSubmitting}
          >
            Załóż konto
          </button>
          {user ? <span className="auth-status">{`Zalogowano jako: ${user.email ?? user.id}`}</span> : null}
        </form>
      )}

      {import.meta.env.PROD && !isBackendConfigured() ? (
        <div className="banner-error" role="alert">
          Brak zmiennej <code>VITE_API_URL</code> przy buildzie. W Vercel ustaw adres backendu (np.{' '}
          <code>https://twoj-backend.onrender.com/api</code>) i wykonaj Redeploy.
        </div>
      ) : null}

      {analysisError ? (
        <div className="banner-error" role="alert">
          {analysisError}
        </div>
      ) : null}

      {authError ? (
        <div className="banner-error" role="alert">
          {authError}
        </div>
      ) : null}

      {authInfo ? (
        <div className="banner-info" role="status">
          {authInfo}
        </div>
      ) : null}

      <CodeInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

      {isAnalyzing && (
        <section className="analysis-loading-card" aria-live="polite" aria-busy="true">
          <div className="analysis-loading-header">
            <span className="analysis-spinner" aria-hidden="true" />
            <p>Trwa analiza kodu...</p>
          </div>
          <div className="analysis-skeleton-line analysis-skeleton-line-wide" />
          <div className="analysis-skeleton-line" />
          <div className="analysis-skeleton-line analysis-skeleton-line-short" />
        </section>
      )}

      {analysis && (
        <AnalysisResult result={analysis} sourceCode={originalCode} />
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
            apiKey={activeApiKey}
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
