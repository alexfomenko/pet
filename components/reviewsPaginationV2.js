import {getCompanyReviews} from "../api/reviewsApiV2.js";
import {appState} from "../appState.js";

let pagination = document.querySelector('.pagination');
 export async function renderPagination(company) {
    pagination.innerHTML = "";

    let request = await getCompanyReviews(company, appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort);
    let totalPages = request.pagesTotalNumber;

    let prevButton = document.createElement('button');
     prevButton.classList.add(); // TODO
     prevButton.textContent = '←';
    // prevButton.disabled = page === 1; TODO
    pagination.appendChild(prevButton);

     for(let i = 1; i <= totalPages; i++) { //TODO
         let numberedButton = document.createElement('button');
         numberedButton.classList.add(); //TODO
         numberedButton.textContent = i;
         console.log(numberedButton.textContent)
         pagination.appendChild(numberedButton);
         if(i === appState.currentPage) numberedButton.classList.add(); //TODO
     }

    let nextButton = document.createElement('button');
     nextButton.classList.add(); // TODO
     nextButton.textContent = '→';
    // nextButton.disabled = appState.currentPage == totalPages; TODO
    pagination.appendChild(nextButton);
}