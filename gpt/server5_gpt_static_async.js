// 📘 Асинхронный обработчик статики
// В начале файла:
const fs = require('fs').promises;  // асинхронные методы
const fsRaw = require('fs');        // для потоков
const path = require('path');

// Простая карта расширений → Content-Type
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

// Асинхронная функция для отдачи статики
async function serveStatic(req, res) {
    if (req.method !== 'GET') return false; // только GET-запросы
    const url = new URL(req.url, `http://localhost:${PORT}`);

    // Корень → reviews.html
    let filePath = url.pathname === '/'
        ? path.join(__dirname, 'public', 'reviews.html')
        : path.join(__dirname, 'public', url.pathname);

    // Защита: доступ только к папке public
    const publicDir = path.join(__dirname, 'public');
    if (!filePath.startsWith(publicDir)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Forbidden' }));
        return true;
    }

    try {
        const stats = await fs.stat(filePath); // асинхронная проверка
        if (!stats.isFile()) return false;

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        fsRaw.createReadStream(filePath).pipe(res); // поток чтения файла
        return true;
    } catch (err) {
        // файл не найден → пусть идёт дальше к API или 404
        return false;
    }
}

// 📘 Использование внутри сервера
// Вместо того, чтобы прямо в createServer городить синхронный код, мы теперь проверяем статику вот так:

    const server = http.createServer(async (req, res) => {
        // Сначала пробуем отдать статический файл
        const handled = await serveStatic(req, res);
        if (handled) return;

        // Если не статика → дальше API
        if (req.method === 'GET' && req.url.startsWith('/notes.json')) {
            // ... ваш API
        }

        // Если ничего не подошло → 404
        sendJson(res, 404, { error: 'Маршрут не найден' });
    });

// 📍 Что изменилось
// Синхронные existsSync и statSync → асинхронный await fs.stat()
// → не блокирует event loop.
// Ошибки (ENOENT = файл не найден) ловим через try/catch
// Поток (fsRaw.createReadStream) остался тем же, потому что он уже асинхронный.