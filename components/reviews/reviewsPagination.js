import {getReviews} from "../../api/reviewsApi.js";
import {renderReviews} from "./newReviewRow.js";
import {reviewsAppState} from "./reviewsAppState.js";


let paginationEl = document.getElementById("paginationEl");
let totalPages = 1;

// 1 create pagination ui
export function renderPagination(page, pages) {
    totalPages = pages;
    paginationEl.innerHTML = "";

    // creating previous button
    let prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.classList.add('prev-btn');
    prevButton.disabled = page === 1;
    paginationEl.appendChild(prevButton);

    // creating numbered buttons
    for (let i = 1; i <= totalPages; i++) {
        let button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-btn');
        button.dataset.page = String(i);
        paginationEl.appendChild(button);
        if (i === page) button.classList.add('active');

    }

    // creating next button
    let nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.classList.add('next-btn');
    nextButton.disabled = page >= totalPages;
    paginationEl.appendChild(nextButton);

}

// 3 delegating events
paginationEl.addEventListener('click', async(e) => {
    if(e.target.classList.contains("page-btn")) {
        let pageNum = Number(e.target.dataset.page);
        reviewsAppState.currentPage = pageNum;
        await loadPage();
        }

    if(e.target.classList.contains("prev-btn")) {
        if(reviewsAppState.currentPage > 1 ) {
            reviewsAppState.currentPage -= 1;
            await loadPage();
        }
    }

    if(e.target.classList.contains("next-btn")) {
        if(reviewsAppState.currentPage < totalPages) {
            reviewsAppState.currentPage += 1;
            await loadPage();
        }
    }
})

// 4 sending get request when clicking pagination button
async function loadPage() {
    let response = await getReviews(reviewsAppState.currentPage, reviewsAppState.currentPageLimit, reviewsAppState.filterByCompany, reviewsAppState.sorting);
    totalPages = response.totalPages;

    renderReviews(response.items);
    updatePaginationUi(reviewsAppState.currentPage, totalPages);
}

// 5 update pagination ui - remove color from disabled buttons and add it to the active button
export function updatePaginationUi(currentPage, totalPages) {

    // remove active class from all buttons
    document.querySelectorAll('.page-btn').forEach((btn) => {
        btn.classList.remove('active');
    });

    //find currently active button
    let activeButton = Array.from(document.querySelectorAll('.page-btn'))
        .find((btn) => btn.textContent === String(currentPage));

    if (activeButton) activeButton.classList.add('active');

    //determine conditions when previous and next buttons are disabled
    let prevButton = document.querySelector('.prev-btn');
    let nextButton = document.querySelector('.next-btn');
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}
