import { getReviews } from "../../api/reviewsApi.js";
import { renderReviews } from "../reviews/newReviewRow.js";
import { reviewsAppState } from "../reviews/reviewsAppState.js";
import {renderCompanyReviews} from "../company/companyReviewAricle.js";
import {getCompanyReviews} from "../../api/companyApi.js";
import {companyReviewsState} from "../company/companyReviewsState.js";


const paginationEl = document.getElementById("paginationEl");

let totalPages = 1;
const dots_jump = 5;

function getPaginationItems(currentPage, totalPages) {
    // console.log(currentPage)
    if(totalPages <= 7) return createPageRange(1, totalPages); // [1, 2, 3, 4, 5]

    if(currentPage <= 4) return [1, 2, 3, 4, 5, "right_dots", totalPages];//1 2 3 4 5 … 20 user is close to beginning

    if(currentPage >= totalPages - 3) return [1, "left_dots", totalPages - 4, totalPages - 3, totalPages - 2, totalPages -1, totalPages];//[1, "left-dots", 16, 17, 18, 19, 20] user is close to end

    return [1, "left_dots", currentPage -1, currentPage, currentPage + 1, "right_dots", totalPages]; // user is somewhere in the middle
}

//create page range [1, 2, 3, 4, 5]
function createPageRange(startPage, endPage) {
    let pages = [];
    for(let page = startPage; page<= endPage; page++){
        pages.push(page);
    }
    return pages;
}

export function renderPagination(currentPage, totalPages) {
    totalPages = Number(totalPages);
    paginationEl.innerHTML = "";

    if(totalPages === 0) return; //if there are no reviews server will return 0 pages > we don't need pagination

    // create prevButton
    let prevButton = document.createElement('button');
    prevButton.type = "button";
    prevButton.textContent = "←";
    prevButton.classList.add('page-btn', 'prev-btn');
    prevButton.setAttribute('aria-label', "Previous page");
    prevButton.disabled = currentPage === 1; // prevButton disabled if its page 1
    paginationEl.appendChild(prevButton);

    // getting array of elements that need to be shown
    let paginationItems = getPaginationItems(currentPage, totalPages);
    // console.log(currentPage)
    // console.log(paginationItems);

    paginationItems.forEach((item) => {
        // console.log(item);
        // console.log(typeof item)
        if(typeof item === "number") {
            let numberBtn = createNumberButton(item, currentPage);
            paginationEl.appendChild(numberBtn);
        }
        if(item === "left_dots") {
            let dotsBtn = createDotsButton(currentPage, totalPages, "left");
            paginationEl.appendChild(dotsBtn);
        }
        if(item === "right_dots") {
            let dotsBtn = createDotsButton(currentPage, totalPages, "right");
            paginationEl.appendChild(dotsBtn);
        }
    })

    //create nextBtn
    let nextButton = document.createElement('button');
    nextButton.type = "button";
    nextButton.textContent = "→";
    nextButton.classList.add("page-btn", "next-btn");
    nextButton.setAttribute('aria-label', "Next page");
    nextButton.disabled = currentPage === totalPages;
    paginationEl.appendChild(nextButton);
}

//determine what pagination elements should be seen

function createNumberButton(pageNumber, currentPage) {
    let button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(pageNumber);
    button.classList.add("page-btn");
    button.dataset.page = String(pageNumber);

    if(pageNumber === currentPage) button.classList.add('active'); button.setAttribute('aria-current', "page");

    return button;
}

function createDotsButton(currentPage, totalPages, direction) {
    let button = document.createElement('button');
    button.type = 'button';
    button.textContent = "...";
    button.classList.add("page-btn", "dots-btn");

    if(direction === "left") { //if page is 10, 10 - 5  = 5; it means left dots will lead to 5
        let targetPage = Math.max(1, currentPage - dots_jump);
        button.dataset.page  = String(targetPage);
        button.setAttribute('aria-label', `Go to page ${targetPage}`);
    }

    if(direction === "right") { //if page is 10, 10 + 5  = 15; it means right dots will lead to 15
        let targetPage = Math.min(totalPages, currentPage + dots_jump);
        button.dataset.page = String(targetPage);
        button.setAttribute("aria-label", `Go to page ${targetPage}`);
    }
    return button;
}

paginationEl.addEventListener('click', async(event) => {
    let clickedBtn = event.target.closest('button');
    if(!clickedBtn || !paginationEl.contains(clickedBtn)) return;

    if(clickedBtn.disabled) return; // не обрабатывать заблокированные стрелки

    let nextPage = reviewsAppState.currentPage; // assume the page doesn't change

    if (clickedBtn.classList.contains('prev-btn')) {
        nextPage = reviewsAppState.currentPage - 1;
    }
    if (clickedBtn.classList.contains('next-btn')) {
        nextPage = reviewsAppState.currentPage + 1;
    }
    else if (clickedBtn.dataset.page) {
        nextPage = Number(clickedBtn.dataset.page);
    }

    // console.log({ nextPage, totalPages });
    // nextPage = Math.max(1, Math.min(nextPage, totalPages)); //additional security: value !< 1 !>max
    // need to change current to export function renderPagination(page, pages) {
    //     totalPages = Number(pages);
    // in case I want this check so that the external let totalPages is updated and passed to the event listener
    // console.log(nextPage)
    if(nextPage === reviewsAppState.currentPage) return;

    reviewsAppState.currentPage = nextPage; // updating appState

    await loadPage(); // request reviews and update pagination
})

async function loadPage() {
    let response = await getReviews(reviewsAppState.currentPage,
        reviewsAppState.currentPageLimit,
        reviewsAppState.filterByCompany,
        reviewsAppState.sorting,
        reviewsAppState.search);

    if(!response.success) return console.log(response.text);
   totalPages = response.totalPages;

   renderReviews(response.items); // or renderCompanyReviews(result.items, result.reviewsTotalNumber);
   renderPagination(reviewsAppState.currentPage, totalPages);
}

// async function loadCompanyReviewsPage() {
//     let response = await getCompanyReviews(reviewsAppState.currentPage, //todo company
//         companyReviewsState.currentPageLimit,
//         companyReviewsState.currentPageLimit,
//         companyReviewsState.filter,
//         companyReviewsState.sort);
//
//     if(!response.success) return console.log(response.text);
//     totalPages = response.totalPages;
//
//     renderReviews(response.items); // or renderCompanyReviews(result.items, result.reviewsTotalNumber);
//     renderPagination(reviewsAppState.currentPage, totalPages);
// }

export function updatePagination(currentPage, totalPages) {
    renderPagination(currentPage, totalPages);
}
//
// export function renderPagination(currentPage, totalPages, onPageChange) {
//     totalPages = Number(totalPages);
//     paginationEl.innerHTML = "";
//
//     if(totalPages === 0) return; //if there are no reviews server will return 0 pages > we don't need pagination
//
//     // create prevButton
//     let prevButton = document.createElement('button');
//     prevButton.type = "button";
//     prevButton.textContent = "←";
//     prevButton.classList.add('page-btn', 'prev-btn');
//     prevButton.setAttribute('aria-label', "Previous page");
//     prevButton.disabled = currentPage === 1; // prevButton disabled if its page 1
//     paginationEl.appendChild(prevButton);
//
//     // getting array of elements that need to be shown
//     let paginationItems = getPaginationItems(currentPage, totalPages);
//     // console.log(currentPage)
//     // console.log(paginationItems);
//
//     paginationItems.forEach((item) => {
//         // console.log(item);
//         // console.log(typeof item)
//         if(typeof item === "number") {
//             let numberBtn = createNumberButton(item, currentPage);
//             paginationEl.appendChild(numberBtn);
//         }
//         if(item === "left_dots") {
//             let dotsBtn = createDotsButton(currentPage, totalPages, "left");
//             paginationEl.appendChild(dotsBtn);
//         }
//         if(item === "right_dots") {
//             let dotsBtn = createDotsButton(currentPage, totalPages, "right");
//             paginationEl.appendChild(dotsBtn);
//         }
//     })
//
//     //create nextBtn
//     let nextButton = document.createElement('button');
//     nextButton.type = "button";
//     nextButton.textContent = "→";
//     nextButton.classList.add("page-btn", "next-btn");
//     nextButton.setAttribute('aria-label', "Next page");
//     nextButton.disabled = currentPage === totalPages;
//     paginationEl.appendChild(nextButton);
//
//     //event listener
//     paginationEl.addEventListener('click', async(event) => {
//         let clickedBtn = event.target.closest('button');
//         if(!clickedBtn || !paginationEl.contains(clickedBtn)) return;
//
//         if(clickedBtn.disabled) return; // не обрабатывать заблокированные стрелки
//
//         let nextPage = reviewsAppState.currentPage; // assume the page doesn't change
//
//         if (clickedBtn.classList.contains('prev-btn')) {
//             nextPage = reviewsAppState.currentPage - 1;
//         }
//         if (clickedBtn.classList.contains('next-btn')) {
//             nextPage = reviewsAppState.currentPage + 1;
//         }
//         else if (clickedBtn.dataset.page) {
//             nextPage = Number(clickedBtn.dataset.page);
//         }
//
//         // console.log({ nextPage, totalPages });
//         // nextPage = Math.max(1, Math.min(nextPage, totalPages)); //additional security: value !< 1 !>max
//         // need to change current to export function renderPagination(page, pages) {
//         //     totalPages = Number(pages);
//         // in case I want this check so that the external let totalPages is updated and passed to the event listener
//         // console.log(nextPage)
//         if(nextPage === reviewsAppState.currentPage) return;
//
//         reviewsAppState.currentPage = nextPage; // updating appState
//
//         await onPageChange(); // request reviews and update pagination
//     })
// }