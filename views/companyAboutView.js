import {getCompanyReviews} from "../api/companyApi.js";
import {companyReviewsState} from "../components/company/companyReviewsState.js";
import {renderReviewsV2} from "../components/company/companyReviewAricle.js";
import {showGradeRows} from "../components/company/companyGradeCard.js";
import "../components/company/companyReviewForm.js"
import "../components/company/companyReviewsFilterBar.js"
import "../components/company/companyReviewsSortBar.js"
import {getCompanyAboutData} from "../api/companyApi.js";
import {renderCompanyAbout} from "../components/company/companyAboutRender.js";

document.addEventListener("DOMContentLoaded", async () => {
    let params = new URLSearchParams(location.search);
    let company = params.get('company');

    if (!company) {
        document.querySelector(".company-name").textContent = "Company not selected";
        document.querySelector(".company-logo").textContent = " ";
        document.querySelector(".company-about .review-text").textContent = "Please select a company from reviews.";
        renderReviewsV2([]);
        return;
    }

    let companyData = await getCompanyAboutData(company);
    if(companyData.status === 404) {
        document.querySelector(".company-name").textContent = company;
        document.querySelector(".company-logo").textContent = company;
        document.querySelector(".company-about .review-text").textContent = "Company not registered";
    }
    else{
        renderCompanyAbout(companyData);
    }

    let companyReviews = await getCompanyReviews(company, companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort);
    renderReviewsV2(companyReviews.items);

    await showGradeRows(company);
})