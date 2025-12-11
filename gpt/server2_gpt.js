// Готовый server1_gpt.js (асинхронный вариант)
// Что изменилось и зачем
// Используем const fs = require('fs').promises; — современный, асинхронный API файлов.
// При старте: await loadNotes() читает notes.json (если файла нет — массив пустой).
// После каждого POST / PUT / DELETE вызываем await saveNotes() — сохраняем актуальное состояние в notes.json.
// Внутри req.on('end', async () => { ... }) используем await — так корректно дождёмся записи в файл перед ответом.


// Разница между «старой» (синхронной) в server1_gpt.js и «новой» (асинхронной) версией

// Старая (синхронная: readFileSync / writeFileSync)
// Когда сервер обращается к файлу, Node.js останавливает всё приложение, пока файл не прочитается или не запишется.
// Это называется блокировка event loop.
// Если одновременно к серверу пришло 100 запросов, а один из них делает запись в большой файл — все остальные 99 будут ждать, пока операция не закончится.
// Для учебных примеров это допустимо, но в реальном веб-сервисе приведёт к «тормозам».

// Новая (асинхронная: fs.promises.readFile / fs.promises.writeFile)
// Node.js не блокирует весь сервер, а выполняет операцию чтения/записи в фоне.
// Пока идёт работа с файлом, сервер может обслуживать другие запросы.
// Когда операция завершится, Node.js «сообщит» об этом, и мы получим результат через await.
// Таким образом, сервер масштабируется и работает быстрее под нагрузкой.
// 🔑 Главное преимущество новой версии:
//     👉 Сервер не зависает во время работы с файлами, а продолжает обрабатывать других клиентов.

//Синхронный метод (writeFileSync) Блокирует весь поток Node.js. Пока файл пишется — никакие другие запросы не обрабатываются.
// Асинхронный метод с await (writeFile) Блокирует только текущую async-функцию. Event loop свободен, и сервер может параллельно обслуживать других клиентов.

const http = require('http');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'notes.json');

let notes = [];

/** ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---------- **/

async function loadNotes() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') return []; // файла ещё нет — начинаем с пустого массива
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
    // GET /notes — получить все заметки
    if (req.method === 'GET' && req.url === '/notes') {
        return sendJson(res, 200, notes);
    }

    // POST /notes — добавить заметку
    if (req.method === 'POST' && req.url === '/notes') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            try {
                const parsed = JSON.parse(body);
                const text = parsed?.text;

                if (typeof text !== 'string' || text.trim() === '') {
                    return sendJson(res, 400, { error: 'Поле "text" обязательно и должно быть строкой' });
                }

                const note = { id: uuidv4(), text: text.trim() };
                notes.push(note);
                await saveNotes(); // ⬅ асинхронная запись в файл

                return sendJson(res, 201, note);
            } catch {
                return sendJson(res, 400, { error: 'Неверный JSON' });
            }
        });
        return;
    }

    // PUT /notes/:id — обновить текст заметки
    if (req.method === 'PUT' && req.url.startsWith('/notes/')) {
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
                    return sendJson(res, 400, { error: 'Поле "text" обязательно и должно быть строкой' });
                }

                notes[idx].text = newText.trim();
                await saveNotes(); // ⬅ асинхронная запись в файл

                return sendJson(res, 200, notes[idx]);
            } catch {
                return sendJson(res, 400, { error: 'Неверный JSON' });
            }
        });
        return;
    }

    // DELETE /notes/:id — удалить заметку
    if (req.method === 'DELETE' && req.url.startsWith('/notes/')) {
        const id = getIdFromUrl(req);
        const idx = notes.findIndex((n) => n.id === id);
        if (idx === -1) return notFound(res, 'Заметка не найдена');

        const deleted = notes.splice(idx, 1)[0];
        (async () => {
            await saveNotes(); // ⬅ асинхронная запись в файл
            return sendJson(res, 200, { deleted });
        })();
        return;
    }

    // 404 по умолчанию
    return notFound(res);
});

/** ---------- ЗАПУСК ---------- **/

(async function start() {
    try {
        notes = await loadNotes(); // ⬅ асинхронная загрузка из файла при старте
        server.listen(PORT, () => {
            console.log(`Сервер запущен на http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Не удалось загрузить данные:', err);
        process.exit(1);
    }
})();
