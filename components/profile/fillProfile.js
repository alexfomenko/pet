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
                        <button class="ghost-btn" onclick="location.hash='empty'">Cancel</button>
                        <button id="fill-profile-save" class="btn" onclick="location.hash='completed'">Save and continue</button>
                    </div>

                </div>
                </div>
`
}
// 1ST APPROACH - DELEGATION
// document.querySelector('.wrap').addEventListener('click', (e) => {
//     if (e.target.id === 'fill-profile-save') {
//         let companyValue = document.getElementById('fill-profile-company');
//
//     }
// });

//2ND APPROACH - SEPARATE FUNCTION
export function initFillProfile() {
    document.getElementById('fill-profile-save').addEventListener('click', async (e) => {
        let companyValue = document.getElementById('fill-profile-company').value;
        let cityValue = document.getElementById('fill-profile-city').value;
        let bioValue = document.getElementById('fill-profile-about').value;

        let data = {company: companyValue, city: cityValue, bio: bioValue};

        let sendRequest = await updateProfileData(data);
    });
}