[![CI trackme](https://github.com/alejandrodevgg/taller-github-actions/actions/workflows/multi-env-ci.yml/badge.svg)](https://github.com/alejandrodevgg/taller-github-actions/actions/workflows/multi-env-ci.yml)
# trackme

Una API diminuta de Node/Express para aprender **GitHub Actions** de punta a
punta: cabe en cinco minutos de lectura, pero da para un pipeline completo
(lint, tests, matriz, Docker, Pages, releases y seguridad).

## Qué es cada cosa

| Fichero | Qué es |
|---|---|
| `src/index.js` | La app Express: `GET /health`, `GET /api/sum` y el estático `web/` |
| `src/calculadora.js` | Funciones puras (`sum`, `mul`, `avg`) — lo más fácil de testear |
| `test/*.test.js` | Jest + supertest: la suite que vuestra CI ejecutará desde s1 |
| `web/index.html` | Dashboard mínimo que consume `/api/sum` |
| `docs/index.html` | Página estática de docs — la publicará GitHub Pages en s5 |
| `scripts/stats.js` | Genera `stats.json` con metadatos del repo vía `gh` — lo usa el workflow de automatización (s3) |
| `Dockerfile` | Imagen de producción (runtime solo, usuario no-root, puerto 8080) — s5 |

## Arrancar en local

```bash
npm ci           # instala EXACTAMENTE lo que dice package-lock.json (requiere red)
npm run dev      # node --watch → http://localhost:8080 (health, sum y dashboard)
npm test         # la suite
npm run lint     # ESLint
```

En contenedor:

```bash
docker build -t trackme .
docker run --rm -p 8080:8080 trackme   # http://localhost:8080/health
```

## ⚠️ Este repo viene roto a propósito

No está roto: **es el ejercicio**. Hay dos fallos sembrados, y se arreglan EN
VIVO en la **sección 3** de la guía, cuando vuestra CI de la sección 1 lleve
un rato poniéndose en rojo. **No los reparéis vosotros antes de tiempo** —
son la materia prima del taller:

1. **Bug en `src/calculadora.js`**: `sum()` usa el operador equivocado
   (`a - b` en vez de `a + b`), así que `sum(2, 2)` devuelve `0`. Dos tests
   fallan con él: `test/calculadora.test.js` y el de `/api/sum` en
   `test/api.test.js`. Verás el bug también a simple vista en el dashboard de
   `web/` (muestra `0`).
2. **Import muerto en el mismo fichero**: `import os from "node:os"` no se
   usa nunca, y `npm run lint` falla con exactamente un error de
   `no-unused-vars`.

Espera, al pasar los tests, una línea `ExperimentalWarning: VM Modules…`: el
proyecto es ESM (`"type": "module"`) y Jest necesita esa bandera experimental
para importarlo. Es ruido esperado, no un tercer fallo.

## `scripts/stats.js` (sección 3)

Lee metadatos del repo con la CLI de GitHub y escribe `stats.json` en la raíz
(stars, forks, issues abiertos, watchers y unas barras ASCII). Requisitos:
`gh` instalada y variable `GH_REPO` con `usuario/trackme`; para repos
privados, también `GH_TOKEN` (en el workflow lo pone `GITHUB_TOKEN`):

```bash
GH_REPO=tuusuario/trackme node scripts/stats.js
```

Sin `gh` o sin permisos, el script sale con código ≠ 0 y un mensaje claro —
esa es exactamente la papeleta que quiere ver tu `job` para aprender a
diagnosticarla.
