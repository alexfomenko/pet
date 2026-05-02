import {renderProfilePage} from "../components/profile/profileRouter.js";
import {getProfileState} from "../components/profile/profileRouter.js";
import {updateProfileData} from "../api/personalProfileApi.js";
window.addEventListener('hashchange', async() => {
    const hash = location.hash.replace('#', '') || 'profile';
    if(hash === 'profile') {
       await renderProfilePage(getProfileState())
    }
    else {
        await renderProfilePage(hash)
    }
});

const hash = location.hash.replace('#', '') || 'profile';
if(hash === 'profile') {
    await renderProfilePage(getProfileState())
}
else {
    await renderProfilePage(hash)
}





