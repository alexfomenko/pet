import "../api/reviewsApi.js";
import "../components/reviews/reviewButton.js";
import "../components/reviews/sendReviewForm.js";
import "../components/reviews/reviewRowActions.js";
import "../components/reviews/reviewsFilterBar.js";
import "../components/reviews/reviewsSortBar.js"
import "../components/reviews/reviewsSearchBar.js"
import {countChars} from "../components/common/countChars.js";

import {getReviews} from '../api/reviewsApi.js';
import {renderReviews} from "../components/reviews/newReviewRow.js";
import {populateFilterBar} from "../components/reviews/reviewsFilterBar.js";
import {reviewsAppState} from "../components/reviews/reviewsAppState.js";
import "../components/reviews/logOut.js"
import {renderAuthNav} from "../components/common/authNav.js";
import {renderPagination, loadReviewsPage} from "../components/common/pagination.js";


let field = document.querySelector('.char-count');
let counter = document.querySelector('.char-counter');

document.addEventListener('DOMContentLoaded', async () => {
    renderAuthNav();
    let response = await getReviews(reviewsAppState.currentPage, reviewsAppState.currentPageLimit);
    let reviews = response.items;

    renderReviews(reviews);

    await populateFilterBar();

    renderPagination(reviewsAppState.currentPage, response.totalPages, loadReviewsPage, reviewsAppState);

    countChars(field, counter);
})



