export function createNewRow(reviewId, userId, companyValue, userNameValue, ratingValue, reviewValue, date) {
    let newReviewItem = document.createElement('div');
    newReviewItem.classList.add("review-item");
    newReviewItem.dataset.id = reviewId;
    newReviewItem.dataset.userId = userId;
    newReviewItem.appendChild(createLinkedReviewColumn(companyValue, null, 'column', 'company' ));
    newReviewItem.appendChild(createLinkedReviewColumn(userNameValue, userId, 'column', 'name'));
    newReviewItem.appendChild(createReviewColumn(ratingValue, 'column', 'rating'));
    newReviewItem.appendChild(createReviewColumn(reviewValue, 'column', 'review'));
    newReviewItem.appendChild(createReviewColumn(date, 'column', 'date'));

    return newReviewItem;
}

export function createReviewColumn(textContent, ...classes) {
    let reviewColumn = document.createElement('div');
    reviewColumn.classList.add(...classes);
    reviewColumn.textContent = textContent;
    return reviewColumn;
}

export function createLinkedReviewColumn(columnValue, userId,...classes) {
    let reviewColumn = document.createElement('div');
    reviewColumn.classList.add(...classes);

    let link = document.createElement('a');
    if(!userId) {
        link.href = `/html/companyAbout?company=${encodeURIComponent(columnValue)}`;
    }
    else {
        link.href = `/html/personalProfile?userId=${encodeURIComponent(userId)}`;
    }

    link.textContent = columnValue;

    reviewColumn.appendChild(link);
    return reviewColumn;
}



export function renderReviews(reviewsArray) {
    let reviewsContainer = document.getElementById("reviewsContainer");
    reviewsContainer.innerHTML = "";
    reviewsArray.forEach((review) => {
        let newRow = createNewRow(review.id, review.userId, review.company,review.userName, review.rating, review.review, review.date);
        reviewsContainer.appendChild(newRow);
    })
}
