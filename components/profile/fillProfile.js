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
export function handleUpdateProfileActions() {
    let fillProfileContainer = document.querySelector('.fill-state-body');
    let companyInput = document.getElementById('fill-profile-company');
    let cityInput= document.getElementById('fill-profile-city');
    let bioInput = document.getElementById('fill-profile-about');
    let cancelButton = document.querySelector('.ghost-btn');
    let fillProfileSaveButton = document.getElementById('fill-profile-save');
    let saveTimeOut;

    fillProfileContainer.addEventListener('input', () => {
        clearTimeout(saveTimeOut);
        saveTimeOut = setTimeout(() => {
            localStorage.setItem('profileDraft', JSON.stringify({
                company: companyInput.value,
                city: cityInput.value,
                bio: bioInput.value,
            }))
        }, 400);
    });

    cancelButton.addEventListener('click', () => {
        localStorage.removeItem('profileDraft');
        location.hash = 'empty';
    })

    fillProfileSaveButton.addEventListener('click', async () => {
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

// React example kept only for reference; it is not executed.
// /*

// import { useState, useEffect } from 'react';
//
// function FillProfile({ user, onSave, onCancel }) {
//     const [draft, setDraft] = useState(() => {
//         const saved = JSON.parse(localStorage.getItem('profileDraft') || '{}');
//         if (Object.keys(saved).length > 0) return saved;
//         return {
//             company: user?.company ?? '',
//             city: user?.city ?? '',
//             bio: user?.bio ?? '',
//         };
//     });
//
//     useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             localStorage.setItem('profileDraft', JSON.stringify(draft));
//         }, 400);
//
//         return () => clearTimeout(timeoutId);
//     }, [draft]);
//
//     function handleCancel() {
//         localStorage.removeItem('profileDraft');
//         onCancel();
//     }
//
//     async function handleSave() {
//         try {
//             await updateProfileData(draft);
//             localStorage.removeItem('profileDraft');
//             onSave();
//         } catch (error) {
//             console.log("An error occurred while saving", error);
//         }
//     }
//
//     return (
//         <div className="profile-body card">
//             <div className="fill-state">
//                 <div className="fill-state-header">
//                     <h1>Fill out your profile</h1>
//                 </div>
//
//                 <div className="fill-state-body">
//                     <label className="fill-state-label" htmlFor="fill-profile-company">
//                         <span>Company</span>
//                         <input
//                             type="text"
//                             id="fill-profile-company"
//                             placeholder="For example, Kedi Company"
//                             value={draft.company}
//                             onChange={(e) => setDraft({ ...draft, company: e.target.value })}
//                         />
//                     </label>
//
//                     <label className="fill-state-label" htmlFor="fill-profile-city">
//                         <span>City</span>
//                         <input
//                             type="text"
//                             id="fill-profile-city"
//                             placeholder="For example, Istanbul"
//                             value={draft.city}
//                             onChange={(e) => setDraft({ ...draft, city: e.target.value })}
//                         />
//                     </label>
//
//                     <label className="fill-state-label fill-state-label-full" htmlFor="fill-profile-about">
//                         <span>About yourself</span>
//                         <textarea
//                             id="fill-profile-about"
//                             placeholder="Tell about your experience, specialization, interests"
//                             value={draft.bio}
//                             onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
//                         />
//                     </label>
//                 </div>
//
//                 <div className="fill-state-footer">
//                     <button className="ghost-btn" onClick={handleCancel}>Cancel</button>
//                     <button id="fill-profile-save" className="btn" onClick={handleSave}>
//                         Save and continue
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
// */
