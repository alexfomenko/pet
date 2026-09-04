// 📘 Обновлённый server1_gpt.js (с query-параметрами)
// Ниже версия с фильтрацией search и ограничением limit в GET /notes.json.

const http = require('http');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'notes_old.json');

let notes = [];

/** ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---------- **/

async function loadNotes() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') return []; // файла нет → пустой массив
        throw err;
    }
}

async function saveNotes() {
    await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2));
}

function sendJson(res, status, payload) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
}

function notFound(res, msg = 'Маршрут не найден') {
    sendJson(res, 404, { error: msg });
}

function getIdFromUrl(req) {
    const { pathname } = new URL(req.url, 'http://localhost:' + PORT);
    return pathname.split('/')[2];
}

/** ---------- СЕРВЕР ---------- **/

const server = http.createServer((req, res) => {

    // GET /notes.json — с поддержкой query
    if (req.method === 'GET' && req.url.startsWith('/notes.json')) {
        const myUrl = new URL(req.url, 'http://localhost:' + PORT);

        let result = [...notes];

        // limit
        const limit = myUrl.searchParams.get('limit');
        if (limit) {
            result = result.slice(0, parseInt(limit, 10));
        }

        // search
        const search = myUrl.searchParams.get('search');
        if (search) {
            result = result.filter((note) =>
                note.text.toLowerCase().includes(search.toLowerCase())
            );
        }

        return sendJson(res, 200, result);
    }

    // POST /notes.json
    if (req.method === 'POST' && req.url === '/notes.json') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            try {
                const parsed = JSON.parse(body);
                const text = parsed?.text;

                if (typeof text !== 'string' || text.trim() === '') {
                    return sendJson(res, 400, { error: 'Поле "text" обязательно' });
                }

                const note = { id: uuidv4(), text: text.trim() };
                notes.push(note);
                await saveNotes();

                return sendJson(res, 201, note);
            } catch {
                return sendJson(res, 400, { error: 'Неверный JSON' });
            }
        });
        return;
    }

    // PUT /notes.json/:id
    if (req.method === 'PUT' && req.url.startsWith('/notes.json/')) {
        const id = getIdFromUrl(req);
        const idx = notes.findIndex((n) => n.id === id);
        if (idx === -1) return notFound(res, 'Заметка не найдена');

        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            try {
                const parsed = JSON.parse(body);
                const newText = parsed?.text;

                if (typeof newText !== 'string' || newText.trim() === '') {
                    return sendJson(res, 400, { error: 'Поле "text" обязательно' });
                }

                notes[idx].text = newText.trim();
                await saveNotes();

                return sendJson(res, 200, notes[idx]);
            } catch {
                return sendJson(res, 400, { error: 'Неверный JSON' });
            }
        });
        return;
    }

    // DELETE /notes.json/:id
    if (req.method === 'DELETE' && req.url.startsWith('/notes.json/')) {
        const id = getIdFromUrl(req);
        const idx = notes.findIndex((n) => n.id === id);
        if (idx === -1) return notFound(res, 'Заметка не найдена');

        const deleted = notes.splice(idx, 1)[0];
        (async () => {
            await saveNotes();
            return sendJson(res, 200, { deleted });
        })();
        return;
    }

    // 404
    return notFound(res);
});

/** ---------- ЗАПУСК ---------- **/
(async function start() {
    try {
        notes = await loadNotes();
        server.listen(PORT, () => {
            console.log(`Сервер запущен на http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Не удалось загрузить данные:', err);
        process.exit(1);
    }
})();
