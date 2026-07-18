export function renderCompanyHeader(companyData = {}) {
    const params = new URLSearchParams(window.location.search);
    const company = params.get('company') || "";

    const companyName = companyData.name || company || " ";

    // document.querySelector('.tab-reviews').href =
    //     `/html/companyReviews?company=${encodeURIComponent(company)}`;

    document.querySelector('.tab-about').href =
        `/html/companyAbout?company=${encodeURIComponent(company)}`;

    document.querySelectorAll('.js-company-reviews-link').forEach((link) => {
        link.href =  `/html/companyReviews?company=${encodeURIComponent(company)}`;
    })

    document.querySelector(".company-name").textContent = companyName;
    document.querySelector(".company-logo").textContent = companyName;
}
export function renderCompanyAbout(companyData) {
    renderCompanyHeader(companyData);
    document.querySelector(".location").textContent = companyData.location || " ";
    document.querySelector(".employee-number").textContent = companyData.employees || " ";
    document.querySelector(".company-about .review-text").textContent = companyData.description || " ";
    document.querySelector(".work-format-value").textContent = companyData.workFormat || " ";
    document.querySelector(".languages-value").textContent = companyData.languages || " ";
    document.querySelector(".avg-interview-time-value").textContent = companyData.avgInterviewTime || " ";
}