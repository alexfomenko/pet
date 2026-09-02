import {getCompanyReviews} from "../../api/companyApi.js";
import {companyReviewsState} from "./companyReviewsState.js";
import {renderCompanyReviews} from "./companyReviewAricle.js";
import {loadCompanyReviewsPage, updatePagination} from "../common/pagination.js";

let sortBar = document.querySelector('[name="timeFilter"]');
let reviewContainer = document.querySelector(".content-reviews");

sortBar.addEventListener('change', async (e) => {
    let selectedSorting = e.target.value;
    reviewContainer.innerHTML = "";

    companyReviewsState.sort = selectedSorting;
    companyReviewsState.currentPage = 1;

    let company = document.querySelector('.company-name').textContent;

    console.log(company, companyReviewsState.currentPage, companyReviewsState.currentPage, companyReviewsState.filter, companyReviewsState.sort)

    let result = await getCompanyReviews(company, companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort);

    renderCompanyReviews(result.items);
    updatePagination(companyReviewsState.currentPage, result.pagesTotalNumber, loadCompanyReviewsPage.bind(null, company), companyReviewsState);
})