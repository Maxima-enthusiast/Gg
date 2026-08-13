export function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 bg-indigo-600 text-white text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-indigo-400/30 animate-bounce';
    toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

export async function copyToClipboard() {
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
