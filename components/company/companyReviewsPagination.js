import {getCompanyReviews} from "../../api/companyApi.js";
import {companyReviewsState} from "./companyReviewsState.js";
import {renderReviewsV2} from "./companyReviewAricle.js";

let pagination = document.querySelector('.pagination');

let company = document.querySelector('.company-name').textContent;
let totalPages;

 export async function renderPaginationV2(company) {
    pagination.innerHTML = "";

    let request = await getCompanyReviews(company, companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort);
    totalPages = request.pagesTotalNumber;

    let prevButton = document.createElement('button');
     prevButton.classList.add('prev-btn'); // TODO
     prevButton.textContent = '←';
     pagination.appendChild(prevButton);
     prevButton.disabled = companyReviewsState.currentPage === 1;

     for(let i = 1; i <= totalPages; i++) {
         let numberedButton = document.createElement('button');
         numberedButton.classList.add('number-btn'); //TODO
         numberedButton.textContent = String(i);
         // console.log(numberedButton.textContent)
         pagination.appendChild(numberedButton);
         if(i === companyReviewsState.currentPage) numberedButton.classList.add('btn-active'); //TODO
     }

    let nextButton = document.createElement('button');
     nextButton.classList.add('next-btn'); // TODO
     nextButton.textContent = '→';
     pagination.appendChild(nextButton);
     nextButton.disabled = companyReviewsState.currentPage === totalPages;
 }

pagination.addEventListener('click', async(e) => {
    let prevButton = document.querySelector('.prev-btn');
    let nextButton = document.querySelector('.next-btn');

    let target = e.target;
    if(target.classList.contains('prev-btn')) {
        if(companyReviewsState.currentPage > 1) {
            companyReviewsState.currentPage = companyReviewsState.currentPage - 1;
            // //1 - change app variables
            // companyReviewsState.currentPage = companyReviewsState.currentPage - 1;
            // //2 - send request and render new articles
            // let response = await getCompanyReviews(company,companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort );
            // renderReviewsV2(response.items);
            //
            // //3 - check enabled/disabled buttons
            // prevButton.disabled = companyReviewsState.currentPage === 1;
            // nextButton.disabled = companyReviewsState.currentPage === totalPages;
            //
            // //4 - change active buttons
            // let numberedButtons = document.querySelectorAll('.number-btn');
            // numberedButtons.forEach((button) => {
            //     button.classList.remove('btn-active');
            // })
            //
            // numberedButtons.forEach((button) => {
            //     if(Number(button.textContent) === companyReviewsState.currentPage) {
            //         button.classList.add('btn-active');
            //     }
            // })

            //INSTEAD OF DUPLICATE CODE THESE TWO FUNCTIONS

            await getReviews();
            updatePagination();
        }
    }
    if(target.classList.contains('next-btn')) {
        if(companyReviewsState.currentPage < totalPages) {
            companyReviewsState.currentPage = companyReviewsState.currentPage + 1;

            await getReviews();
            updatePagination();
        }
    }
    if(target.classList.contains('number-btn')) {
        let pageNumber = Number(e.target.textContent);
        // console.log(pageNumber);
        companyReviewsState.currentPage = pageNumber;

        await getReviews();
        updatePagination();
    }
})

async function getReviews() {
    let response = await getCompanyReviews(company,companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort );
    renderReviewsV2(response.items);
}

function updatePagination() {
    let prevButton = document.querySelector('.prev-btn');
    let nextButton = document.querySelector('.next-btn');

    prevButton.disabled = companyReviewsState.currentPage === 1;
    nextButton.disabled = companyReviewsState.currentPage === totalPages;

    let numberedButtons = document.querySelectorAll('.number-btn');
    numberedButtons.forEach((button) => {
        button.classList.remove('btn-active');
    })

    numberedButtons.forEach((button) => {
        if(Number(button.textContent) === companyReviewsState.currentPage) {
            button.classList.add('btn-active');
        }
    })
}

//TODO 2 - кнопка add review создать форму 3 - новая страница about