// import "./views/reviewsView.js";
import "../api/reviewsApi.js";
import "../components/reviews/reviewButton.js";
import "../components/reviews/sendReviewForm.js";
import "../components/reviews/newReviewRow.js";
import "../utils/utils.js";
import "../components/reviews/reviewRowActions.js";
import "../components/reviews/reviewsFilterBar.js";
import "../components/reviews/reviewsSortBar.js"
import "../components/reviews/reviewsSearchBar.js"
import "../components/reviews/reviewsAppState.js"

import {getReviews} from '../api/reviewsApi.js';
import {createNewRow} from "../components/reviews/newReviewRow.js";
// added as a try
import {renderPagination} from "../components/reviews/reviewsPagination.js";
// import {renderReviews} from "../utils/utils.js";
import {renderReviews} from "../components/reviews/newReviewRow.js";
import {populateFilterBar} from "../components/reviews/reviewsFilterBar.js";
import {reviewsAppState} from "../components/reviews/reviewsAppState.js";
import "../components/reviews/logOut.js"
import {renderAuthNav} from "../components/common/authNav.js";
// export let companyReviewsState = {
//     filterByCompany: null,
//     currentPage: 1,
//     currentPageLimit: 5,
//     sorting: null,
//     search: null,
// }


let reviewsContainer = document.getElementById("reviewsContainer");
let filterBar = document.getElementById('filterBar');
let sortBar = document.getElementById('sortBar');

let paginationEl = document.getElementById("paginationEl");
let currentPage = 1;


document.addEventListener('DOMContentLoaded', async () => {
    renderAuthNav();
    let response = await getReviews(reviewsAppState.currentPage, reviewsAppState.currentPageLimit);
    let reviews = response.items;

    let responseByPage = await getReviews(1, 100);
    let reviewsByPage = responseByPage.items;

    renderReviews(reviews);

    await populateFilterBar();

    // setPaginationData(response.page, response.totalPages, renderReviews);

    renderPagination(reviewsAppState.currentPage, response.totalPages);

})





