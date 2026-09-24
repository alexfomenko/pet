import {updateProfileData, uploadProfileAvatar} from "../../api/personalProfileApi.js";


export function renderProfileHeader(user, canEdit = true){
    const name    = user?.name    ?? '—';
    const email   = user?.email   ?? '—';
    let title = user?.title ?? '-';
    let avatarImgSrc = user?.avatarUrl ?? ' ';
    return `           
            <div class="profile-header card">
                <div class="company-about">
                <div class="avatar-control">
    <img class="profile-avatar" src="${avatarImgSrc}" alt="Profile photo">
    <button type="button" class="avatar-change-btn" aria-label="Change profile photo">  📷 </button>
    <input class="avatar-input" type="file" accept="image/jpeg,image/png,image/webp" hidden >
</div>
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

export async function handleProfileHeaderEdit() {
    let editBtn = document.querySelector('.edit-btn');
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
            let nameValue = nameEl.querySelector('input').value;
            let titleValue = titleEl.querySelector('input').value;
            let emailValue = emailEl.querySelector('input').value;
            let data = {
                name: nameValue,
                title: titleValue,
                email: emailValue,
            }

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
        const file = avatarInput.files[0];
        if (!file) return;

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]
        if(!allowedTypes.includes(file.type)){
            alert('You can choose only jpeg, png, webp');
            avatarInput.value ='';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            avatarInput.value = '';
            alert('The image must be smaller than 5 MB');
            return;
        }
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        let oldImage = avatarImage.src;
        previewUrl = URL.createObjectURL(file);
        avatarImage.src = previewUrl;

        const formData = new FormData();
        formData.append('avatar', file);
        try {
            let result = await uploadProfileAvatar(formData);
            if(!result.success) {
                avatarImage.src = oldImage;
                alert(result.text);
                return;
            }
            avatarImage.src = `${result.avatarUrl}?t=${Date.now()}`;
        }
        catch {
            avatarImage.src = oldImage;
            alert("Unexpected error");
        }
        finally {
            URL.revokeObjectURL(previewUrl);
            avatarChangeButton.disabled = false;
            avatarInput.value = '';
        }
    });
}
