from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import arxiv
import requests
import json

try:
    import openai
except Exception:
    openai = None

NCBI_ESEARCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
NCBI_ESUMMARY = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"

app = FastAPI(title="RevCien API")



class SearchRequest(BaseModel):
    query: str
    sources: list = ["arxiv", "pubmed"]
    topk: int = 2
    mode: str = "summary"


def search_arxiv(query: str, topk: int = 2):
    results = []
    search = arxiv.Search(query=query, max_results=topk)
    for r in search.results():
        authors = [a.name for a in r.authors]
        results.append({
            'source': 'arxiv',
            'id': getattr(r, 'entry_id', '') or r.get_short_id(),
            'title': r.title,
            'authors': authors,
            'published': r.published.strftime('%Y-%m-%d') if r.published else None,
            'summary': r.summary,
            'url': r.entry_id if hasattr(r, 'entry_id') else r.pdf_url
        })
    return results


def search_pubmed(query: str, topk: int = 2):
    params = {
        'db': 'pubmed',
        'term': query,
        'retmax': topk,
        'retmode': 'json'
    }
    r = requests.get(NCBI_ESEARCH, params=params)
    r.raise_for_status()
    ids = r.json().get('esearchresult', {}).get('idlist', [])
    if not ids:
        return []

    params = {
        'db': 'pubmed',
        'id': ','.join(ids),
        'retmode': 'json'
    }
    s = requests.get(NCBI_ESUMMARY, params=params)
    s.raise_for_status()
    data = s.json()
    results = []
    for pid in ids:
        item = data.get('result', {}).get(pid, {})
        title = item.get('title') or ''
        authors = [a.get('name') for a in item.get('authors', []) if a.get('name')]
        pubdate = item.get('pubdate')
        url = f"https://pubmed.ncbi.nlm.nih.gov/{pid}/"
        results.append({
            'source': 'pubmed',
            'id': pid,
            'title': title,
            'authors': authors,
            'published': pubdate,
            'summary': item.get('summary') or item.get('title') or '',
            'url': url
        })
    return results


def generate_review_with_openai(articles, query):
    if openai is None:
        return None
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return None
    openai.api_key = api_key

    # Build a concise prompt
    snippets = []
    for a in articles:
        snippets.append(f"Title: {a.get('title','')}. Abstract: {a.get('summary','')}")
    prompt = (
        f"Eres un revisor científico. Resume brevemente los hallazgos relevantes y limita sesgos para la consulta: '{query}'.\n"
        f"Artículos:\n" + "\n---\n".join(snippets) + "\n\nEscribe un breve veredicto (3-5 frases) y lista 2 fortalezas y 2 limitaciones en formato JSON with keys 'summary','strengths','limitations'."
    )

    try:
        # Prefer Chat Completions if available
        if hasattr(openai, 'ChatCompletion'):
            resp = openai.ChatCompletion.create(model='gpt-3.5-turbo', messages=[{'role':'user','content': prompt}], max_tokens=400)
            content = resp['choices'][0]['message']['content']
        else:
            resp = openai.Completion.create(engine='text-davinci-003', prompt=prompt, max_tokens=400)
            content = resp['choices'][0]['text']

        # Try parsing JSON from the model output
        try:
            parsed = json.loads(content)
            return parsed
        except Exception:
            # Fallback: return text summary
            return {'summary': content}
    except Exception as e:
        print('OpenAI review failed:', e)
        return None


@app.post('/search')
def api_search(req: SearchRequest):
    try:
        articles = []
        if 'arxiv' in req.sources:
            articles.extend(search_arxiv(req.query, req.topk))
        if 'pubmed' in req.sources:
            articles.extend(search_pubmed(req.query, req.topk))

        response = {
            'query': req.query,
            'sources': req.sources,
            'mode': req.mode,
            'pipelineStatus': 'completed',
            'articles': articles
        }

        # If review requested, attempt to generate via OpenAI (optional)
        if req.mode == 'review':
            review = generate_review_with_openai(articles, req.query)
            if review:
                response['review'] = review

        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    # Serve static files (the dashboard) from the current directory
    app.mount('/', StaticFiles(directory='.', html=True), name='static')
