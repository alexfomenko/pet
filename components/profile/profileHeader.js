import {updateProfileData} from "../../api/personalProfileApi.js";
import {uploadProfileAvatar} from "../../api/personalProfileApi.js";
import path from "path";

export function renderProfileHeader(user, canEdit = true){
    // let name;
    // if (user === null || user === undefined) {
    //     name = '—';
    // } else if (user.name === null || user.name === undefined) {
    //     name = '—';
    // } else {
    //     name = user.name;
    // }

    const name    = user?.name    ?? '—';
    const email   = user?.email   ?? '—';
    let title = user?.title ?? '-';
    return `           
            <div class="profile-header card">
                <div class="company-about">
<!--                avatar-->
                <div class="avatar-control">
<!--&lt;!&ndash;    <img class="profile-avatar" src="/uploads/avatars/photo.webp" alt="Profile photo">&ndash;&gt; //todo-->
    <img class="profile-avatar" src=" " alt="Profile photo">
    <button type="button" class="avatar-change-btn" aria-label="Change profile photo">  📷 </button>
    <input class="avatar-input" type="file" accept="image/jpeg,image/png,image/webp" hidden >
</div>
<!--avatar finish-->
<!--                    <img src="https://www.osh.by/wp-content/uploads/2023/12/1041436899_0_206_2905_1840_1920x0_80_0_0_c7022893b761781d76fe592010d14bd2.jpg" alt="photo" width="200" height="100">-->
                    <div class="account-data">
                        <h1 class="person-name">${name}</h1>
                        <p class="person-title">${title}</p> 
                        <span class="person-email">${email}</span>
                    </div>
                </div>
                
                <div class="header-actions">
                   ${canEdit ? `<button class="edit-btn btn">Edit</button>` : '' }   
                    <button type="button" class="logout-btn" id="logoutButton">Log out</button>
                </div>
                    
            </div>`
}

// export function renderProfileHeader(user) {
//     return `
//     <div class="profile-header">
//       <img class="profile-avatar" src="${user.avatar}" alt="avatar">
//       <div class="profile-info">
//         <h2>${user.name}</h2>
//         <p>${user.role}</p>
//         <span class="profile-email">${user.email}</span>
//       </div>
//       <button class="btn-edit">Редактировать ▾</button>
//     </div>
//   `;
// }

export async function handleProfileHeaderEdit() {
    let editBtn = document.querySelector('.edit-btn');
    let fillInBtn = document.querySelector('.fill-btn');
    let nameEl = document.querySelector('.person-name');
    let titleEl = document.querySelector('.person-title');
    let emailEl = document.querySelector('.person-email');
    let saveBtn;
    let header = document.querySelector('.profile-header');

    let errorEl = document.createElement('span');
    errorEl.classList.add('header-error');
    errorEl.style.color = 'red';
    errorEl.style.display = 'none';
    header.appendChild(errorEl);

    header.addEventListener('click', async (e) => {
        if(e.target.classList.contains('edit-btn')) {
            nameEl.innerHTML = `<input type="text" value="${nameEl.textContent}">`;
            titleEl.innerHTML = `<input type="text" value="${titleEl.textContent}">`;
            emailEl.innerHTML = `<input type="text" value="${emailEl.textContent}">`;

            editBtn.style.display = "none";

            if(!document.querySelector('.save-btn')) {
                saveBtn = document.createElement('button');
                saveBtn.classList.add('save-btn','btn');
                saveBtn.textContent = "Save";
                header.appendChild(saveBtn);
            }

        }
        else if(e.target.classList.contains('save-btn')) {
            // nameEl.textContent = nameEl.querySelector('input').value;
            // titleEl.textContent = titleEl.querySelector('input').value;
            // emailEl.textContent = emailEl.querySelector('input').value;
            //
            // editBtn.style.display = 'inline-block';
            // saveBtn.style.display = 'none';

            let nameValue = nameEl.querySelector('input').value;
            let titleValue = titleEl.querySelector('input').value;
            let emailValue = emailEl.querySelector('input').value;
            let data = {
                name: nameValue,
                title: titleValue,
                email: emailValue,
            }

            // send request and check if it was success
            let sendUpdateRequest = await updateProfileData(data);
            if(!sendUpdateRequest.success) {
                errorEl.textContent = sendUpdateRequest.text;
                errorEl.style.display = 'inline';
                return;
            }

            //changing input values
            nameEl.textContent = nameValue;
            titleEl.textContent = titleValue;
            emailEl.textContent = emailValue;

            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
        }
    })
}

export function logOutFunction() {
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');

        window.location.href = '/html/login';
    });
}

export async function handleAvatarChange() {
    let avatarControl = document.querySelector('.avatar-control');
    if (!avatarControl) {
        return;
    }
    const avatarChangeButton = document.querySelector('.avatar-change-btn');
    const avatarInput = document.querySelector('.avatar-input');
    const avatarImage = document.querySelector('.profile-avatar');
    let previewUrl = null;

    avatarChangeButton.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async () => {
        //check file availability
        const file = avatarInput.files[0];
        if (!file) return;

        //check file format
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]
        if(!allowedTypes.includes(file.type)){
            alert('You can choose only jpeg, png, webp');
            avatarInput.value =''; //todo check
            return;
        }
        //check file size
        if (file.size > 5 * 1024 * 1024) {
            // showError('The image must be smaller than 5 MB'); //todo
            avatarInput.value = ''; // todo for what
            alert('The image must be smaller than 5 MB'); //todo
            return;
        }
        //if everything is ok, create temporary url
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl); //to do ???
        }
        //saving old empty url just in case
        let oldImage = avatarImage.src;
        previewUrl = URL.createObjectURL(file);
        avatarImage.src = previewUrl;

        // send file in form data
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            let result = await uploadProfileAvatar(formData); //todo uncomment
            // if(!result.success) {
            //     avatarImage.src = oldImage;
            //     alert(result.text);
            //     return;
            // }
            // avatarImage.src = result.avatarUrl; //todo when back is ready
        }
        catch (error){
            avatarImage.src = oldImage;
            alert("Unexpected error"); //todo
        }
        finally {
            URL.revokeObjectURL(previewUrl); //todo ???
            avatarChangeButton.disabled = false; //todo ???
            avatarInput.value = '';
        }
    });
}

//когда срабатывает change ?
const DATA_DIR = path.join(__dirname, 'json');

const NOTES_FILE = path.join(DATA_DIR, 'notes.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

//save to file system
// async function saveNoteToFile(file, array) {
//     await fs.writeFile(file, JSON.stringify(array));
// }
// await saveNoteToFile(USERS_FILE, users);
const AVATARS_DIR = path.join(
    __dirname,
    'uploads',
    'avatars'
);

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const EXTENSIONS_BY_MIME_TYPE = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

if (
    req.method === 'PUT' &&
    pathname === '/profile/avatar'
) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return sendResponse(res, 401, {
            message: 'Unauthorized'
        });
    }

    let decodedData;

    try {
        decodedData = jwt.verify(token, SECRET);
    } catch {
        return sendResponse(res, 401, {
            message: 'Invalid token'
        });
    }

    const userIndex = users.findIndex(
        user => user.id === decodedData.userId
    );

    if (userIndex === -1) {
        return sendResponse(res, 404, {
            message: 'User not found'
        });
    }

    const mimeType = req.headers['content-type'];
    const extension = EXTENSIONS_BY_MIME_TYPE[mimeType];

    if (!extension) {
        return sendResponse(res, 400, {
            message: 'Unsupported image type'
        });
    }

    const chunks = [];
    let receivedBytes = 0;

    let fileTooLarge = false;

    req.on('data', chunk => {
        receivedBytes += chunk.length;

        if (receivedBytes > MAX_AVATAR_SIZE) {
            fileTooLarge = true;
            return;
        }

        chunks.push(chunk);
    });

    req.on('end', async () => {
        if (fileTooLarge) {
            return sendResponse(res, 400, {
                message: 'The image must be smaller than 5 MB'
            });
        }

        if (receivedBytes === 0) {
            return sendResponse(res, 400, {
                message: 'Avatar file was not provided'
            });
        }

        const avatarBuffer = Buffer.concat(chunks);

        try {
            await fs.mkdir(AVATARS_DIR, {
                recursive: true
            });

            const fileName =
                `${decodedData.userId}${extension}`;

            const filePath = path.join(
                AVATARS_DIR,
                fileName
            );

            await fs.writeFile(
                filePath,
                avatarBuffer
            );

            const avatarUrl =
                `/uploads/avatars/${fileName}`;

            users[userIndex].avatarUrl = avatarUrl;

            await saveNoteToFile(
                USERS_FILE,
                users
            );

            return sendResponse(res, 200, {
                avatarUrl
            });
        } catch (error) {
            console.error(error);

            return sendResponse(res, 500, {
                message: 'Failed to save avatar'
            });
        }
    });

    req.on('error', error => {
        console.error(error);

        if (!res.writableEnded) {
            return sendResponse(res, 400, {
                message: 'Failed to read avatar'
            });
        }
    });

    return;
}