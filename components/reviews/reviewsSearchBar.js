import {getReviews} from "../../api/reviewsApi.js";
import {appState} from "../../views/reviewsView.js";
import {renderReviews} from "./newReviewRow.js";
import {renderPagination} from "./reviewsPagination.js";

let searchBar = document.getElementById('searchBar');
let saveTimeOut;
searchBar.addEventListener('input', async(e) => {
    let sendRequest;
    appState.search = e.target.value;
    appState.currentPage = 1;
    clearTimeout(saveTimeOut);
    saveTimeOut = setTimeout(async (e)=> {
        sendRequest = await getReviews(appState.currentPage, appState.currentPageLimit, appState.filterByCompany, appState.sorting, appState.search );
        renderReviews(sendRequest.items);

        renderPagination(appState.currentPage, sendRequest.totalPages); //todo
    }, 300);
})