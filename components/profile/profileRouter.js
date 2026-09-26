import {handleAvatarChange, renderProfileHeader} from "./profileHeader.js";
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
import {logOutFunction} from "./profileHeader.js";
import {handleEditCompletedProfile} from "./completedProfile.js";

// GET CURRENT PROFILE STATE AND DETERMINE WHICH HASH AND, CORRESPONDINGLY, PAGE TO SHOW
export function getProfileState(user) {
    const filled = [user?.company, user?.city, user?.bio].filter(Boolean);
    if (filled.length === 0) return 'empty';
    if (filled.length === 3) return 'completed';
    return 'fill';
}

const pageConfig = {
    empty:     { render: () => renderEmptyProfile(),         init: null },
    fill:      { render: () => renderFillProfile(),          init: handleUpdateProfileActions },
    completed: { render: ({ user, canEdit }) => renderCompletedProfile(user, canEdit), init: handleEditCompletedProfile },
    reviews:   { render: ({ reviews }) => renderReviewsProfile(reviews), init: handleChangeReviewActions},
};

export async function renderProfilePage(hash, userId=null) {
    let sendGetProfileDataRequest;

    // Determine whether the requested profile is public, anonymous, or owned by the current user.
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
        if(sendGetProfileDataRequest.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/html/login';
            return;
        }
    }

    let user = sendGetProfileDataRequest.success ? sendGetProfileDataRequest.user : null;

    //if private profile determine what page to render and what eventListeners to add by hash
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
    ${render({ user, reviews, canEdit: !isProfilePublic })}
    </div>
    </section>
    `;

    //adding eventListeners
    if (!isProfilePublic) {
        await handleProfileHeaderEdit();
        await handleAvatarChange();
        logOutFunction();
    }
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
