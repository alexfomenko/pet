import {renderProfilePage} from "../components/profile/profileRouter.js";
import {getProfileState} from "../components/profile/profileRouter.js";
import {updateProfileData} from "../api/personalProfileApi.js";

window.addEventListener('hashchange', handleRoute);
await handleRoute();

async function handleRoute() {
    let params = new URLSearchParams(location.search);
    let userId = params.get('userId');

    if (userId) {
        await renderProfilePage('completed', userId);
        return;
    }

    let hash = location.hash.replace('#', '') || 'profile';
    await renderProfilePage(hash);
}
// location.hash возвращает hash вместе с решёткой:location.hash // "#fill"
// Поэтому код делает replace Чтобы из "#fill" получить "fill".
// location.hash.slice(1) делает тоже

// Если URL такой: http://localhost:3000/html/personalProfile то location.hash будет пустой строкой "".
// Тогда эта строка: const hash = location.hash.replace('#', '') || 'profile';
// сделает: hash = 'profile'
// Дальше код заходит сюда:
//     if(hash === 'profile') {
//         await renderProfilePage(getProfileState())
//     }
// То есть он НЕ показывает страницу с именем profile. Он вызывает getProfileState(), а она возвращает одно из: 'empty' 'fill' 'completed'
// ТО ЕСТЬ ИЛИ ПОКАЗЫВАЙ ПО ХЕШУ ЧТО ДАЛИ, ИЛИ САМ ОПРЕДЕЛИ КАКОЙ ХЕШ НУЖЕН