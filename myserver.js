const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const {v4: uuidv4} = require('uuid');

let url =  require("url");

let port = 3000;
const SECRET = 'super_secret_key';

let NOTES_FILE = path.join(__dirname, 'notes.json');
let USERS_FILE = path.join(__dirname, 'users.json');

let notes = [];
let users = [{ id: '1', email: 'test@mail.com', passwordHash: bcrypt.hashSync('123456', 10)}];


function getIdFromUrl(req) {
    let {pathname} = new URL(req.url, 'http://localhost' + port);
    return pathname.split('/')[2];
}

async function getNotes() {
    try {
        let notes = await fs.readFile(NOTES_FILE, 'utf-8');
        console.log(notes);
        if(notes.length > 0) {
            return JSON.parse(notes);
        } else {
            return [];
        }
    }
    catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
}

async function saveNoteToFile(file, array) {
    await fs.writeFile(file, JSON.stringify(array));
}

function sendResponse(res, responseCode, message) {
    res.writeHead(responseCode, {'Content-Type' : 'application/json'})
    res.end(JSON.stringify(message));
}

function sendStaticFile(res, filePath, contentType) {
    fs.readFile(path.join(__dirname, filePath))
        .then((data) => {
            res.writeHead(200, {'Content-type': contentType})
            res.end(data);
        })
        .catch((error) => {
            res.writeHead(404, {'Content-type': 'text/plain'})
            res.end('File not found')
        })
}

// START SERVER
const server = http.createServer(async(req, res) => {

    let parsedUrl = url.parse(req.url, true);
    let { pathname, query} = parsedUrl;

    // in order to return any file which is requested by front-end
    // const requestedUrl = req.url;
    // if (req.method === 'GET' && requestedUrl.endsWith('.js')) {
    //     let fileName = requestedUrl.slice(1);
    //     sendStaticFile(fileName, 'application/javascript');
    // }

    // GET STATICS
    if(req.method === 'GET' && req.url === '/') {
        sendStaticFile(res, 'index.html', 'text/html')
    }
    else if(req.method === 'GET' && req.url === '/login') {
        // fs.readFile(path.join(__dirname,'index.html'))
        // .then((data) => {
        //     res.writeHead(200, {'Content-type': 'text/html'})
        //     res.end(data);
        // })
        //or
        sendStaticFile(res, 'login.html', 'text/html')
    }

    else if(req.method === 'GET' && req.url === '/html/signup') {
        sendStaticFile(res, 'html/signup.html', 'text/html')
    }
    else if(req.method === 'GET' && req.url === '/styles.css') {
        sendStaticFile(res, 'styles.css', 'text/css')
    }
    else if(req.method === 'GET' && req.url === '/login.css') {
        sendStaticFile(res, 'login.css', 'text/css')
    }
    else if(req.method === 'GET' && req.url === '/script.js') {
        sendStaticFile(res, 'script.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/main.js') {
        console.log('hi')
        sendStaticFile(res, 'main.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/api/auth.js') {
        console.log('hi')
        sendStaticFile(res, 'api/auth.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/api/api.js') {
        console.log('hi')
        sendStaticFile(res, 'api/api.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/button.js') {
        console.log('hi')
        sendStaticFile(res, 'components/button.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/form.js') {
        console.log('hi')
        sendStaticFile(res, 'components/form.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/newReviewItem.js') {
        console.log('hi')
        sendStaticFile(res, 'components/newReviewItem.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/pagination.js') {
        console.log('hi')
        sendStaticFile(res, 'components/pagination.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/utils/utils.js') {
        console.log('hi')
        sendStaticFile(res, 'utils/utils.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/views/reviewsView.js') {
        console.log('hi')
        sendStaticFile(res, 'views/reviewsView.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/views/loginView.js') {
        console.log('hi')
        sendStaticFile(res, 'views/loginView.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/views/signUpView.js') {
        console.log('hi')
        sendStaticFile(res, 'views/signUpView.js', 'application/javascript')
    }

    // getting data

    if(req.method === 'GET' && req.url.startsWith('/get-review')) {

        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;

        let start = (page -1) * limit;
        let end = start + limit;

        let paginatedItems = notes.slice(start, end);

        let totalItems = notes.length;
        let totalPages = Math.ceil(totalItems / limit);

        // res.writeHead(200, {'Content-Type': 'application/json'});
        // res.end(JSON.stringify(notes))
        //or
        return sendResponse(res, 200, {
            page,
            limit,
            items: paginatedItems,
            totalItems,
            totalPages
        });
    }

    // posting data

    if(req.method === "POST" && req.url === '/submit-review') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            try {
                let parsedJson = JSON.parse(body);
                // let date = new Date();
                let note = {id: uuidv4(), company: parsedJson.company, rating: parsedJson.rating, review: parsedJson.review, date: parsedJson.date};

                //update notes array - temporary storage
                notes.push(note);

                //updates file - constant storage
                // fs.writeFile(NOTES_FILE, JSON.stringify(notes))
                //or
                await saveNoteToFile(NOTES_FILE, notes);

                //respond the client
                // res.writeHead(201, {'Content-Type' : 'application/json'})
                // res.end(JSON.stringify(note))
                //or
                return sendResponse(res, 201, {success: true, message:"Your review has been added", id: note.id});
            }
            catch (error) {
                // res.writeHead(404, {'Content-Type' : 'application/json'})
                // res.end(JSON.stringify("The received JSON is invalid"))
                //or
                return sendResponse(res, 404, "The received JSON is invalid")
            }
        })
    }

    // updating data

    if(req.method === "PUT" && req.url.startsWith('/update-review/')) {
        let id = getIdFromUrl(req);
        let noteIndex = notes.findIndex(note => note.id === id);
        if(noteIndex === -1) {
            // res.writeHead(404, {'Content-Type': 'application/json'});
            // res.end(JSON.stringify({error: "Such note doesn't exist"}));
            //or
            return sendResponse(res, 404, "Such note doesn't exist")
        }
        let body = "";
        req.on('data', chunk => body += chunk);
        req.on('end', async() => {
            try {
                let parsedJson = JSON.parse(body);

                // validate company
                let company = parsedJson.company;
                if(typeof company === 'string' && company.length > 3 && company.length < 20) {
                    notes[noteIndex].company = company;
                }

                //validate rating typeof number is not nan infinity range tseloe
                let rating = parsedJson.rating;
                if(typeof rating === 'number' && !rating.isNaN() && Number.isFinite(rating) && rating > 0 && rating < 10) {
                    notes[noteIndex].rating = rating;
                }

                //validate review
                let review = parsedJson.review;
                if(typeof review === 'string' && review.length > 3 && review.length < 1000) {
                    notes[noteIndex].review = review;
                }

                //updates file - constant storage
                // fs.writeFile(NOTES_FILE, JSON.stringify(notes))
                //or
                await saveNoteToFile(NOTES_FILE, notes);

                //respond to client
                // res.writeHead(201, {'Content-Type': 'application/json'});
                // res.end(JSON.stringify(notes[noteIndex]))
                //or
                return sendResponse(res, 201, notes[noteIndex])

            }
            catch(error) {
                // res.writeHead(400, {'Content-type:': 'application/json'})
                // res.end(JSON.stringify({error: "The json is invalid"}))
                //or
                return sendResponse(res, 400, {error: "The json is invalid"})
            }
        })
    }

    // deleting data

    if(req.method === "DELETE" && req.url.startsWith('/delete-review')) {
        let id = getIdFromUrl(req);
        let noteIndex = notes.findIndex(note => note.id === id);
        if(noteIndex === -1) {
            // res.writeHead(404,{'Content-type': 'application/json'});
            // res.end(JSON.stringify({error: "Such note doesn't exist"}));
            //or
            return sendResponse(res, 404, {error: "Such note doesn't exist"})
        }
        let deletedItem = notes.splice(noteIndex, 1);

        // fs.writeFile(NOTES_FILE, JSON.stringify(notes));
        //or
        (async () => {
            await saveNoteToFile(NOTES_FILE, notes);
        })();

        // res.writeHead(201, {"Content-type": 'application/json'})
        // res.end(JSON.stringify(deletedItem));
        //or
        return sendResponse(res, 201, deletedItem)
    }

    // SIGN IN ENDPOINT
    if(req.method === "POST" && req.url.startsWith('/sign-in')) {
        let body = "";
        req.on('data', (chunk) => body+= chunk);
        req.on('end', async() => {
            try{
                // getting email and password from the frontend payload
                let {email, password} = JSON.parse(body);
                if(!email || !password) return sendResponse(res, 401, "Invalid email or password")
                //finding matching user
                let user = users.find(user => user.email === email);
                if(!user) return sendResponse(res, 401, "Invalid email or password");

                //comparing password from payload and the one saved on the server
                let isMatch = await bcrypt.compare(password, user.passwordHash);
                if(!isMatch) return sendResponse(res, 401, "Invalid email or password");
                // generating token
                let token = jwt.sign(
                    {userId: user.id, email: user.email},
                    SECRET,
                    {expiresIn: '1h'});
                //sending response to the server
                return sendResponse(res, 200, {
                    message: "",
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                    }
                })
            }
            catch (error) {
                return sendResponse(res, 500, "Server error");
            }
        })
    }

    // SIGN UP ENDPOINT
    if(req.method === "POST" && req.url.startsWith('/sign-up')) {
        let body = "";
        req.on('data', (chunk) => body+= chunk);
        req.on('end', async() => {
            try{
                // getting email and password from the frontend payload
                let {name, email, password, confirmPassword} = JSON.parse(body);

                //validation block
                //checking the payload isn't empty
                if(!name || !email || !password || !confirmPassword) return sendResponse(res, 400, "All fields required")
                // comparing password and confirmPassword values match
                if(password !== confirmPassword) return sendResponse(res, 400, "Passwords don't match");
                // checking password length
                if(password.length < 3) return sendResponse(res, 400, "Password length should be more than 3 letters");
                // //checking password strength
                // let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                // let isStrongPassword = passwordRegex.test(password);
                // if(!isStrongPassword) return sendResponse(res, 400, "Password is too weak");
                // //checking email is correct
                // let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                // let isEmailCorrect = emailRegex.test(email);
                // if(!isEmailCorrect) return sendResponse(res,400, "Email is too weak");

                //creating new user
                let passwordHash = await bcrypt.hash(password, 10);
                let newUser = {id: uuidv4(), name: name, email: email, password: passwordHash, createdAt:new Date().toISOString()};

                //adding user to the array
                users.push(newUser);
                // update users storage file
                await saveNoteToFile(USERS_FILE, users);
                // generating token
                let token = jwt.sign(
                    {userId: newUser.id, email: newUser.email},
                    SECRET,
                    {expiresIn: '1h'});
                //sending response to the server
                return sendResponse(res, 200, {
                    message: "User registered successfully",
                    token,
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                    }
                })
            }
            catch (error) {
                return sendResponse(res, 500, "Server error");
            }
        })
    }
});

(async function start() {
    try {
        notes = await getNotes();
        server.listen(port, () => {
            console.log(`Server started at port ${port}`)
        })
    }
    catch(error) {
        console.error('Failed to launch the server', error);
        process.exit(1);
    }
})();


