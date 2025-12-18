// Ниже — аккуратная версия server.js с централизованными хелперами для ответов и ошибок. После кода — краткие пояснения.
// Обновлённый server.js с единым стилем ответов

// Что изменилось и зачем

// Единые хелперы
// sendJson и sendError исключают дублирование writeHead/end, все ответы теперь в одном формате.
// notFound — компактный 404.
//
// Централизация чтения тела
// parseJsonBody(req) — вся логика чтения/парсинга JSON в одном месте (и корректная ошибка «Неверный JSON»).
//
// Единая обработка необработанных исключений
// handleAsync оборачивает корневой обработчик; если внутри что-то упало — клиент получает аккуратный 500, а сервер не «сыпется».
//
// Асинхронная статика
// serveStatic использует fs.promises.stat, а отдача файла идёт потоками (createReadStream).
//
// Единый стиль кода
// Лёгкая читаемость: в каждом маршруте минимум «казуистики», максимум смысла.

const http = require('http');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const fsRaw = require('fs'); // для потоков статики
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'notes.json');

/* ===================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===================== */

// Единый успешный JSON-ответ
function sendJson(res, status, payload) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
}

// Единая ошибка в одном формате
function sendError(res, status, message, details) {
    const body = details ? { error: message, details } : { error: message };
    sendJson(res, status, body);
}

// 404-ответ в одном месте
function notFound(res, msg = 'Маршрут не найден') {
    sendError(res, 404, msg);
}

// Безопасно получаем чистый id из URL
function getIdFromUrl(req) {
    const { pathname } = new URL(req.url, 'http://localhost:' + PORT);
    return pathname.split('/')[2];
}

// Считываем и парсим JSON-тело запроса
function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body || '{}');
                resolve(parsed);
            } catch (e) {
                reject(new Error('Неверный JSON'));
            }
        });
        req.on('error', reject);
    });
}

// Обертка для async-обработчиков, чтобы не ловить необработанные исключения
function handleAsync(fn) {
    return (...args) => {
        fn(...args).catch((err) => {
            const res = args[1]; // (req, res)
            // Логируем и отдаём безопасную ошибку
            console.error('[Unhandled]', err);
            sendError(res, 500, 'Внутренняя ошибка сервера');
        });
    };
}

// Загрузка/сохранение заметок
async function loadNotes() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

async function saveNotes(notes) {
    await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2));
}

/* ===================== СТАТИКА (минимальный обработчик) ===================== */

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg':  'image/svg+xml'
};

async function serveStatic(req, res) {
    if (req.method !== 'GET') return false;

    const url = new URL(req.url, `http://localhost:${PORT}`);
    let filePath = url.pathname === '/'
        ? path.join(__dirname, 'public', 'reviews.html')
        : path.join(__dirname, 'public', url.pathname);

    const publicDir = path.join(__dirname, 'public');
    if (!filePath.startsWith(publicDir)) {
        sendError(res, 403, 'Forbidden');
        return true;
    }

    try {
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) return false;

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        fsRaw.createReadStream(filePath).pipe(res);
        return true;
    } catch {
        return false; // пусть дойдёт до API/404
    }
}

/* ===================== ДАННЫЕ В ПАМЯТИ ===================== */

let notes = [];

/* ===================== СЕРВЕР ===================== */

const server = http.createServer(handleAsync(async (req, res) => {
    // сначала пытаемся отдать статику
    const served = await serveStatic(req, res);
    if (served) return;

    // GET /notes?limit=&search=
    if (req.method === 'GET' && req.url.startsWith('/notes')) {
        const myUrl = new URL(req.url, 'http://localhost:' + PORT);
        let result = [...notes];

        const limit = myUrl.searchParams.get('limit');
        if (limit) {
            const n = Number.parseInt(limit, 10);
            if (!Number.isNaN(n) && n >= 0) result = result.slice(0, n);
        }

        const search = myUrl.searchParams.get('search');
        if (search) {
            const q = search.toLowerCase();
            result = result.filter((note) => note.text.toLowerCase().includes(q));
        }

        return sendJson(res, 200, result);
    }

    // POST /notes
    if (req.method === 'POST' && req.url === '/notes') {
        try {
            const { text } = await parseJsonBody(req);
            if (typeof text !== 'string' || text.trim() === '') {
                return sendError(res, 400, 'Поле "text" обязательно и должно быть строкой');
            }
            const note = { id: uuidv4(), text: text.trim() };
            notes.push(note);
            await saveNotes(notes);
            return sendJson(res, 201, note);
        } catch (e) {
            return sendError(res, 400, e.message || 'Неверный JSON');
        }
    }

    // PUT /notes/:id
    if (req.method === 'PUT' && req.url.startsWith('/notes/')) {
        const id = getIdFromUrl(req);
        const idx = notes.findIndex((n) => n.id === id);
        if (idx === -1) return sendError(res, 404, 'Заметка не найдена');

        try {
            const { text } = await parseJsonBody(req);
            if (typeof text !== 'string' || text.trim() === '') {
                return sendError(res, 400, 'Поле "text" обязательно и должно быть строкой');
            }
            notes[idx].text = text.trim();
            await saveNotes(notes);
            return sendJson(res, 200, notes[idx]);
        } catch (e) {
            return sendError(res, 400, e.message || 'Неверный JSON');
        }
    }

    // DELETE /notes/:id
    if (req.method === 'DELETE' && req.url.startsWith('/notes/')) {
        const id = getIdFromUrl(req);
        const idx = notes.findIndex((n) => n.id === id);
        if (idx === -1) return sendError(res, 404, 'Заметка не найдена');

        const deleted = notes.splice(idx, 1)[0];
        await saveNotes(notes);
        return sendJson(res, 200, { deleted });
    }

    // если ничего не совпало
    return notFound(res);
}));

/* ===================== ЗАПУСК ===================== */

(async function start() {
    try {
        notes = await loadNotes();
        server.listen(PORT, () => {
            console.log(`Сервер запущен на http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Не удалось запустить сервер:', err);
        process.exit(1);
    }
})();
