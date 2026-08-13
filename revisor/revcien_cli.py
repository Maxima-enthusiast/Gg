#!/usr/bin/env python3
"""revcien_cli.py
Genera un JSON con resultados de búsqueda desde arXiv y PubMed.
Uso básico:
    pip install arxiv requests
    python revcien_cli.py --query "CRISPR cancer therapy" --sources arxiv,pubmed --topk 2 --out results.json
"""
import argparse
import json
import sys
from typing import List

try:
    import arxiv
except ImportError:
    print("Requiere el paquete 'arxiv'. Instala con: pip install arxiv")
    sys.exit(1)

import requests

NCBI_ESEARCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
NCBI_ESUMMARY = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"


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

    # Fetch summaries
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


def main():
    parser = argparse.ArgumentParser(description='Genera JSON de búsqueda científica (arXiv, PubMed)')
    parser.add_argument('--query', '-q', required=True, help='Término de búsqueda o DOI')
    parser.add_argument('--sources', '-s', default='arxiv,pubmed', help='Fuentes separadas por comas (arxiv,pubmed)')
    parser.add_argument('--topk', '-k', type=int, default=2, help='Resultados por fuente')
    parser.add_argument('--out', '-o', default='results.json', help='Archivo de salida JSON')

    args = parser.parse_args()

    all_articles = []
    sources_chosen = [s.strip().lower() for s in args.sources.split(',') if s.strip()]

    if 'arxiv' in sources_chosen:
        try:
            all_articles.extend(search_arxiv(args.query, args.topk))
        except Exception as e:
            print(f"Error buscando en arXiv: {e}", file=sys.stderr)

    if 'pubmed' in sources_chosen:
        try:
            all_articles.extend(search_pubmed(args.query, args.topk))
        except Exception as e:
            print(f"Error buscando en PubMed: {e}", file=sys.stderr)

    output = {
        'query': args.query,
        'sources': sources_chosen,
        'mode': 'summary',
        'pipelineStatus': 'completed',
        'articles': all_articles
    }

    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Archivo generado: {args.out}")


if __name__ == '__main__':
    main()
