// import {createReviewColumn} from "../utils/utils.js";
import {createButton} from "./reviewButton.js";
let reviewsContainer = document.getElementById("reviewsContainer");

export function createNewRow(reviewId, userId, companyValue, userNameValue, ratingValue, reviewValue, date) {
    // creating a new row
    let newReviewItem = document.createElement('div');
    newReviewItem.classList.add("review-item");
    // newReviewItem.appendChild(deleteButton);

    //adding review data to the table
    newReviewItem.dataset.id = reviewId;
    newReviewItem.dataset.userId = userId;
//         newReviewItem.innerHTML = `
//              <div class="column company"> ${companyValue} </div>
//              <div class="column rating"> ${ratingValue} </div>
//              <div class="column review"> ${reviewValue} </div>
//              <div class="column date"> ${date} </div>
//              <button class ="edit-btn" title = "Update review"> ✏️</button>
//              <button class = 'delete-btn' title="Delete review">🗑️</button>
// `
    newReviewItem.appendChild(createReviewColumn(companyValue, 'column', 'company'));
    newReviewItem.appendChild(createReviewColumn(userNameValue, 'column', 'company'));
    newReviewItem.appendChild(createReviewColumn(ratingValue, 'column', 'rating'));
    newReviewItem.appendChild(createReviewColumn(reviewValue, 'column', 'review'));
    newReviewItem.appendChild(createReviewColumn(date, 'column', 'date'));

    newReviewItem.appendChild(createButton('edit-btn', 'Update review', '✏️'));
    newReviewItem.appendChild(createButton('delete-btn', 'Delete review', '🗑️'));
    return newReviewItem;
}

export function createReviewColumn(textContent, ...classes) {
    let reviewColumn = document.createElement('div');
    reviewColumn.classList.add(...classes);
    reviewColumn.textContent = textContent;
    return reviewColumn;
}

//todo check review.userName
export function renderReviews(reviewsArray) {
    let reviewsContainer = document.getElementById("reviewsContainer");
    reviewsContainer.innerHTML = "";
    reviewsArray.forEach((review) => {
        let newRow = createNewRow(review.id, review.userId, review.company,review.userName, review.rating, review.review, review.date);
        reviewsContainer.appendChild(newRow);
    })
}