import {getReviews} from "../../api/reviewsApi.js";
import {renderReviews} from "./newReviewRow.js";
import {reviewsAppState} from "./reviewsAppState.js";
import {getAllCompanies} from "../../api/reviewsApi.js";
import {renderPagination, updatePagination} from "../common/pagination.js";

let reviewsContainer = document.getElementById("reviewsContainer");
let filterBar = document.getElementById('filterBar');


export async function populateFilterBar() {
    filterBar.innerHTML = "";
    //create first allCompanies option
    let noFilter = document.createElement('option');
    noFilter.value = "";
    noFilter.textContent = "All companies";
    filterBar.append(noFilter);

    //send request to getAllCompanies
    let getAllCompaniesRequest = await getAllCompanies();
    let allCompanies = getAllCompaniesRequest.items;

    //create options for allCompanies
    allCompanies.forEach((company) => {
        let option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        filterBar.append(option);
    })
}

filterBar.addEventListener("change", async (e) => {
    let selectedCompany = e.target.value;
    reviewsContainer.innerHTML = "";

    //updating app state
    reviewsAppState.filterByCompany = selectedCompany;
    reviewsAppState.currentPage = 1;

    let response = await getReviews(1, reviewsAppState.currentPageLimit, selectedCompany); // updated
    let totalPages = response.totalPages;
    let reviews = response.items;

    renderReviews(reviews);
    renderPagination(reviewsAppState.currentPage, totalPages);
    updatePagination(reviewsAppState.currentPage, totalPages);

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
