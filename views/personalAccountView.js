import {renderProfilePage} from "../components/profile/profileRouter.js";
import {getProfileState} from "../components/profile/profileRouter.js";
import {updateProfileData} from "../api/personalProfileApi.js";

window.addEventListener('hashchange', handleRoute);
await handleRoute();

async function handleRoute() {
    const hash = location.hash.replace('#', '') || 'profile';
    if(hash === 'profile') {
        await renderProfilePage(getProfileState())
    }
    else {
        await renderProfilePage(hash)
    }
}




