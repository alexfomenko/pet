import {renderProfileHeader} from "./profileHeader.js";
import {renderProfileTabs} from "./profileTabs.js";
import {renderEmptyProfile} from "./emptyProfile.js";
import {renderFillProfile} from "./fillProfile.js";
import {renderCompletedProfile} from "./completedProfile.js";
import {renderReviewsProfile} from "./reviewsProfile.js";

export function renderProfilePage(pageName) {
    //     // определяем какой контент показать
//     let content = '';
//     if (pageName === 'empty')     content = renderEmptyProfile();
//     if (pageName === 'fill')      content = renderFillProfile();
//     if (pageName === 'completed') content = renderCompletedProfile();
//
//     console.log('pageName:', pageName)
//     console.log('content:', content)
//
//     document.querySelector('.wrap').innerHTML = `
//     <section class="section">
// <div class="container">
//     ${renderProfileHeader()}
//     ${renderProfileTabs()}
//
//     <div class="profile-body card">
//     ${content}
//     </div>
//
// </div>
//     </section>
//     `
    return `<div></div>`
}

// ${renderEmptyProfile()}
//
// import { renderProfileHeader } from './components/profileHeader.js';
// import { renderProfileTabs }   from './components/profileTabs.js';
// import { renderEmptyProfile }     from './pages/emptyProfile.js';
// import { renderFillProfile }      from './pages/fillProfile.js';
// import { renderCompletedProfile } from './pages/completedProfile.js';
//
// const user = {
//     name:      'Алексей Иванов',
//     role:      'Frontend Developer',
//     email:     'alex.ivanov@email.com',
//     avatar:    'avatar.jpg',
//     about:     'Frontend Developer с 5-летним опытом. Специализируюсь на React, TypeScript.',
//     skills:    ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML', 'CSS'],
//     rating:    4.9,
//     reviews:   127,
//     favorites: 54,
// };
//
// export function renderPage(pageName) {
//     // определяем какой контент показать
//     let content = '';
//     if (pageName === 'empty')     content = renderEmptyProfile();
//     if (pageName === 'fill')      content = renderFillProfile();
//     if (pageName === 'completed') content = renderCompletedProfile(user);
//
//     // вставляем header + табы + контент в #app
//     document.getElementById('app').innerHTML = `
//     <div class="profile-card">
//       ${renderProfileHeader(user)}
//       ${renderProfileTabs()}
//       <div class="profile-content">
//         ${content}
//       </div>
//     </div>
//   `;
// }