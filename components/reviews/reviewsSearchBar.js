import {getReviews} from "../../api/reviewsApi.js";
import {renderReviews} from "./newReviewRow.js";
// import {renderPagination} from "./reviewsPagination.js";
import {renderPagination} from "../common/pagination.js";
import {reviewsAppState} from "./reviewsAppState.js";

let searchBar = document.getElementById('searchBar');
let saveTimeOut;
searchBar.addEventListener('input', async(e) => {
    let sendRequest;
    reviewsAppState.search = e.target.value;
    reviewsAppState.currentPage = 1;
    clearTimeout(saveTimeOut);
    saveTimeOut = setTimeout(async (e)=> {
        sendRequest = await getReviews(reviewsAppState.currentPage, reviewsAppState.currentPageLimit, reviewsAppState.filterByCompany, reviewsAppState.sorting, reviewsAppState.search );
        renderReviews(sendRequest.items);

        renderPagination(reviewsAppState.currentPage, sendRequest.totalPages); //todo
    }, 300);
})