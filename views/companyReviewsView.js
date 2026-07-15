import {companyReviewsState} from "../components/company/companyReviewsState.js";
import "../components/company/companyReviewsFilterBar.js";
import {renderReviewsV2} from "../components/company/companyReviewAricle.js";
import "../components/company/companyReviewsSortBar.js";
import {getCompanyReviews} from "../api/companyApi.js";
import {showGradeRows} from "../components/company/companyGradeCard.js";
import "../components/company/companyReviewsPagination.js";
import {renderPaginationV2} from "../components/company/companyReviewsPagination.js";
import "../components/company/companyReviewForm.js"

document.addEventListener("DOMContentLoaded", async ()=> {
    // console.log('hi');
    let company = document.querySelector('.company-name').textContent;

    //showing all articles
    let results = await getCompanyReviews(company, companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort);
    console.log(results)
    renderReviewsV2(results.items, results.reviewsTotalNumber);

    //showing all grades
    await showGradeRows(company);

    //show pagination
    await renderPaginationV2(company);
})

