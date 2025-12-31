import {getReviews} from "../api/reviewsApi.js";
// import {renderReviews} from "../main"

let paginationEl = document.getElementById("paginationEl");
let prevButton;
let nextButton;

let currentPage = 1;
let totalPages = 1;
let renderReviews = null;



function renderPagination1(currentPage, totalPages) {
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

}

// 2
export function setPaginationData(page, pages, renderer) {
    currentPage = page;
    totalPages = pages;
    renderReviews = renderer;
    renderPagination();
}

// 1 create pagination ui
export function renderPagination() {
    // currentPage = page;
    // totalPages = pages;
    paginationEl.innerHTML = "";

    // creating previous button
    prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.classList.add('prev-btn');
    prevButton.disabled = currentPage === 1;
    paginationEl.appendChild(prevButton);

    // creating numbered buttons
    for (let i = 1; i <= totalPages; i++) {
        let button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-btn');
        button.dataset.page = String(i);
        paginationEl.appendChild(button);
        if (i === currentPage) button.classList.add('active');

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
    nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.classList.add('next-btn');
    nextButton.disabled = currentPage >= totalPages;
    paginationEl.appendChild(nextButton);

    // updatePaginationUi(prevButton, nextButton, currentPage, totalPages)
}

// 4 sending get request when clicking button
async function loadPage(page) {
    currentPage = page;
    let response = await getReviews(currentPage, 1);
    totalPages = response.totalPages;
    renderReviews(response.items);

    updatePaginationUi(prevButton, nextButton, currentPage, totalPages);
}

// 5 update pagination ui - remove color from disabled buttons and add it to the active button
function updatePaginationUi(prevButton, nextButton, currentPage, totalPages) {
    document.querySelectorAll('.page-btn').forEach((btn) => {
        btn.classList.remove('active');
    });

    let activeButton = Array.from(document.querySelectorAll('.page-btn'))
        .find((btn) => btn.textContent === String(currentPage));
    if (activeButton) {
        activeButton.classList.add('active');
    }
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// 3 delegating events

paginationEl.addEventListener('click', async(e) => {
    if(e.target.classList.contains("page-btn")) {
        let pageNum = Number(e.target.dataset.page)
            await loadPage(pageNum);
            // updatePaginationUi(prevButton, nextButton, currentPage, totalPages);
        }

    if(e.target.classList.contains("prev-btn")) {
        if(currentPage > 1 ) await loadPage(currentPage - 1);
        // prevButton.disabled = currentPage === 1;
        // updatePaginationUi(prevButton, nextButton, currentPage, totalPages);
    }

    if(e.target.classList.contains("next-btn")) {
        if(currentPage < totalPages) await loadPage(currentPage + 1);
        // updatePaginationUi(prevButton, nextButton, currentPage, totalPages);
    }
})

