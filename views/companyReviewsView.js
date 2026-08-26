import {companyReviewsState} from "../components/company/companyReviewsState.js";
import "../components/company/companyReviewsFilterBar.js";
import {renderCompanyReviews} from "../components/company/companyReviewAricle.js";
import "../components/company/companyReviewsSortBar.js";
import {getCompanyReviews} from "../api/companyApi.js";
import {showGradeRows} from "../components/company/companyGradeCard.js";
// import "../components/company/companyReviewsPagination.js";
// import {renderPaginationV2} from "../components/company/companyReviewsPagination.js";
import "../components/company/companyReviewForm.js"
import {renderCompanyHeader} from "../components/company/companyAboutRender.js";
import {renderAuthNav} from "../components/common/authNav.js";
import {renderPagination} from "../components/common/pagination.js";
import {reviewsAppState} from "../components/reviews/reviewsAppState.js";

document.addEventListener("DOMContentLoaded", async ()=> {
    // console.log('hi');
    renderAuthNav();

    //showing header data
    renderCompanyHeader();

    const params = new URLSearchParams(window.location.search);
    const company = params.get('company') || "";

    //showing all articles
    let result = await getCompanyReviews(company, companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort);
    console.log(result)
    renderCompanyReviews(result.items, result.reviewsTotalNumber);

    //showing all grades
    await showGradeRows(company);

    //show pagination
    // await renderPaginationV2(company);
    renderPagination(companyReviewsState.currentPage, result.pagesTotalNumber );
    // renderPagination(companyReviewsState.currentPage, result.pagesTotalNumber, loadCompanyReviewsPage);

})

