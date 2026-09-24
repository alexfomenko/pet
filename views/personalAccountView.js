import {renderProfilePage} from "../components/profile/profileRouter.js";

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
