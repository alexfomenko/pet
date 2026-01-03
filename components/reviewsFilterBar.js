import {getReviews} from "../api/reviewsApi.js";
import {renderReviews} from "./newReviewRow.js";

let reviewsContainer = document.getElementById("reviewsContainer");
let filterBar = document.getElementById('filterBar');

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
