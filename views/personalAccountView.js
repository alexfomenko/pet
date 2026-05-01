import {renderProfilePage} from "../components/profile/profileRouter.js";
import {getProfileState} from "../components/profile/profileRouter.js";
import {updateProfileData} from "../api/personalProfileApi.js";

// window.addEventListener('DOMContentLoaded', async () => {
//     const hash = location.hash.replace('#', '') || 'profile';
//     if (hash === 'profile') {
//         await renderProfilePage(getProfileState());
//     } else {
//         await renderProfilePage(hash);
//     }
// });

window.addEventListener('hashchange', async() => {
    const hash = location.hash.replace('#', '') || 'profile';
    if(hash === 'profile') {
       await renderProfilePage(getProfileState())
    }
    else {
        await renderProfilePage(hash)
    }
});

const hash = location.hash.replace('#', '') || 'profile';
if(hash === 'profile') {
    await renderProfilePage(getProfileState())
}
else {
    await renderProfilePage(hash)
}

let editBtn = document.querySelector('.edit-btn');
let fillInBtn = document.querySelector('.fill-btn');
let nameEl = document.querySelector('.person-name');
let titleEl = document.querySelector('.person-title');
let emailEl = document.querySelector('.person-email');
let saveBtn;
let header = document.querySelector('.profile-header');

header.addEventListener('click', (e) => {
    if(e.target.classList.contains('edit-btn')) {
        nameEl.innerHTML = `<input type="text" value="${nameEl.textContent}">`;
        titleEl.innerHTML = `<input type="text" value="${titleEl.textContent}">`;
        emailEl.innerHTML = `<input type="text" value="${emailEl.textContent}">`;

        editBtn.style.display = "none";

        saveBtn = document.createElement('button');
        saveBtn.classList.add('save-btn','btn');
        saveBtn.textContent = "Save";
        header.appendChild(saveBtn);
    }
    else if(e.target.classList.contains('save-btn')) {
        nameEl.textContent = nameEl.querySelector('input').value;
        titleEl.textContent = titleEl.querySelector('input').value;
        emailEl.textContent = emailEl.querySelector('input').value;

        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
    }
})


let tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
        tabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        tab.classList.add("active");
    })
})



