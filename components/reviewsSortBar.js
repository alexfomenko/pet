import {getReviews} from "../api/reviewsApi.js";
import {renderReviews} from "../utils/utils.js";

let sortBar = document.getElementById('sortBar');
let reviewsContainer = document.getElementById("reviewsContainer");

sortBar.addEventListener('change', async (e) => {
    let target = e.target.value;
    reviewsContainer.innerHTML = "";

    let response = await getReviews();
    let reviews = response.items;

    let sortedReviews = [];
    if(target === "date_new_to_old") {
        sortedReviews = reviews.sort((review1, review2) => new Date(review2.date) - new Date(review1.date));
        // sortedNewToOld
        //     .forEach((review) => {
        //     let newRow = createNewRow(review.id, review.company, review.rating, review.review, review.date);
        //     reviewsContainer.appendChild(newRow);
        // })
        // renderReviews(sortedArray);
    }
    else if(target === "date_old_to_new") {
        sortedReviews = reviews.sort((review1, review2) => new Date(review1.date) - new Date(review2.date));
    }
    else if(target === "rating_low_to_high") {
        sortedReviews = reviews.sort((review1, review2) => review1.rating - review2.rating);
    }
    else if(target === "rating_high_to_low") {
        sortedReviews = reviews.sort((review1, review2) => review2.rating - review1.rating);
    }
    renderReviews(sortedReviews);
})