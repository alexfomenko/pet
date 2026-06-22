import {renderProfileHeader} from "./profileHeader.js";
import {renderProfileTabs} from "./profileTabs.js";
import {renderEmptyProfile} from "./emptyProfile.js";
import {renderFillProfile} from "./fillProfile.js";
import {handleUpdateProfileActions} from "./fillProfile.js";
import {renderCompletedProfile} from "./completedProfile.js";
import {handleChangeReviewActions, renderReviewsProfile} from "./reviewsProfile.js";
import {getOwnProfileData} from "../../api/personalProfileApi.js";
import {handleProfileHeaderEdit} from "./profileHeader.js";
import {getUserReviews} from "../../api/personalProfileApi.js";
import {getProfileData} from "../../api/personalProfileApi.js";


// GET CURRENT PROFILE STATE AND DETERMINE WHICH HASH AND, CORRESPONDINGLY, PAGE TO SHOW
export function getProfileState(user) {
    const filled = [user?.company, user?.city, user?.bio].filter(Boolean);
    if (filled.length === 0) return 'empty';
    if (filled.length === 3) return 'completed';
    return 'fill';
    // return 'empty';
}
// export function getProfileState() {
//     let companyValue = document.querySelectorAll('.fill-state-label')[0].querySelector('input').value;
//     let cityValue = document.querySelectorAll('.fill-state-label')[1].querySelector('input').value;
//     let aboutUserValue = document.querySelectorAll('.fill-state-label')[2].querySelector('textarea').value;
//
//     let filledData = [companyValue, cityValue, aboutUserValue].filter(Boolean);
//     if(filledData.length === 0) return 'empty';
//     if(filledData.length === 3) return 'completed';
//     return 'fill';
// }

//1ST ATTEMPT
// export function renderProfilePage(pageName) {
//         // определяем какой контент показать
//     let content = '';
//     if (pageName === 'empty')     content = renderEmptyProfile();
//     if (pageName === 'fill')  {
//         content = renderFillProfile();
//         initFillProfile();
//     }
//     if (pageName === 'completed') content = renderCompletedProfile();
//     if (pageName ==='reviews') content = renderReviewsProfile();
//
//     console.log('pageName:', pageName)
//     console.log('content:', content)
//
//     document.querySelector('.wrap').innerHTML = `
//     <section class="section">
//     <div class="container">
//     ${renderProfileHeader()}
//     ${renderProfileTabs()}
//     ${content}
//     </div>
//     </section>
//     `
//     // return `<div></div>`
// }

// 2ND ATTEMPT
// export function renderProfilePage(pageName) {
//     let content = '';
//     if (pageName === 'empty')     content = renderEmptyProfile();
//     if (pageName === 'fill')      content = renderFillProfile();
//     if (pageName === 'completed') content = renderCompletedProfile();
//     if (pageName === 'reviews')   content = renderReviewsProfile();
//
//     // вот здесь HTML попадает на страницу
//     document.querySelector('.wrap').innerHTML = `
//     <section class="section">
//     <div class="container">
//     ${renderProfileHeader()}
//     ${renderProfileTabs()}
//     ${content}
//     </div>
//     </section>
//     `;
//
//     // только после этого кнопка существует в DOM
//     if (pageName === 'fill') initFillProfile();
// }

// 3RD ATTEMPT WITH CONFIG OBJECT INSTEAD OF IF - длинной цепочки ифов
const pageConfig = {
    empty:     { render: () => renderEmptyProfile(),         init: null },
    fill:      { render: () => renderFillProfile(),          init: handleUpdateProfileActions },
    completed: { render: ({ user }) => renderCompletedProfile(user), init: null },
    reviews:   { render: ({ reviews }) => renderReviewsProfile(reviews), init: handleChangeReviewActions},
};

// const pageConfig = {
//     completed: {
//         render: function(data) {
//             return renderCompletedProfile(data.user);
//         },
//         init: null
//     },
//
//     reviews: {
//         render: function(data) {
//             return renderReviewsProfile(data.reviews);
//         },
//         init: null
//     }
// };




// То есть #profile — это не отдельная страница. Это команда: “покажи мне правильное состояние профиля по данным пользователя”.
// export async function renderProfilePage(pageName) {
//     let config = pageConfig[pageName];
//     if(!config){console.warn(`Unknown page: ${pageName}`); return;}
//     const { render, init } = config;
//
//     let sendGetProfileDataRequest = await getOwnProfileData();
//     let user = sendGetProfileDataRequest.success ? sendGetProfileDataRequest.user : null;
//
//     let reviews = [];
//     if (pageName === 'reviews') {
//         let sendGetUserReviewsRequest = await getUserReviews();
//         reviews = sendGetUserReviewsRequest.success ? sendGetUserReviewsRequest.reviews : [];
//     }
//
//     document.querySelector('.wrap').innerHTML = `
//     <section class="section">
//     <div class="container">
//     ${renderProfileHeader(user)}
//     ${renderProfileTabs()}
//     ${render({ user, reviews })}
//     </div>
//     </section>
//     `;
//
//     await handleProfileHeaderEdit();
//     if (init) init();
//
//     if(pageName === 'fill') {
//         let companyInput = document.getElementById('fill-profile-company');
//         let cityInput= document.getElementById('fill-profile-city');
//         let bioInput = document.getElementById('fill-profile-about');
//         let profileDraft = JSON.parse(localStorage.getItem('profileDraft') || '{}');
//         // Есть черновик — восстанавливаем.Сценарий: нажал "назад" / перезагрузил / закрыл вкладку и открыл снова
//         if(Object.keys(profileDraft).length > 0) {
//             companyInput.value = profileDraft.company;
//             cityInput.value = profileDraft.city;
//             bioInput.value = profileDraft.bio;
//         }
//         // get data from api request
//         else {
//             companyInput.value = user?.company ?? '';
//             cityInput.value = user?.city ?? '';
//             bioInput.value = user?.bio ?? '';
//         }
//     }
// }

export async function renderProfilePage(hash, userId=null) {
    let sendGetProfileDataRequest;

    //if public profile or private
    // let isProfilePublic = userId && userId !== 'undefined' && userId !== 'null';
    // if(isProfilePublic) {
    //     sendGetProfileDataRequest = await getProfileData(userId);
    // }
    // else {
    //     sendGetProfileDataRequest = await getOwnProfileData();
    // }
    let isAnonymousProfile = userId === 'anonymous';
    let isProfilePublic = userId && userId !== 'undefined' && userId !== 'null' && !isAnonymousProfile;

    if (isProfilePublic) {
        sendGetProfileDataRequest = await getProfileData(userId);
    } else if (isAnonymousProfile) {
        sendGetProfileDataRequest = {
            success: true,
            user: null,
        };
    } else {
        sendGetProfileDataRequest = await getOwnProfileData();
    }

    let user = sendGetProfileDataRequest.success ? sendGetProfileDataRequest.user : null;

    //if private profile determine what to render by hash
    if(hash==='profile') {
        hash = getProfileState(user);
    }

    let config = pageConfig[hash];
    if(!config){console.warn(`Unknown page: ${hash}`); return;}
    let { render, init } = config;

    //if hash === reviews
    let reviews = [];
    if (hash === 'reviews') {
        let sendGetUserReviewsRequest = await getUserReviews();
        reviews = sendGetUserReviewsRequest.success ? sendGetUserReviewsRequest.reviews : [];
    }

    //rendering
    document.querySelector('.wrap').innerHTML = `
    <section class="section">
    <div class="container">
    ${renderProfileHeader(user, !isProfilePublic)}
    ${isProfilePublic? '' : renderProfileTabs()}
    ${render({ user, reviews })}
    </div>
    </section>
    `;

    await handleProfileHeaderEdit();
    if (init) init();

    if(hash === 'fill') {
        let companyInput = document.getElementById('fill-profile-company');
        let cityInput= document.getElementById('fill-profile-city');
        let bioInput = document.getElementById('fill-profile-about');
        let profileDraft = JSON.parse(localStorage.getItem('profileDraft') || '{}');
        // Есть черновик — восстанавливаем.Сценарий: нажал "назад" / перезагрузил / закрыл вкладку и открыл снова
        if(Object.keys(profileDraft).length > 0) {
            companyInput.value = profileDraft.company;
            cityInput.value = profileDraft.city;
            bioInput.value = profileDraft.bio;
        }
        // get data from api request
        else {
            companyInput.value = user?.company ?? '';
            cityInput.value = user?.city ?? '';
            bioInput.value = user?.bio ?? '';
        }
    }
}
