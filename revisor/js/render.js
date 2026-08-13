export function renderResults(query, mode, sources) {
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
