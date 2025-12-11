import {createReviewColumn} from "../utils/utils.js";
import {createButton} from "./button.js";
let reviewsContainer = document.getElementById("reviewsContainer");

export function createNewRow(reviewId, companyValue, ratingValue, reviewValue, date) {
    // creating a new row
    let newReviewItem = document.createElement('div');
    newReviewItem.classList.add("review-item");
    // newReviewItem.appendChild(deleteButton);

    //adding review data to the table
    newReviewItem.dataset.id = reviewId;
//         newReviewItem.innerHTML = `
//              <div class="column company"> ${companyValue} </div>
//              <div class="column rating"> ${ratingValue} </div>
//              <div class="column review"> ${reviewValue} </div>
//              <div class="column date"> ${date} </div>
//              <button class ="edit-btn" title = "Update review"> ✏️</button>
//              <button class = 'delete-btn' title="Delete review">🗑️</button>
// `
    newReviewItem.appendChild(createReviewColumn(companyValue, 'column', 'company'));
    newReviewItem.appendChild(createReviewColumn(ratingValue, 'column', 'rating'));
    newReviewItem.appendChild(createReviewColumn(reviewValue, 'column', 'review'));
    newReviewItem.appendChild(createReviewColumn(date, 'column', 'date'));

    newReviewItem.appendChild(createButton('edit-btn', 'Update review', '✏️'));
    newReviewItem.appendChild(createButton('delete-btn', 'Delete review', '🗑️'));
    return newReviewItem;
}