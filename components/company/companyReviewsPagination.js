import {getCompanyReviews} from "../../api/companyApi.js";
import {appState} from "../../appState.js";
import {renderReviewsV2} from "./companyReviewAricle.js";

let pagination = document.querySelector('.pagination');

let company = document.querySelector('.company-name').textContent;
let totalPages;

 export async function renderPaginationV2(company) {
    pagination.innerHTML = "";

    let request = await getCompanyReviews(company, appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort);
    totalPages = request.pagesTotalNumber;

    let prevButton = document.createElement('button');
     prevButton.classList.add('prev-btn'); // TODO
     prevButton.textContent = '←';
     pagination.appendChild(prevButton);
     prevButton.disabled = appState.currentPage === 1;

     for(let i = 1; i <= totalPages; i++) {
         let numberedButton = document.createElement('button');
         numberedButton.classList.add('number-btn'); //TODO
         numberedButton.textContent = String(i);
         // console.log(numberedButton.textContent)
         pagination.appendChild(numberedButton);
         if(i === appState.currentPage) numberedButton.classList.add('btn-active'); //TODO
     }

    let nextButton = document.createElement('button');
     nextButton.classList.add('next-btn'); // TODO
     nextButton.textContent = '→';
     pagination.appendChild(nextButton);
     nextButton.disabled = appState.currentPage === totalPages;
 }

pagination.addEventListener('click', async(e) => {
    let prevButton = document.querySelector('.prev-btn');
    let nextButton = document.querySelector('.next-btn');

    let target = e.target;
    if(target.classList.contains('prev-btn')) {
        if(appState.currentPage > 1) {
            appState.currentPage = appState.currentPage - 1;
            // //1 - change app variables
            // appState.currentPage = appState.currentPage - 1;
            // //2 - send request and render new articles
            // let response = await getCompanyReviews(company,appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort );
            // renderReviewsV2(response.items);
            //
            // //3 - check enabled/disabled buttons
            // prevButton.disabled = appState.currentPage === 1;
            // nextButton.disabled = appState.currentPage === totalPages;
            //
            // //4 - change active buttons
            // let numberedButtons = document.querySelectorAll('.number-btn');
            // numberedButtons.forEach((button) => {
            //     button.classList.remove('btn-active');
            // })
            //
            // numberedButtons.forEach((button) => {
            //     if(Number(button.textContent) === appState.currentPage) {
            //         button.classList.add('btn-active');
            //     }
            // })

            //INSTEAD OF DUPLICATE CODE THESE TWO FUNCTIONS

            await getReviews();
            updatePagination();
        }
    }
    if(target.classList.contains('next-btn')) {
        if(appState.currentPage < totalPages) {
            appState.currentPage = appState.currentPage + 1;

            await getReviews();
            updatePagination();
        }
    }
    if(target.classList.contains('number-btn')) {
        let pageNumber = Number(e.target.textContent);
        // console.log(pageNumber);
        appState.currentPage = pageNumber;

        await getReviews();
        updatePagination();
    }
})

async function getReviews() {
    let response = await getCompanyReviews(company,appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort );
    renderReviewsV2(response.items);
}

function updatePagination() {
    let prevButton = document.querySelector('.prev-btn');
    let nextButton = document.querySelector('.next-btn');

    prevButton.disabled = appState.currentPage === 1;
    nextButton.disabled = appState.currentPage === totalPages;

    let numberedButtons = document.querySelectorAll('.number-btn');
    numberedButtons.forEach((button) => {
        button.classList.remove('btn-active');
    })

    numberedButtons.forEach((button) => {
        if(Number(button.textContent) === appState.currentPage) {
            button.classList.add('btn-active');
        }
    })
}

//TODO 2 - кнопка add review создать форму 3 - новая страница about