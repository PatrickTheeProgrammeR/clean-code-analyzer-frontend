# clean-code-analyzer-frontend

🔗 **Demo:** https://clean-code-analyzer-frontend.vercel.app

## Stack technologiczny

- **React 19.x + Vite 8.x**: aplikacja SPA
- **Vanilla CSS**: style w `src/styles.css` (bez Tailwinda/SCSS)
- **Monaco Editor**: edytor kodu w UI (`@monaco-editor/react` / `monaco-editor`)
- **Supabase**: uwierzytelnianie (logowanie/rejestracja/sesja) przez `@supabase/supabase-js`
- **ESLint**: lintowanie (`npm run lint`)

## Wymagania wstępne

- **Node.js 22.x**
- Backend musi działać lokalnie lub zdalnie — szczegóły w [README backendu](../clean-code-analyzer-backend/README.md)

## Zmienne środowiskowe (.env)

Frontend używa zmiennych `VITE_*` (Vite). Pliku `.env` nie commituj.

Startowo skopiuj przykładowy plik:

```bash
# Windows
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

Dostępne zmienne:

- **`VITE_API_URL`**: adres backendu (Render lub lokalnie). Może być z `/api` lub bez — frontend i tak znormalizuje to do `<base>/api`.
  - lokalnie: `http://localhost:8000/api`
  - produkcja (Vercel → Environment Variables): `https://<twoj-backend>.onrender.com/api`
- **`VITE_SUPABASE_URL`**: opcjonalnie, URL projektu Supabase (jeśli używasz)
- **`VITE_SUPABASE_ANON_KEY`**: opcjonalnie, anon key Supabase (jeśli używasz)

## Jak uruchomić lokalnie

### Docker (rekomendowane)

W root projektu (`clean-code-analyzer-frontend`)

```bash
docker build -t frontend-app . 
docker run -p 5173:5173 frontend-app
```

Po starcie:
- frontend: `http://localhost:5173`

### Bez Dockera

W katalogu `clean-code-analyzer-frontend`:

```bash
npm install
npm run dev
```

Domyślnie aplikacja działa pod `http://localhost:5173`.

## Jak zainstalować zależności

W katalogu `clean-code-analyzer-frontend`:

```bash
npm install
```

## Wdrożenie na Vercel

1. Utwórz nowy projekt na [vercel.com](https://vercel.com) i połącz z repozytorium GitHub
2. Vercel automatycznie wykryje Vite — nie musisz zmieniać ustawień Build & Development Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** *(puste — domyślny root repozytorium)*
3. Dodaj zmienne środowiskowe (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) w zakładce **Environment Variables**
4. Kliknij **Deploy**

> **Uwaga:** Po każdej zmianie zmiennych środowiskowych na Vercel wykonaj ręczny **Redeploy**.