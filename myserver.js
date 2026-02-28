const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const {v4: uuidv4} = require('uuid');

let url =  require("url");

let port = 3000;
const SECRET = 'super_secret_key';

const DATA_DIR = path.join(__dirname, 'json');

const NOTES_FILE = path.join(DATA_DIR, 'notes.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// let NOTES_FILE = path.join(__dirname, 'notes.json');
// let USERS_FILE = path.join(__dirname, 'users.json');

let notes = [];
let users = [{ id: '1', email: 'test@mail.com', passwordHash: bcrypt.hashSync('123456', 10)}];


function getIdFromUrl(req) {
    let {pathname} = new URL(req.url, 'http://localhost' + port);
    return pathname.split('/')[2];
}

//read notes from file
async function getNotesFromFile() {
    try {
        let notes = await fs.readFile(NOTES_FILE, 'utf-8');
        // console.log(notes);
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

//read users from file
async function getUsersFromFile() {
    try{
        let users = await fs.readFile(USERS_FILE, 'utf-8');
        console.log(users);
        return users.length > 0 ? JSON.parse(users) : [];
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
    console.log("hit0");
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
    if(req.method === 'GET' && req.url === '/html/reviews') {
        sendStaticFile(res, 'html/reviews.html', 'text/html')
    }
     else if(req.method === 'GET' && req.url === '/html/test') {
        sendStaticFile(res, 'html/test.html', 'text/html')
    }
    else if(req.method === 'GET' && req.url === '/html/login') {
        // fs.readFile(path.join(__dirname,'reviews.html'))
        // .then((data) => {
        //     res.writeHead(200, {'Content-type': 'text/html'})
        //     res.end(data);
        // })
        //or
         sendStaticFile(res, 'html/login.html', 'text/html')
    }
    else if(req.method === 'GET' && req.url === '/html/signup') {
         sendStaticFile(res, 'html/signup.html', 'text/html')
    }
    else if(req.method === 'GET' && req.url === '/html/reviewsV2') {
        sendStaticFile(res, 'html/reviewsV2.html', 'text/html')
    }
    else if(req.method === 'GET' && req.url === '/css/reviews.css') {
         sendStaticFile(res, 'css/reviews.css', 'text/css')
    }
    else if(req.method === 'GET' && req.url === '/css/auth.css') {
         sendStaticFile(res, 'css/auth.css', 'text/css')
    }
    else if(req.method === 'GET' && req.url === '/css/reviewsV2.css') {
        sendStaticFile(res, 'css/reviewsV2.css', 'text/css')
    }
    else if(req.method === 'GET' && req.url === '/views/oldFirstScript.js') {
         sendStaticFile(res, 'views/oldFirstScript.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/views/reviewsView.js') {
        console.log('hi')
         sendStaticFile(res, 'views/reviewsView.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/api/authApi.js') {
         sendStaticFile(res, 'api/authApi.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/api/reviewsApi.js') {
         sendStaticFile(res, 'api/reviewsApi.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/reviewButton.js') {
         sendStaticFile(res, 'components/reviewButton.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/sendReviewForm.js') {
         sendStaticFile(res, 'components/sendReviewForm.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/newReviewRow.js') {
         sendStaticFile(res, 'components/newReviewRow.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/reviewsPagination.js') {
         sendStaticFile(res, 'components/reviewsPagination.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/reviewsFilterBar.js') {
        sendStaticFile(res, 'components/reviewsFilterBar.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/reviewsSortBar.js') {
        sendStaticFile(res, 'components/reviewsSortBar.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/utils/utils.js') {
         sendStaticFile(res, 'utils/utils.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/reviewRowActions.js') {
         sendStaticFile(res, 'components/reviewRowActions.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/views/logInView.js') {
         sendStaticFile(res, 'views/logInView.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/views/signUpView.js') {
         sendStaticFile(res, 'views/signUpView.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/views/reviewsViewV2.js') {
        sendStaticFile(res, 'views/reviewsViewV2.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/appState.js') {
        sendStaticFile(res, 'appState.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/reviewsFilterBarV2.js') {
        sendStaticFile(res, '/components/reviewsFilterBarV2.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/api/reviewsApiV2.js') {
        sendStaticFile(res, 'api/reviewsApiV2.js', 'application/javascript')
    }
    else if(req.method === 'GET' && req.url === '/components/newReviewArticleV2.js') {
        sendStaticFile(res, 'components/newReviewArticleV2.js', 'application/javascript')
    }


    //getting companies for send form
    if(req.method === "GET" && req.url.startsWith("/get-companies")) {
        let allCompanies = Array.from(new Set(notes.map((item) => item.company))); //only unique
        console.log(allCompanies);
        // return sendResponse(res, 200, {allCompanies}); // {allCompanies: allCompanies} 1st option - object
        return sendResponse(res, 200, allCompanies); // 2nd option - array


    }

    // getting reviews
    if(req.method === 'GET' && req.url.startsWith('/get-review')) {

        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;

        let notesFilteredAndSorted = notes;

        //adding filtering by company
        let company = query.company;
        if(company && company !== "all") {
            notesFilteredAndSorted = notes.filter(note => note.company === company)
        }

        //adding sorting
        let sorting = query.sort;
        if(sorting === "date_new_to_old") {
            notesFilteredAndSorted = [...notesFilteredAndSorted].sort((review1, review2) => new Date(review2.date) - new Date(review1.date));
        }
        else if(sorting === "date_old_to_new") {
            notesFilteredAndSorted = [...notesFilteredAndSorted].sort((review1, review2) => new Date(review1.date) - new Date(review2.date));
        }
        else if(sorting === "rating_low_to_high") {
            notesFilteredAndSorted = [...notesFilteredAndSorted].sort((review1, review2) => review1.rating - review2.rating);
        }
        else if(sorting === "rating_high_to_low") {
            notesFilteredAndSorted = [...notesFilteredAndSorted].sort((review1, review2) => review2.rating - review1.rating);
        }


        //determine pagination start and end
        let start = (page -1) * limit;
        let end = start + limit;

        // let paginatedItems = notes.slice(start, end);
        let paginatedItems = notesFilteredAndSorted.slice(start, end);

        //determine totalItems and totalPages
        let totalItems = notesFilteredAndSorted.length;
        let totalPages = Math.ceil(totalItems / limit);

        // res.writeHead(200, {'Content-Type': 'application/json'});
        // res.end(JSON.stringify(notes))
        //or
        return sendResponse(res, 200, {
            page,
            limit,
            items: paginatedItems,
            totalItems,
            totalPages,
            filter: company || null,
        });
    }

    // let parsedUrl = url.parse(req.url, true);
    // let { pathname, query} = parsedUrl;

    // if(req.method==="GET" && req.url=== `/companies/${company}/reviews`) {
    console.log(req.url);
    console.log(pathname);
    console.log(/^\/companies\/[\w\s]+\/reviews/.test(pathname))
    if(req.method === "GET" && /^\/companies\/[\w\s]+\/reviews/.test(pathname)) {
        let company= pathname.split('/')[2];
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 5;
        console.log(typeof query.filter);
        let filter = parseInt(query.filter);
        console.log(typeof filter);

        let sort = query.sort;

        let reviewsByCompany = notes.filter((companyName) => {
            return companyName.company === company
        });

        // console.log(reviewsByCompany);

        if(filter && isNaN(filter) ) {
            reviewsByCompany=reviewsByCompany.filter((review) => {
                return Number(review.rating) === filter;
            })
        }
        // console.log(reviewsByCompany);

        if(sort && sort!== "no_sort") {
            if(sort === "newest") {
                reviewsByCompany = [...reviewsByCompany].sort((review1, review2) => {
                    return new Date(review1.date) - new Date(review2.date);
                })
            }
            else if(sort === "oldest") {
                reviewsByCompany = [...reviewsByCompany].sort((review1, review2) => {
                    return new Date(review2.date) - new Date(review1.date);
                })
            }
        }

        // console.log(reviewsByCompany);


        //TODO add pagination logic

        return sendResponse(res, 200, {
            page,
            limit,
            filter: filter || null,
            sort: sort || null,
            items: reviewsByCompany,
        })
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
                // checking if json is valid
                let parsedJsonBody;
                try {
                    parsedJsonBody = JSON.parse(body||"{}");
                }
                catch(error) {
                    return sendResponse(res, 400, {message: "Invalid json"})
                }

                // getting data from frontend
                // let {email, password} = JSON.parse(body);
                let {email, password} = parsedJsonBody;

                // checking email and password aren't falsy
                if(!email || !password) return sendResponse(res, 401, {message: "Invalid email or password(falsy)"})
                // console.log("hit");

                //checking email and password data types are strings
                if(typeof email !== "string" || typeof password !== "string") return sendResponse(res, 401, {message: "Invalid email or password(not strings"})

                //checking if a user exists
                let user = users.find(user => user.email === email);
                if(!user) return sendResponse(res, 401, {message: "Invalid email or password(user doesn't exist)"});
                // console.log("hit2");

                //comparing password from payload and the one saved on the server
                let isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch) return sendResponse(res, 401, {message: "Invalid email or password(password is wrong)"});
                // console.log("hit3");

                // generating token
                let token = jwt.sign(
                    {userId: user.id, email: user.email},
                    SECRET,
                    {expiresIn: '1h'});
                console.log("hit4");

                //sending response to the server
                return sendResponse(res, 200, {
                    message: "User signed in successfully",
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                    }
                })
            }
            catch (error) {
                return sendResponse(res, 500, {message: "Server error"});
            }
        })
        return ;
    }

    // SIGN UP ENDPOINT
    if(req.method === "POST" && req.url.startsWith('/sign-up')) {
        let body = "";
        req.on('data', (chunk) => body+= chunk);
        req.on('end', async() => {
            try{
                // checking if json is valid
                let parsedJsonBody;
                try{
                    parsedJsonBody = JSON.parse(body||"{}");
                }
                catch (error) {
                   return sendResponse(res, 400, {message: "Invalid json"})
                }

                // getting email and password from the frontend payload
                // let {name, email, password, confirmPassword} = JSON.parse(body);
                let {name, email, password, confirmPassword} = parsedJsonBody;

                //validation block

                //required fields - checking the payload isn't empty, values aren't falsy
                if(!name || !email || !password || !confirmPassword) return sendResponse(res, 400, {message: "All fields required"});

                //checking the values are strings
                if(typeof name!=="string" || typeof email!=='string' || typeof password!=='string' || typeof confirmPassword!=='string') {
                    return sendResponse(res, 400, {message:"Invalid values(not strings"})
                }

                //checking name is ok
                name = name.trim();
                // if(name.length < 3 || name.length > 10) return sendResponse(res, 400, {message:"Name should be less than 5-10 characters"});

                //checking if the user email already exists
                email = String(email).trim().toLowerCase();
                let userExists = users.find(user => user.email.toLowerCase() === email);
                if(userExists) return sendResponse(res, 409, {message: "User already exists"});
                // //checking email is correct
                // let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                // let isEmailCorrect = emailRegex.test(email);
                // if(!isEmailCorrect) return sendResponse(res,400, "Email is too weak");
                // // checking email length
                if(email.length === 0 || email.length > 50) return sendResponse(res, 400, {message: "Invalid email(should be 0-50 characters"});

                // checking password length
                if(password.length < 3 || password.length > 10) return sendResponse(res, 400, {message: "Password length should be more than 3 and less than 10 letters"});
                // //checking password strength
                // let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                // let isStrongPassword = passwordRegex.test(password);
                // if(!isStrongPassword) return sendResponse(res, 400, "Password is too weak");

                // comparing password and confirmPassword values match
                if(password !== confirmPassword) return sendResponse(res, 400, {message: "Passwords don't match"});

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
                return sendResponse(res, 500, {message: "Server error"});
            }
        })

    }
    // else {
    //     return sendResponse(res, 404, "Not found")
    // }
});

(async function start() {
    try {

        await fs.mkdir(DATA_DIR, { recursive: true });

        notes = await getNotesFromFile();
        users = await getUsersFromFile();
        server.listen(port, () => {
            console.log(`Server started at port ${port}`)
        })
    }
    catch(error) {
        console.error('Failed to launch the server', error);
        process.exit(1);
    }
})();


