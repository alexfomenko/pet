import {getReviews} from "../api/reviewsApi.js";
import {renderReviews} from "./newReviewRow.js";
import {appState} from "../views/reviewsView.js";


let paginationEl = document.getElementById("paginationEl");
// let prevButton;
// let nextButton;

// I need these global variables because I have:
// 1 - condition if(currentPage > 1 );
// 2 - all functions should save the same value of currentPage - loadPage and updatePaginationUi should both know what is current page
// let currentPage = 1;
let currentLimit = 5;
let totalPages = 1;
// let renderReviews = null;



// function renderPagination1(currentPage, totalPages) {
    // let currentPage = response.page;
    // let totalPages = response.totalPages;

// // creating previous button
//
//     let prevButton = document.createElement('button');
//     prevButton.textContent = '←';
//     prevButton.disabled = currentPage === 1;
//     paginationEl.appendChild(prevButton);
//
// // creating numbered buttons
//     for (let i = 1; i <= totalPages; i++) {
//         let button = document.createElement('button');
//         button.textContent = i;
//         button.classList.add('page-btn');
//         paginationEl.appendChild(button);
//         if (i === currentPage) button.classList.add('active');
//
//         button.addEventListener('click', async(e) => {
//             let target = e.target;
//             currentPage = i;
//             let response = await getReviews(i, 1);
//             renderReviews(response.items);
//
//             removeActivePagButtonClass();
//
//             target.classList.add('active');
//
//             prevButton.disabled = currentPage === 1;
//             nextButton.disabled = currentPage === totalPages;
//         })
//     }
//
// // creating next button
//
//     let nextButton = document.createElement('button');
//     nextButton.textContent = '→';
//     nextButton.disabled = currentPage >= totalPages;
//     paginationEl.appendChild(nextButton);

// adding event listeners

    // prevButton.addEventListener('click', async(e) => {
    //     currentPage = currentPage - 1;

    //     let response = await getReviews(currentPage, 1);
    //     renderReviews(response.items);
    //
    //     prevButton.disabled = currentPage === 1;
    //
    //     updatePaginationUi(prevButton, nextButton, currentPage, totalPages);
    // })

    // nextButton.addEventListener('click', async(e) => {
    //     currentPage = currentPage + 1;

    //     let response = await getReviews(currentPage, 1);
    //     renderReviews(response.items);
    //
    //     updatePaginationUi(prevButton, nextButton, currentPage, totalPages);
    // })
// }

// 2
// export function setPaginationData(page, pages) {
//     currentPage = page;
//     totalPages = pages;
//     // renderReviews = renderer;
//     renderPagination();
// }

// 1 create pagination ui
export function renderPagination(page, pages) {
    // currentPage = page;
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

//         button.addEventListener('click', async(e) => {
//             let target = e.target;
//             currentPage = i;
//             let response = await getReviews(i, 1);
//             renderReviews(response.items);
// // ????????????????????????????????????????????
//             removeActivePagButtonClass();
//
//             target.classList.add('active');
//
//             prevButton.disabled = currentPage === 1;
//             nextButton.disabled = currentPage === totalPages;
//         })
    }

    // creating next button
    let nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.classList.add('next-btn');
    nextButton.disabled = page >= totalPages;
    paginationEl.appendChild(nextButton);

    // updatePaginationUi(prevButton, nextButton, currentPage, totalPages)
}

// 3 delegating events
paginationEl.addEventListener('click', async(e) => {
    if(e.target.classList.contains("page-btn")) {
        let pageNum = Number(e.target.dataset.page);
        appState.currentPage = pageNum; // added
        await loadPage();
        // updatePaginationUi(prevButton, nextButton, currentPage, totalPages);
        }

    if(e.target.classList.contains("prev-btn")) {
        // if(currentPage > 1 ) await loadPage(currentPage - 1);
        if(appState.currentPage > 1 ) {
            appState.currentPage -= 1;
            await loadPage(); // added
        }
        // prevButton.disabled = currentPage === 1;
        // updatePaginationUi(prevButton, nextButton, currentPage, totalPages);
    }

    if(e.target.classList.contains("next-btn")) {
        // if(currentPage < totalPages) await loadPage(currentPage + 1);
        if(appState.currentPage < totalPages) {
            appState.currentPage += 1;
            await loadPage();
        }
        // updatePaginationUi(prevButton, nextButton, currentPage, totalPages);
    }
})

// 4 sending get request when clicking pagination button
async function loadPage() {
    // appState.currentPage = pageNumber;
    let response = await getReviews(appState.currentPage, appState.currentPageLimit, appState.filterByCompany);
    totalPages = response.totalPages;

    renderReviews(response.items);
    updatePaginationUi(appState.currentPage, totalPages);
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