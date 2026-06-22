import {getCompanyReviews} from "../api/reviewsApiV2.js";
import {appState} from "../appState.js";
import {renderReviewsV2} from "../components/newReviewArticleV2.js";
import {showGradeRows} from "../components/gradeCardV2.js";
import "../components/reviewFormV2.js"
import "../components/reviewsFilterBarV2.js"
import "../components/reviewsSortBarV2.js"

document.addEventListener("DOMContentLoaded", async () => {
    let company = document.querySelector(".company-name").textContent;
    let results = await getCompanyReviews(company, appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort);

    renderReviewsV2(results.items);

    await showGradeRows(company);

})