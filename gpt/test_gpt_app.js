async function fetchNotes(params = '') {
    const res = await fetch('/notes' + params);
    return res.json();
}

async function render() {
    const listEl = document.getElementById('list');
    const notes = await fetchNotes(); // можно попробовать '?limit=5'
    listEl.innerHTML = '';
    notes.forEach(n => {
        const li = document.createElement('li');
        li.textContent = n.text;
        const del = document.createElement('button');
        del.textContent = 'Удалить';
        del.onclick = async () => {
            await fetch('/notes/' + n.id, { method: 'DELETE' });
            await render();
        };
        li.appendChild(del);
        listEl.appendChild(li);
    });
}

document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('text').value.trim();
    if (!text) return;
    await fetch('/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    document.getElementById('text').value = '';
    await render();
});

render();
