import {getReviews} from "../api/reviewsApi.js";
import {renderReviews} from "./newReviewRow.js";
import {appState} from "../views/reviewsView.js";
import {renderPagination, updatePaginationUi} from "./reviewsPagination.js";

let reviewsContainer = document.getElementById("reviewsContainer");
let filterBar = document.getElementById('filterBar');


// populate filter bar on DOM content loaded
export function populateFilterBar(reviews) {
    filterBar.innerHTML = "";

    let noFilter = document.createElement('option');
    noFilter.value = "";
    noFilter.textContent = "All companies";
    filterBar.append(noFilter);

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

// need to remove this handler as filtering from front end as it is time-consuming to do it there and should be on backend instead
// filterBar.addEventListener("change", async (e) => {
//     // console.log("hi");
//     let selected = e.target.value;
//     reviewsContainer.innerHTML = "";
//
//     let response = await getReviews(1, 100);
//     let reviews = response.items;
//
//     let filteredReviews = reviews.filter((review) => review.company === selected);
//     // filteredReviews
//     //     .forEach((review) => {
//     //     let newRow = createNewRow(review.id, review.company, review.rating, review.review, review.date);
//     //     reviewsContainer.appendChild(newRow);
//     // })
//     renderReviews(filteredReviews);
// })

filterBar.addEventListener("change", async (e) => {
    // console.log("hi");
    let selectedCompany = e.target.value;
    reviewsContainer.innerHTML = "";

    //updating app state
    appState.filterByCompany = selectedCompany;
    appState.currentPage = 1;

    let response = await getReviews(1, appState.currentPageLimit, selectedCompany); // updated
    let totalPages = response.totalPages;
    let reviews = response.items;

    renderReviews(reviews);
    renderPagination(appState.currentPage, totalPages);
    updatePaginationUi(appState.currentPage, totalPages);
})

// мне нужно поставить страницу 1 и перевыделить кнопки

// когда ставится фильтр должна перерисовываться пагинация:
// 1 - ставится страница 1,
// 2 - меняется количество страниц
// 3 - меняется активность кнопок
// а пагинация должна помнить про фильтр-компанию, когда отправляет запрос в котором есть компания

// фильтербар сохраняет - фильтр-компанию и страницу текущую(1)
// пагинация - использует фильр-компанию и меняет текущую страницу на актуальную

// передавать компанию дальше в пагинацию
