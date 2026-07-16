export function renderCompanyAbout(companyData) {
    document.querySelector(".company-name").textContent = companyData.name || " ";
    document.querySelector(".company-logo").textContent = companyData.name || " ";
    document.querySelector(".location").textContent = companyData.location || " ";
    document.querySelector(".employee-number").textContent = companyData.employees || " ";
    document.querySelector(".company-about .review-text").textContent = companyData.description || " ";
    document.querySelector(".work-format-value").textContent = companyData.workFormat || " ";
    document.querySelector(".languages-value").textContent = companyData.languages || " ";
    document.querySelector(".avg-interview-time-value").textContent = companyData.avgInterviewTime || " ";

    const params = new URLSearchParams(window.location.search);
    const company = params.get('company');

    // const reviewsTab = document.querySelector('.tab');
    // reviewsTab.href = `/html/companyReviews?company=${encodeURIComponent(company)}`;

    document.querySelector('.tab-reviews').href = `/html/companyReviews?company=${encodeURIComponent(company)}`;
}
