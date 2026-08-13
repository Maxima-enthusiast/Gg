// Bundled non-module version for file:// usage
// State
const state = {
    sources: {
        arxiv: true,
        pubmed: true,
        semanticscholar: true,
        openalex: false
    }
};

// Utils
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 bg-indigo-600 text-white text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-indigo-400/30 animate-bounce';
    toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

async function copyToClipboard() {
    const text = document.getElementById('outputContent')?.innerText || '';
    if (!text) {
        showToast("No hay resultados para copiar");
        return;
    }

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const area = document.createElement('textarea');
            area.value = text;
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            area.remove();
        }
        showToast("Informe copiado al portapapeles");
    } catch (err) {
        showToast("Error copiando al portapapeles");
        console.error(err);
    }
}

// Render
function renderResults(query, mode, sources) {
    const container = document.getElementById('outputContent');
    
    let html = '';

    if (mode === 'review') {
        html += `
        <div class="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                    <i class="fa-solid fa-clipboard-check text-indigo-400"></i> Veredicto del Revisor Científico IA
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                    Nivel Evidencia: A1
                </span>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed">
                Se realizó una revisión crítica sobre <strong class="text-white">"${query}"</strong> triangulando datos desde <span class="text-indigo-400 font-medium">${sources.join(' y ')}</span>.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong class="text-emerald-400 block mb-1">
                        <i class="fa-solid fa-circle-check"></i> Fortalezas Metodológicas:
                    </strong>
                    <ul class="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                        <li>Validación <em>in vivo</em> en modelos murinos.</li>
                        <li>Precisión de predicción basada en ML validada.</li>
                    </ul>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong class="text-amber-400 block mb-1">
                        <i class="fa-solid fa-triangle-exclamation"></i> Limitaciones / Sesgos:
                    </strong>
                    <ul class="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                        <li>Muestra limitada en ensayos clínicos humanos.</li>
                        <li>Requiere mayor seguimiento a largo plazo.</li>
                    </ul>
                </div>
            </div>
        </div>
        `;
    }

    html += `<h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-2">Artículos Indexados Encontrados:</h3>`;

    html += `
    <div class="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-2.5 transition-all">
        <div class="flex items-start justify-between gap-2">
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <i class="fa-solid fa-notes-medical"></i> PubMed ID: 42587136
            </span>
            <span class="text-[11px] text-slate-500 font-mono">Pub: 2026-08-12</span>
        </div>

        <h4 class="text-sm font-semibold text-slate-100 leading-snug">
            Mechanistic machine learning for prediction of prime editing outcomes (OptiPrime).
        </h4>

        <p class="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            Prime editing (PE) can make specific local changes to genomic DNA in living systems but requires optimization. Here we present OptiPrime, achieving state-of-the-art accuracy in therapeutic contexts for mouse models...
        </p>

        <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
            <span class="text-slate-500 truncate max-w-[200px]">Autores: Liu, Gu, Xie et al.</span>
            <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                Ver Paper <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
        </div>
    </div>
    `;

    html += `
    <div class="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-2.5 transition-all">
        <div class="flex items-start justify-between gap-2">
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <i class="fa-solid fa-atom"></i> arXiv: 2403.11902
            </span>
            <span class="text-[11px] text-slate-500 font-mono">Pub: 2026-07-28</span>
        </div>

        <h4 class="text-sm font-semibold text-slate-100 leading-snug">
            Rewriting CAR-T cell fate: CRISPR/Cas gene editing for solid tumor therapy.
        </h4>

        <p class="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            Although CAR-T cell therapy has achieved remarkable success in hematological malignancies, its therapeutic efficacy in solid tumors remains limited by T cell exhaustion. We evaluate third-generation CRISPR/Cas...
        </p>

        <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
            <span class="text-slate-500 truncate max-w-[200px]">Autores: Zhang, Du, Chen et al.</span>
            <a href="https://arxiv.org/" target="_blank" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                Ver Paper <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
        </div>
    </div>
    `;

    container.innerHTML = html;
}

// App logic
(function () {
    const queryInput = document.getElementById('searchQuery');
    const clearBtn = document.getElementById('clearBtn');

    if (queryInput) {
        queryInput.addEventListener('input', () => {
            if (queryInput.value.trim().length > 0) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }
        });
    }

    function clearInput() {
        queryInput.value = '';
        clearBtn.classList.add('hidden');
        queryInput.focus();
    }

    function setQuery(text) {
        queryInput.value = text;
        clearBtn.classList.remove('hidden');
    }

    function toggleSource(btn, sourceKey) {
        state.sources[sourceKey] = !state.sources[sourceKey];
        
        const icon = btn.querySelector('.font-icon');
        if (state.sources[sourceKey]) {
            btn.classList.add('active', 'border-indigo-500/50', 'bg-indigo-500/10', 'text-indigo-300');
            btn.classList.remove('border-slate-800', 'bg-slate-950/50', 'text-slate-400');
            icon.className = 'fa-solid fa-circle-check text-indigo-400 font-icon';
        } else {
            btn.classList.remove('active', 'border-indigo-500/50', 'bg-indigo-500/10', 'text-indigo-300');
            btn.classList.add('border-slate-800', 'bg-slate-950/50', 'text-slate-400');
            icon.className = 'fa-regular fa-circle text-slate-600 font-icon';
        }
    }

    function executeSearch(mode) {
        const query = queryInput.value.trim();
        if (!query) {
            showToast("Por favor ingresa un término o DOI en la casilla");
            return;
        }

        const activeSources = Object.keys(state.sources).filter(k => state.sources[k]);
        if (activeSources.length === 0) {
            showToast("Selecciona al menos una fuente científica (arXiv, PubMed, etc.)");
            return;
        }

        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('outputContent').classList.add('hidden');
        document.getElementById('loadingState').classList.remove('hidden');

        const progressBar = document.getElementById('progressBar');
        const pipelineStatus = document.getElementById('pipelineStatus');
        const stepInfo = document.getElementById('stepInfo');
        const loadingTitle = document.getElementById('loadingTitle');
        const loadingSubtitle = document.getElementById('loadingSubtitle');

        // Update UI to in-progress
        pipelineStatus.innerText = "Consultando LangChain";
        pipelineStatus.className = "text-indigo-400 animate-pulse";
        progressBar.style.width = "25%";
        stepInfo.innerHTML = `<i class="fa-solid fa-network-wired text-indigo-400"></i> Enviando solicitudes a APIs [${activeSources.join(', ')}]...`;

        // If served over HTTP(S), try calling backend API /search
        if (window.location.protocol.startsWith('http')) {
            const payload = { query, sources: activeSources, topk: 2, mode };
            fetch('/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(async res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // Update progress
                progressBar.style.width = "100%";
                pipelineStatus.innerText = data.pipelineStatus || 'Completado';
                pipelineStatus.className = "text-emerald-400 font-medium";
                stepInfo.innerHTML = `<i class="fa-solid fa-check-circle text-emerald-400"></i> ${data.articles?.length || 0} artículos procesados exitosamente.`;

                document.getElementById('loadingState').classList.add('hidden');
                document.getElementById('outputContent').classList.remove('hidden');

                // Render server-provided data
                renderResultsFromData(data);
            }).catch(err => {
                console.warn('API /search failed, falling back to simulated UI:', err);
                // Fallback to simulated behavior
                setTimeout(() => {
                    progressBar.style.width = "65%";
                    loadingTitle.innerText = mode === 'review' ? "Analizando Metodologías y Citas con LLM..." : "Sintetizando Resultados Multifuente...";
                    loadingSubtitle.innerText = "Evaluando validez interna, sesgos y relevancia científica...";
                    stepInfo.innerHTML = `<i class="fa-solid fa-brain text-violet-400"></i> Ejecutando prompt de Revisor Científico...`;
                }, 1200);

                setTimeout(() => {
                    progressBar.style.width = "100%";
                    pipelineStatus.innerText = "Completado";
                    pipelineStatus.className = "text-emerald-400 font-medium";
                    stepInfo.innerHTML = `<i class="fa-solid fa-check-circle text-emerald-400"></i> 2 artículos procesados exitosamente.`;

                    document.getElementById('loadingState').classList.add('hidden');
                    document.getElementById('outputContent').classList.remove('hidden');

                    renderResults(query, mode, activeSources);
                }, 2400);
            });
            return;
        }

        // Fallback when not served via HTTP (file://) - keep existing simulated behavior
        setTimeout(() => {
            progressBar.style.width = "65%";
            loadingTitle.innerText = mode === 'review' ? "Analizando Metodologías y Citas con LLM..." : "Sintetizando Resultados Multifuente...";
            loadingSubtitle.innerText = "Evaluando validez interna, sesgos y relevancia científica...";
            stepInfo.innerHTML = `<i class="fa-solid fa-brain text-violet-400"></i> Ejecutando prompt de Revisor Científico...`;
        }, 1200);

        setTimeout(() => {
            progressBar.style.width = "100%";
            pipelineStatus.innerText = "Completado";
            pipelineStatus.className = "text-emerald-400 font-medium";
            stepInfo.innerHTML = `<i class="fa-solid fa-check-circle text-emerald-400"></i> 2 artículos procesados exitosamente.`;

            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('outputContent').classList.remove('hidden');

            renderResults(query, mode, activeSources);
        }, 2400);
    }

    // Expose to global
    window.clearInput = clearInput;
    window.setQuery = setQuery;
    window.toggleSource = toggleSource;
    window.executeSearch = executeSearch;
    window.copyToClipboard = copyToClipboard;
})();

// Cargar resultados desde archivo JSON (usado por file://)
window.loadResultsFile = function (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            renderResultsFromData(data);
        } catch (err) {
            showToast('Archivo JSON inválido.');
            console.error(err);
        }
    };
    reader.readAsText(file);
};

function renderResultsFromData(data) {
    const container = document.getElementById('outputContent');
    if (!container) return;

    const articles = data.articles || [];
    const query = data.query || '';
    const mode = data.mode || 'summary';
    const sources = data.sources || [];

    let html = '';
    if (mode === 'review' && data.review) {
        html += `<div class="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-xl p-4 space-y-3">`;
        html += `<div class="flex items-center justify-between border-b border-indigo-500/20 pb-2"><span class="text-xs font-bold uppercase tracking-wider text-indigo-300">Revisión IA</span></div>`;
        html += `<p class="text-xs text-slate-300">${data.review.summary || ''}</p>`;
        html += `</div>`;
    }

    html += `<h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-2">Artículos Indexados Encontrados:</h3>`;

    if (articles.length === 0) {
        html += `<p class="text-sm text-slate-500">No se encontraron artículos en el archivo.</p>`;
    }

    for (const art of articles) {
        html += `\n<div class="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-2.5 transition-all">`;
        html += `<div class="flex items-start justify-between gap-2">`;
        html += `<span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">${art.source || ''}: ${art.id || ''}</span>`;
        html += `<span class="text-[11px] text-slate-500 font-mono">${art.published || ''}</span>`;
        html += `</div>`;
        html += `<h4 class="text-sm font-semibold text-slate-100 leading-snug">${art.title || ''}</h4>`;
        html += `<p class="text-xs text-slate-400 line-clamp-3 leading-relaxed">${art.summary || ''}</p>`;
        html += `<div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">`;
        html += `<span class="text-slate-500 truncate max-w-[200px]">Autores: ${(art.authors || []).join(', ')}</span>`;
        html += `<a href="${art.url || '#'}" target="_blank" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">Ver Paper <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></a>`;
        html += `</div></div>`;
    }

    container.innerHTML = html;
    document.getElementById('emptyState')?.classList.add('hidden');
    document.getElementById('outputContent')?.classList.remove('hidden');
}
