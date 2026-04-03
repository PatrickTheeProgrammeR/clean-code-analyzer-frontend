# clean-code-analyzer-frontend

## Wdrozenie na Vercel

1. Wypchnij projekt do GitHuba.
2. W Vercel zaimportuj repozytorium i wybierz ten projekt.
3. Ustaw konfiguracje:
   - Framework preset: `Vite`
   - Root directory: `clean-code-analyzer-frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Obowiazkowo** zmienna `VITE_API_URL` = `https://<render>/api` (bez tego produkcja probuje laczyc z localhost).
5. Wdroz (po zmianie env zawsze Redeploy).

## Przeplyw klucza OpenAI API

- Backend nie przechowuje i nie wymaga serwerowego `OPENAI_API_KEY`.
- Uzytkownik podaje swoj klucz OpenAI API w formularzu frontendu.
- Klucz jest wysylany tylko w biezacym zadaniu API.