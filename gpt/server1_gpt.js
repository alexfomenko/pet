//node server1_gpt.js

const http = require('http');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid'); // Установите через: npm install uuid

// adding fs module
let notes = [];
// При старте читаем notes.json, если он есть
try {
    const data = fs.readFileSync('notes.json', 'utf-8');
    notes = JSON.parse(data);
} catch (e) {
    notes = []; // если файла нет — начинаем с пустого массива
}

//Каждый раз после POST, PUT, DELETE — нужно переписать файл notes.json:
function saveNotes() {
  fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
}

const server = http.createServer((req, res) => {
    if (req.url === '/notes' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json1' });
        res.end(JSON.stringify(notes));
    }

    else if (req.url === '/notes' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const note = { id: uuidv4(), text: data.text };
                notes.push(note);
                saveNotes();
                res.writeHead(201, { 'Content-Type': 'application/json1' });
                res.end(JSON.stringify(note));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json1' });
                res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
            }
        });
    }

    else if (req.url.startsWith('/notes/') && req.method === 'DELETE') {
        const id = req.url.split('/')[2];
        const index = notes.findIndex(note => note.id === id);
        if (index !== -1) {
            const deleted = notes.splice(index, 1)[0];
            saveNotes();
            res.writeHead(200, { 'Content-Type': 'application/json1' });
            res.end(JSON.stringify({ deleted }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json1' });
            res.end(JSON.stringify({ error: 'Заметка не найдена' }));
        }
    }
// Добавьте PUT /notes/:id
// Логика:
// вытащить id из URL;
// найти заметку;
// прочитать body ({ text }), провалидировать;
// обновить text, вернуть обновлённую заметку;
// если не найдено — 404.
// Проверка (curl):
// curl -X PUT http://localhost:3000/notes/<ID> \
//     -H "Content-Type: application/json" \
//   -d '{"text":"Новый текст"}'


        // receive body
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const parsedJsonBody = JSON.parse(body);
                //get text
                const newText = parsedJsonBody?.text;
                // validate text
                // if text is not string
                if (typeof newText != "string") {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
                }

                // if text is string and everything is correct
                notes[noteIndex].text = newText;
                saveNotes();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(notes[noteIndex]));
            }
            catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
            }
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json1' });
        res.end(JSON.stringify({ error: 'Маршрут не найден' }));
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});

// EXPLANATION

// Синхронные методы → try/catch
// readFileSync возвращает результат сразу. Если произошла ошибка (например, файла нет), то она выбрасывается как исключение (throw).
// Чтобы перехватить её, нужен try/catch.
// Синхронный стиль = обычный JavaScript-код с исключениями.
try {
    const data = fs.readFileSync('notes.json', 'utf-8');
} catch (err) {
    console.error('Ошибка:', err);
}

// Асинхронные методы (с колбэком) → err, data
// readFile работает асинхронно.
// Он не может сразу вернуть результат, поэтому вызывается позже, когда операция завершена.
// Node.js использует стиль error-first callback:
// если ошибка → err не null,
// если всё хорошо → err = null, а результат в data.
// Это старый стиль работы Node.js, до появления async/await.
fs.readFile('notes.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Ошибка:', err);
    } else {
        console.log('Прочитано:', data);
    }
});

// Современный вариант → fs.promises + async/await
// Node.js поддерживает промисы:
// Теперь можно писать асинхронный код как «обычный» с try/catch.
// Это самый удобный вариант в современных проектах.

const fs = require('fs').promises;
async function loadNotes() {
    try {
        const data = await fs.readFile('notes.json', 'utf-8');
        console.log('Прочитано:', data);
    } catch (err) {
        console.error('Ошибка:', err);
    }
}

loadNotes();

//  Итог
// readFileSync → синхронно, ошибки ловим через try/catch.
// readFile → асинхронно, результат возвращается через колбэк (err, data).
// fs.promises.readFile → асинхронно, но в стиле async/await с try/catch.