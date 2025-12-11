// Обработчик статики
// Добавьте в ваш createServer до блока 404 (чтобы 404 срабатывал только если не файл и не API):
// Добавьте в начало server1_gpt.js (рядом с остальным кодом):
const path = require('path');
const fsRaw = require('fs'); // для потоков статики (fs.promises у нас уже есть)

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

// Статика: GET /, /index.html, /styles.css, /test_gpt_app.js и т.п.
if (req.method === 'GET') {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    // Корень → index.html
    let filePath = url.pathname === '/'
        ? path.join(__dirname, 'public', 'index.html')
        : path.join(__dirname, 'public', url.pathname);

    // Нормализация и защита от выхода за директорию
    const publicDir = path.join(__dirname, 'public');
    if (!filePath.startsWith(publicDir)) {
        // попытка обратиться выше public — запрещаем
        sendJson(res, 403, { error: 'Forbidden' });
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    if (fsRaw.existsSync(filePath) && fsRaw.statSync(filePath).isFile()) {
        res.writeHead(200, { 'Content-Type': contentType });
        fsRaw.createReadStream(filePath).pipe(res);
        return;
    }
    // Если файла нет — не возвращаем 404 сразу, пусть пойдёт дальше к API/404
}
