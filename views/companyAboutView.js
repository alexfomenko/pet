import {getCompanyReviews} from "../api/reviewsApiV2.js";
import {appState} from "../appState.js";
import {renderReviewsV2} from "../components/newReviewArticleV2.js";
import {showGradeRows} from "../components/gradeCardV2.js";
import "../components/reviewFormV2.js"
import "../components/reviewsFilterBarV2.js"
import "../components/reviewsSortBarV2.js"
import {getCompanyAboutData} from "../api/reviewsApiV2.js";
import {renderCompanyAbout} from "../components/company/companyAboutRender.js";

document.addEventListener("DOMContentLoaded", async () => {
    let params = new URLSearchParams(location.search);
    let company = params.get('company');

    let companyData = await getCompanyAboutData(company);
    renderCompanyAbout(companyData);

    let companyReviews = await getCompanyReviews(company, appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort);
    renderReviewsV2(companyReviews.items);

    await showGradeRows(company);
})