# clean-code-analyzer-frontend

## Wdrozenie na Vercel

1. Wypchnij projekt do GitHuba.
2. W Vercel zaimportuj repozytorium i wybierz ten projekt.
3. Ustaw konfiguracje:
   - Framework preset: `Vite`
   - Root directory: `clean-code-analyzer-frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Ustaw zmienna srodowiskowa w Vercel:
   - `VITE_API_URL=https://<twoj-render-url>/api`
5. Wdroz aplikacje.

## Przeplyw klucza OpenAI API

- Backend nie przechowuje i nie wymaga serwerowego `OPENAI_API_KEY`.
- Uzytkownik podaje swoj klucz OpenAI API w formularzu frontendu.
- Klucz jest wysylany tylko w biezacym zadaniu API.