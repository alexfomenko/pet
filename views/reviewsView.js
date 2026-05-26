// import "./views/reviewsView.js";
import "../api/reviewsApi.js";
import "../components/reviewButton.js";
import "../components/sendReviewForm.js";
import "../components/newReviewRow.js";
import "../utils/utils.js";
import "../components/reviewRowActions.js";
import "../components/reviewsFilterBar.js";
import "../components/reviewsSortBar.js"

import {getReviews} from '../api/reviewsApi.js';
import {createNewRow} from "../components/newReviewRow.js";
// added as a try
import {renderPagination} from "../components/reviewsPagination.js";
// import {renderReviews} from "../utils/utils.js";
import {renderReviews} from "../components/newReviewRow.js";
import {populateFilterBar} from "../components/reviewsFilterBar.js";

// TODO SUBSTITUTE THIS VARIABLE WITH IMPORT FILE
export let appState = {
    filterByCompany: null,
    currentPage: 1,
    currentPageLimit: 5,
    sorting: null,
}


let reviewsContainer = document.getElementById("reviewsContainer");
let filterBar = document.getElementById('filterBar');
let sortBar = document.getElementById('sortBar');

let paginationEl = document.getElementById("paginationEl");
let currentPage = 1;


document.addEventListener('DOMContentLoaded', async () => {
    let response = await getReviews(appState.currentPage, appState.currentPageLimit);
    let reviews = response.items;

    let responseByPage = await getReviews(1, 100);
    let reviewsByPage = responseByPage.items;

    renderReviews(reviews);

    await populateFilterBar();

    // setPaginationData(response.page, response.totalPages, renderReviews);

    renderPagination(appState.currentPage, response.totalPages);

})





