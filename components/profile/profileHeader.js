import {updateProfileData} from "../../api/personalProfileApi.js";
import {uploadProfileAvatar} from "../../api/personalProfileApi.js";

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
<!--    <img class="profile-avatar" src="/uploads/avatars/photo.webp" alt="Profile photo">-->
    <img class="profile-avatar" src="" alt="Profile photo">
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
    const avatarChangeButton = document.querySelector('.avatar-change-btn');
    const avatarInput = document.querySelector('.avatar-input');
    const preview = document.querySelector('.profile-avatar');

    avatarChangeButton.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async () => {
        const file = avatarInput.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            // showError('The image must be smaller than 5 MB'); //todo
            alert('The image must be smaller than 5 MB'); //todo
            return;
        }
        preview.src = URL.createObjectURL(file);
        // Здесь продолжается первоначальный код с FormData и fetch.
        const formData = new FormData();
        formData.append('avatar', file);

        await uploadProfileAvatar(formData); //todo uncomment

        // await fetch('/profile/avatar', {
        //     method: 'PUT',
        //     headers: {
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     },
        //     body: formData
        // });
    });
}
