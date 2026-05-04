import {updateProfileData} from "../../api/personalProfileApi.js";

export function renderFillProfile(){
    return `
<div class="profile-body card">
                    <div class="fill-state">
                    <div class="fill-state-header">
                        <h1>Fill out your profile</h1>
                    </div>

                    <div class="fill-state-body">
                        <label class="fill-state-label" for="fill-profile-company">
                            <span>Company</span>
                            <input type="text" id="fill-profile-company" placeholder="For example, Kedi Company">
                        </label>

                        <label class="fill-state-label" for="fill-profile-city">
                            <span>City</span>
                            <input type="text" id="fill-profile-city" placeholder="For example, Istanbul">
                        </label>

                        <label class="fill-state-label fill-state-label-full" for="fill-profile-about">
                            <span>About yourself</span>
                            <textarea id="fill-profile-about" placeholder="Tell about your experience, specialization, interests"></textarea>
                        </label>
                    </div>

                    <div class="fill-state-footer">
                        <button class="ghost-btn">Cancel</button>
                        <button id="fill-profile-save" class="btn">Save and continue</button>
                    </div>

                </div>
                </div>
`
}
// onclick="location.hash='empty'
// onclick="location.hash='completed'
// 1ST APPROACH - DELEGATION
// document.querySelector('.wrap').addEventListener('click', (e) => {
//     if (e.target.id === 'fill-profile-save') {
//         let companyValue = document.getElementById('fill-profile-company');
//
//     }
// });

//2ND APPROACH - SEPARATE FUNCTION
export function handleUpdateProfileActions() {
    let fillProfileContainer = document.querySelector('.fill-state-body');
    let companyInput = document.getElementById('fill-profile-company');
    let cityInput= document.getElementById('fill-profile-city');
    let bioInput = document.getElementById('fill-profile-about');
    let cancelButton = document.querySelector('.ghost-btn');
    let fillProfileSaveButton = document.getElementById('fill-profile-save');
    let saveTimeOut;

    fillProfileContainer.addEventListener('input', (e) => {
        clearTimeout(saveTimeOut);
        saveTimeOut = setTimeout(() => {
            localStorage.setItem('profileDraft', JSON.stringify({
                company: companyInput.value,
                city: cityInput.value,
                bio: bioInput.value,
            }))
        }, 400);
    });

    cancelButton.addEventListener('click', (e) => {
        localStorage.removeItem('profileDraft');
        location.hash = 'empty';
    })

    fillProfileSaveButton.addEventListener('click', async (e) => {
        let data = {company: companyInput.value, city: cityInput.value, bio: bioInput.value};
        try{
            await updateProfileData(data);

            localStorage.removeItem('profileDraft');
            location.hash = 'completed';
        }
        catch (error) {
            console.log("An error occurred while saving", error);
        }
    });
}