// import "./views/reviewsView.js";
import "../api/api.js";
import "../components/button.js";
import "../components/form.js";
import "../components/newReviewItem.js";
import "../utils/utils.js";
import "../components/reviewsTable.js";

import {getReviews} from '../api/api.js';
import {createNewRow} from "../components/newReviewItem.js";
// added as a try
import {setPaginationData} from "../components/pagination.js";

let reviewsContainer = document.getElementById("reviewsContainer");
let filterBar = document.getElementById('filterBar');
let sortBar = document.getElementById('sortBar');

let paginationEl = document.getElementById("paginationEl");
let currentPage = 1;


document.addEventListener('DOMContentLoaded', async () => {
    let response = await getReviews(1, 1);
    let reviews = response.items;
    let currentPage = response.page;
    let totalPages = response.totalPages;

    renderReviews(reviews);

    populateFilterBar(reviews);

// added as a try added one string

    setPaginationData(response.page, response.totalPages, renderReviews);

    // renderPagination(response.page, response.totalPages);

//     // previous button
//     let prevButton = document.createElement('button');
//     prevButton.textContent = '←';
//     prevButton.disabled = currentPage === 1;
//     paginationEl.appendChild(prevButton);
//
//     // numbered buttons
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
//             document.querySelectorAll('.pagination .page-btn').forEach((btn) => {
//                 if (btn.classList.contains('active') && btn !== target) {
//                     btn.classList.remove('active');
//                 }
//             })
//
//             target.classList.add('active');
//             prevButton.disabled = currentPage === 1;
//             nextButton.disabled = currentPage === totalPages;
//         })
//     }
//
//     // next button
//     let nextButton = document.createElement('button');
//     nextButton.textContent = '→';
//     nextButton.disabled = currentPage >= totalPages;
//     paginationEl.appendChild(nextButton);
//
//     prevButton.addEventListener('click', async(e) => {
//         currentPage = currentPage - 1;
//         let response = await getReviews(currentPage, 1);
//         renderReviews(response.items);
//         prevButton.disabled = currentPage === 1;
//
//         document.querySelectorAll('.pagination .page-btn').forEach((btn) => {
//             btn.classList.remove('active');
//         })
//
//         let activeButton = Array.from(document.querySelectorAll('.pagination .page-btn'))
//             .find((btn) => btn.textContent === String(currentPage));
//         if (activeButton) {
//             activeButton.classList.add('active');
//         }
//
//         prevButton.disabled = currentPage === 1;
//         nextButton.disabled = currentPage === totalPages;
//     })
//
//     nextButton.addEventListener('click', async(e) => {
//         currentPage = currentPage + 1;
//         let response = await getReviews(currentPage, 1);
//         renderReviews(response.items);
//
//          document.querySelectorAll('.pagination .page-btn').forEach((btn) => {
//              btn.classList.remove('active');
//          })
//
//         let activeButton = Array.from(document.querySelectorAll('.pagination .page-btn'))
//             .find((btn) => btn.textContent === String(currentPage));
//
//         if (activeButton) {
//             activeButton.classList.add('active');
//         }
//         prevButton.disabled = currentPage === 1;
//         nextButton.disabled = currentPage === totalPages;
//
//     })
})

filterBar.addEventListener("change", async (e) => {
    let selected = e.target.value;
    reviewsContainer.innerHTML = "";
    let response = await getReviews();
    let reviews = response.items;
    let filteredReviews = reviews.filter((review1) => review1.company === selected);
    // filteredReviews
    //     .forEach((review) => {
    //     let newRow = createNewRow(review.id, review.company, review.rating, review.review, review.date);
    //     reviewsContainer.appendChild(newRow);
    // })
    renderReviews(filteredReviews);
})

sortBar.addEventListener('change', async (e) => {
    let target = e.target.value;
    reviewsContainer.innerHTML = "";

    let response = await getReviews();
    let reviews = response.items;

    let sortedReviews = [];
    if(target === "date_new_to_old") {
        sortedReviews = reviews.sort((review1, review2) => new Date(review2.date) - new Date(review1.date));
        // sortedNewToOld
        //     .forEach((review) => {
        //     let newRow = createNewRow(review.id, review.company, review.rating, review.review, review.date);
        //     reviewsContainer.appendChild(newRow);
        // })
        // renderReviews(sortedArray);
    }
    else if(target === "date_old_to_new") {
        sortedReviews = reviews.sort((review1, review2) => new Date(review1.date) - new Date(review2.date));
    }
    else if(target === "rating_low_to_high") {
        sortedReviews = reviews.sort((review1, review2) => review1.rating - review2.rating);
    }
    else if(target === "rating_high_to_low") {
        sortedReviews = reviews.sort((review1, review2) => review2.rating - review1.rating);
    }
    renderReviews(sortedReviews);
})

export function renderReviews(reviewsArray) {
    reviewsContainer.innerHTML = "";
    reviewsArray.forEach((review) => {
        let newRow = createNewRow(review.id, review.company, review.rating, review.review, review.date);
        reviewsContainer.appendChild(newRow);
    })
}

export function populateFilterBar(reviews) {
    filterBar.innerHTML = "";

    //filling out the filterBar
    // let options = Array.from(filterBar.options).map(option => option.value);
    // const existing = new Set(Array.from(filterBar.options).map(opt => opt.value));
    for (let review of reviews) {
        let options = Array.from(filterBar.options).map(option => option.value);
        if(!options.includes(review.company)) {
            // if (!existing.has(review.company)) {
            let option = document.createElement('option');
            option.value = review.company;
            option.textContent = review.company;
            filterBar.append(option);
        }
    }
}




