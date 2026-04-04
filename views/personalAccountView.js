import {renderProfilePage} from "../components/profile/profileRouter.js";


let tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
        tabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        tab.classList.add("active");
    })
})

let editBtn = document.querySelector('.edit-btn');
let fillInBtn = document.querySelector('.fill-btn');
let nameEl = document.querySelector('.person-name');
let titleEl = document.querySelector('.person-title');
let emailEl = document.querySelector('.person-email');
let saveBtn;
let header = document.querySelector('.profile-header');
// editBtn.addEventListener('click', (e) => {
//     // let nameValue = nameEl.textContent;
//     // let titleValue = titleEl.textContent;
//     // let emailValue = emailEl.textContent;
//     //
//     nameEl.innerHTML = `<input type="text" value="${nameEl.textContent}">`;
//     titleEl.innerHTML = `<input type="text" value="${titleEl.textContent}">`;
//     emailEl.innerHTML = `<input type="text" value="${emailEl.textContent}">`;
//
//     editBtn.style.display = "none";
//
//     saveBtn = document.createElement('button');
//     saveBtn.classList.add('btn');
//     saveBtn.textContent = "Save";
//     header.appendChild(saveBtn);
// })

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
        // nameEl.textContent = nameEl.querySelector('input').value;
        // titleEl.textContent = titleEl.querySelector('input').value;
        // emailEl.textContent = emailEl.querySelector('input').value;

        nameEl.textContent = nameEl.querySelector('input').value;
        titleEl.textContent = titleEl.querySelector('input').value;
        emailEl.textContent = emailEl.querySelector('input').value;

        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
    }
})