import {renderProfileHeader} from "./profileHeader.js";
import {renderProfileTabs} from "./profileTabs.js";
import {renderEmptyProfile} from "./emptyProfile.js";
import {renderFillProfile} from "./fillProfile.js";
import {initFillProfile} from "./fillProfile.js";
import {renderCompletedProfile} from "./completedProfile.js";
import {renderReviewsProfile} from "./reviewsProfile.js";

export const user = {
    company: '',
    city: 'hhhhhhh',
    about: ''
};
export function getProfileState() {
    const filled = [user.company, user.city, user.about].filter(Boolean);
    if (filled.length === 0) return 'empty';
    if (filled.length === 3) return 'completed';
    return 'fill';
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

// 3RD ATTEMPT WITH CONFIG OBJECT INSTEAD OF IF
const pageConfig = {
    empty:     { render: renderEmptyProfile,     init: null },
    fill:      { render: renderFillProfile,      init: initFillProfile },
    completed: { render: renderCompletedProfile, init: null },
    reviews:   { render: renderReviewsProfile,   init: null },
};

export function renderProfilePage(pageName) {
    const { render, init } = pageConfig[pageName];

    document.querySelector('.wrap').innerHTML = `
    <section class="section">
    <div class="container">
    ${renderProfileHeader()}
    ${renderProfileTabs()}
    ${render()}
    </div>
    </section>
    `;

    if (init) init();
}