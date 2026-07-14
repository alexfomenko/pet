import {getCompanyReviews} from "../../api/companyApi.js";
import {companyReviewsState} from "./companyReviewsState.js";
import {renderReviewsV2} from "./companyReviewAricle.js";

let sortBar = document.querySelector('[name="timeFilter"]');
let reviewContainer = document.querySelector(".content-reviews");

sortBar.addEventListener('change', async (e) => {
    let selectedSorting = e.target.value;
    reviewContainer.innerHTML = "";

    companyReviewsState.sort = selectedSorting;
    companyReviewsState.currentPage = 1;

    let currentCompany = document.querySelector('.company-name').textContent;

    let results = await getCompanyReviews(currentCompany, companyReviewsState.currentPage, companyReviewsState.currentPage, companyReviewsState.filter, companyReviewsState.sort);

    renderReviewsV2(results.items);
})