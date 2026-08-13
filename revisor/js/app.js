import { state } from './state.js';
import { showToast, copyToClipboard as utilsCopy } from './utils.js';
import { renderResults } from './render.js';

const queryInput = document.getElementById('searchQuery');
const clearBtn = document.getElementById('clearBtn');

queryInput.addEventListener('input', () => {
    if (queryInput.value.trim().length > 0) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
    }
});

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

    pipelineStatus.innerText = "Consultando LangChain";
    pipelineStatus.className = "text-indigo-400 animate-pulse";
    progressBar.style.width = "25%";
    stepInfo.innerHTML = `<i class="fa-solid fa-network-wired text-indigo-400"></i> Enviando solicitudes a APIs [${activeSources.join(', ')}]...`;

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

// Expose functions to global scope so existing inline onclick attributes keep working
window.clearInput = clearInput;
window.setQuery = setQuery;
window.toggleSource = toggleSource;
window.executeSearch = executeSearch;
window.copyToClipboard = utilsCopy;

export default {
    clearInput,
    setQuery,
    toggleSource,
    executeSearch
};
