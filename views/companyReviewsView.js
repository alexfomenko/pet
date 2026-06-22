import {appState} from "../appState.js";
import "../components/reviewsFilterBarV2.js";
import {renderReviewsV2} from "../components/newReviewArticleV2.js";
import "../components/reviewsSortBarV2.js";
import {getCompanyReviews} from "../api/reviewsApiV2.js";
import {showGradeRows} from "../components/gradeCardV2.js";
import "../components/reviewsPaginationV2.js";
import {renderPaginationV2} from "../components/reviewsPaginationV2.js";
import "../components/reviewFormV2.js"

document.addEventListener("DOMContentLoaded", async ()=> {
    // console.log('hi');
    let company = document.querySelector('.company-name').textContent;

    //showing all articles
    let results = await getCompanyReviews(company, appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort);
    console.log(results)
    renderReviewsV2(results.items);

    //showing all grades
    await showGradeRows(company);

    //show pagination
    await renderPaginationV2(company);
})

