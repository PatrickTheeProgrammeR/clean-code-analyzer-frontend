import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="mock-editor" />,
}))

vi.mock('./services/supabase', () => ({
  supabase: null,
  isSupabaseConfigured: false,
}))

describe('App', () => {
  it('renders title', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /Clean Code Analyzer/i }),
    ).toBeInTheDocument()
  })
})
