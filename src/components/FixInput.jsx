import { useState } from 'react'
import Editor from '@monaco-editor/react'

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
}

function FixInput({ originalCode, onReview, isLoading }) {
  const [userFix, setUserFix] = useState('')

  function handleSubmit() {
    if (userFix.trim()) {
      onReview(originalCode, userFix)
    }
  }

  return (
    <div className="card code-input-card">
      <h2>Twoja poprawka</h2>
      <p className="card-hint">Wprowadź poprawiony kod w edytorze poniżej:</p>

      <div className="editor-shell">
        <Editor
          height="360px"
          defaultLanguage="python"
          theme="vs-dark"
          value={userFix}
          onChange={(value) => setUserFix(value ?? '')}
          options={EDITOR_OPTIONS}
          loading={
            <div className="editor-loading editor-loading-sm">Ładowanie edytora…</div>
          }
        />
      </div>

      <div className="code-actions">
        <button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Oceniam…' : 'Wyślij poprawkę'}
        </button>
      </div>
    </div>
  )
}

export default FixInput
