import { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { fetchGithubCode } from '../services/api'

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  tabSize: 4,
  insertSpaces: true,
  padding: { top: 12, bottom: 12 },
  fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, 'Courier New', monospace",
  renderLineHighlight: 'line',
  cursorBlinking: 'smooth',
  smoothScrolling: true,
}

const ANALYSIS_STANDARDS = [
  { value: 'clean_code', label: 'Clean Code' },
  { value: 'pep8', label: 'PEP 8' },
  { value: 'clean_code_pep8', label: 'Clean Code + PEP 8' },
]

function CodeInput({ onAnalyze, isLoading }) {
  const [code, setCode] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [analysisStandard, setAnalysisStandard] = useState('clean_code_pep8')
  const [githubUrl, setGithubUrl] = useState('')
  const [error, setError] = useState('')
  const [githubLoading, setGithubLoading] = useState(false)
  const fileInputRef = useRef(null)

  function handleSubmit() {
    const trimmedCode = code.trim()
    const trimmedApiKey = apiKey.trim()
    if (!trimmedApiKey) {
      setError('Podaj swój klucz OpenAI API, aby uruchomić analizę.')
    } else if (!trimmedCode) {
      setError('Wklej kod lub wczytaj plik z GitHub.')
    } else {
      setError('')
      onAnalyze(trimmedCode, trimmedApiKey, analysisStandard)
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.py')) {
      setError('Dozwolone są tylko pliki z rozszerzeniem .py')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setCode(String(reader.result ?? ''))
      setError('')
    }
    reader.onerror = () => {
      setError('Nie udało się odczytać pliku.')
    }
    reader.readAsText(file, 'UTF-8')
    event.target.value = ''
  }

  async function handleGithubFetch() {
    const url = githubUrl.trim()
    if (!url) {
      setError('Wklej adres URL do pliku na GitHubie (widok pliku lub raw).')
      return
    }
    setGithubLoading(true)
    setError('')
    try {
      const { code: fetched } = await fetchGithubCode(url)
      setCode(fetched)
      setGithubUrl('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Błąd pobierania z GitHub.')
    } finally {
      setGithubLoading(false)
    }
  }

  return (
    <div className="card code-input-card">
      <h2>Kod źródłowy Python</h2>
      <p className="card-hint">
        Podaj swój klucz OpenAI API. Klucz jest używany tylko do bieżącego żądania.
      </p>
      <input
        type="password"
        className="api-key-input"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="sk-..."
        autoComplete="off"
        spellCheck={false}
      />
      <div className="analysis-standard-group" role="radiogroup" aria-label="Wybierz standard analizy">
        {ANALYSIS_STANDARDS.map((standard) => {
          const isActive = analysisStandard === standard.value
          return (
            <button
              key={standard.value}
              type="button"
              className={`analysis-standard-option${isActive ? ' is-active' : ''}`}
              onClick={() => setAnalysisStandard(standard.value)}
              disabled={isLoading}
              role="radio"
              aria-checked={isActive}
            >
              {standard.label}
            </button>
          )
        })}
      </div>
      <p className="card-hint">
        Wklej kod, wgraj plik <code>.py</code> lub podaj publiczny link do pliku w repozytorium
        GitHub (strona pliku lub <code>raw.githubusercontent.com</code>).
      </p>

      <div className="code-toolbar">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Wgraj plik .py
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".py,text/x-python,application/x-python-code"
          className="visually-hidden"
          tabIndex={-1}
          onChange={handleFileChange}
        />

        <div className="github-fetch">
          <input
            type="url"
            className="github-url-input"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/użytkownik/repo/blob/main/plik.py"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="btn-github"
            onClick={handleGithubFetch}
            disabled={githubLoading || isLoading}
          >
            {githubLoading ? 'Pobieram…' : 'Pobierz z GitHub'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="inline-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="editor-shell">
        <Editor
          height="420px"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? '')}
          options={EDITOR_OPTIONS}
          loading={<div className="editor-loading">Ładowanie edytora…</div>}
        />
      </div>

      <div className="code-actions">
        <button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Analizuję…' : 'Analizuj kod'}
        </button>
      </div>
    </div>
  )
}

export default CodeInput
