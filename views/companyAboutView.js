import {getCompanyReviews} from "../api/reviewsApiV2.js";
import {appState} from "../appState.js";
import {renderReviewsV2} from "../components/newReviewArticleV2.js";
import {showGradeRows} from "../components/gradeCardV2.js";
import "../components/reviewFormV2.js"
import "../components/reviewsFilterBarV2.js"
import "../components/reviewsSortBarV2.js"
import {getCompanyAboutData} from "../api/reviewsApiV2.js";

document.addEventListener("DOMContentLoaded", async () => {
    let params = new URLSearchParams(location.search);
    let company = params.get('company');

    let companyData = await getCompanyAboutData(company);
    document.querySelector(".company-name").textContent = companyData.name || " ";
    document.querySelector(".company-logo").textContent = companyData.name || " ";
    document.querySelector(".location").textContent = companyData.location || " ";
    document.querySelector(".employee-number").textContent = companyData.employees || " ";
    document.querySelector(".company-about .review-text").textContent = companyData.description || " ";
    document.querySelector(".work-format-value").textContent = companyData.workFormat || " ";
    document.querySelector(".languages-value").textContent = companyData.languages || " ";
    document.querySelector(".avg-interview-time-value").textContent = companyData.avgInterviewTime || " ";

    let companyReviews = await getCompanyReviews(company, appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort);
    renderReviewsV2(companyReviews.items);

    await showGradeRows(company);
})