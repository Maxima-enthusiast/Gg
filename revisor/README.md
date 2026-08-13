# RevCien Dashboard + API

Este repositorio contiene un dashboard estático y un servidor API opcional para ejecutar búsquedas científicas (arXiv, PubMed) y generar un breve `review` usando OpenAI (opcional).

Archivos principales:

- `scientific_paper_reviewer_dashboard.html` — UI principal (puede abrirse con `file://` o servirse desde el servidor).
- `js/bundle.js` — versión no-module para uso con `file://`.
- `js/app.js` — versión modular (no usada por default ahora).
- `revcien_cli.py` — CLI para generar `results.json` (sin servidor).
- `server.py` — FastAPI server que expone `/search` y sirve los archivos estáticos.
- `sample_results.json` — ejemplo de resultados para pruebas.

Requisitos para el servidor:

```bash
pip install -r requirements.txt
```

Ejecutar el servidor (dev):

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

- Abre en el navegador: `http://localhost:8000/scientific_paper_reviewer_dashboard.html`.
- El botón "Buscar" en la UI intentará llamar a POST `/search` y mostrará resultados reales.

OpenAI (opcional):
- Para que el servidor genere un `review` basado en los artículos, exporta tu clave:

```bash
export OPENAI_API_KEY=sk-...
# Windows PowerShell
$env:OPENAI_API_KEY = "sk-..."
```

Notas:
- Si la red de la sala bloquea puertos, el servidor no podrá recibir peticiones desde otros equipos, pero puedes ejecutarlo localmente y abrir `http://localhost:8000` en la misma máquina.
- Si no quieres ejecutar el servidor, puedes seguir usando el flujo `file://` y cargar manualmente `results.json` generado por `revcien_cli.py`.

Ejemplo de petición curl:

```bash
curl -X POST http://localhost:8000/search -H "Content-Type: application/json" -d '{"query":"CRISPR cancer therapy","sources":["arxiv","pubmed"],"topk":2,"mode":"summary"}'
```
