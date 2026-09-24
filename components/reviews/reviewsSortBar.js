import {getReviews} from "../../api/reviewsApi.js";
import {renderReviews} from "./newReviewRow.js";
import {reviewsAppState} from "./reviewsAppState.js";
import {updatePagination} from "../common/pagination.js";


let sortBar = document.getElementById('sortBar');
let reviewsContainer = document.getElementById("reviewsContainer");


// sorting on backend
sortBar.addEventListener('change', async (e) => {
    let target = e.target.value;
    console.log(target)
    reviewsContainer.innerHTML = "";

    reviewsAppState.currentPage = 1;
    reviewsAppState.sorting = target;

    let response = await getReviews(reviewsAppState.currentPage, reviewsAppState.currentPageLimit, reviewsAppState.filterByCompany, reviewsAppState.sorting);
    let reviews = response.items;
    let totalPages = response.totalPages;

    renderReviews(reviews);
    updatePagination(reviewsAppState.currentPage, totalPages);
})
