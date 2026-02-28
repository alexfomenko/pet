import {getCompanyReviews} from "../api/reviewsApiV2.js";
import {appState} from "../appState.js";
import {renderReviewsV2} from "./newReviewArticleV2.js";

let sortBar = document.querySelector('[name="timeFilter"]');
let reviewContainer = document.querySelector(".content-reviews");

sortBar.addEventListener('change', async (e) => {
    let selectedSorting = e.target.value;
    reviewContainer.innerHTML = "";

    appState.sort = selectedSorting;
    appState.currentPage = 1;

    let currentCompany = document.querySelector('.company-name').textContent;

    let results = await getCompanyReviews(currentCompany, appState.currentPage, appState.currentPage, appState.filter, appState.sort);

    renderReviewsV2(results.items);
})