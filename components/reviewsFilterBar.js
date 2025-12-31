import {getReviews} from "../api/reviewsApi.js";
import {renderReviews} from "./newReviewRow.js";

let reviewsContainer = document.getElementById("reviewsContainer");
let filterBar = document.getElementById('filterBar');

filterBar.addEventListener("change", async (e) => {
    // console.log("hi");
    let selected = e.target.value;
    reviewsContainer.innerHTML = "";

    let response = await getReviews(1, 100);
    let reviews = response.items;

    let filteredReviews = reviews.filter((review) => review.company === selected);
    // filteredReviews
    //     .forEach((review) => {
    //     let newRow = createNewRow(review.id, review.company, review.rating, review.review, review.date);
    //     reviewsContainer.appendChild(newRow);
    // })
    renderReviews(filteredReviews);
})
