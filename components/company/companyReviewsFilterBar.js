import {companyReviewsState} from "./companyReviewsState.js";
import {getCompanyReviews} from "../../api/companyApi.js";
import {renderCompanyReviews} from "./companyReviewAricle.js";
import {loadCompanyReviewsPage, updatePagination} from "../common/pagination.js";

let filterBar = document.querySelector('[name="gradeFilter"]');
let reviewContainer = document.querySelector(".content-reviews");

filterBar.addEventListener('change', async(e) => {
    let selectedRating = e.target.value;
    reviewContainer.innerHTML = "";

    companyReviewsState.filter = selectedRating;
    companyReviewsState.currentPage = 1;

    let company = document.querySelector('.company-name').textContent;

    let result = await getCompanyReviews(company, companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort); //new endpoint create

    console.log(result.items);

    renderCompanyReviews(result.items);

    updatePagination(companyReviewsState.currentPage, result.pagesTotalNumber, loadCompanyReviewsPage.bind(null, company), companyReviewsState);
})