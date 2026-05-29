function renderStars() {
    return `
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
    `;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function formatReviewDate(date) {
    let parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date ?? '';
    }

    return parsedDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });
}

function renderReviewArticle(review) {
    let rating = Number(review.rating) || 0;
    let ratingPercent = Math.min(Math.max(rating, 0), 5) / 5 * 100;
    let reviewId = escapeHtml(review.id);
    let company = escapeHtml(review.company);
    let reviewText = escapeHtml(review.review);
    let reviewDate = escapeHtml(formatReviewDate(review.date));

    return `
                    <article class="review card" data-review-id="${reviewId}">
                        <div class="review-head">
                            <div class="company">
                                <div class="company-about">${company}</div>
                            </div>

                            <div class="stars">
                                <div class="stars-back">
                                    ${renderStars()}
                                </div>
                                <div class="stars-front" style="width: ${ratingPercent}%;">
                                    ${renderStars()}
                                </div>
                            </div>
                        </div>

                        <p class="review-text" contenteditable="true">${reviewText}</p>

                        <div class="review-footer">
                            <div class="date">${reviewDate}</div>
                            <div class="review-footer-buttons">
                                <button class="edit-review-btn ghost-btn">Edit</button>
                                <button class="delete-review-btn ghost-btn">Delete</button>
                            </div>
                        </div>
                    </article>
    `;
}

export function renderReviewsProfile(reviews = []) {
    let reviewsList = Array.isArray(reviews) ? reviews : [];
    let reviewsHtml = reviewsList.length
        ? reviewsList.map((review) => renderReviewArticle(review)).join('')
        : `<p class="empty-reviews">No reviews yet</p>`;

    return `         
         <div class="reviews-body">
                <div class="reviews-toolbar card">
                    <label for="sorting">
                    <select id="sorting">
                        <option>Sort by</option>
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>
                    </label>
                </div>
                <div class="reviews-list">
                    ${reviewsHtml}
                </div>
                <div class="reviews-pagination"></div>
            </div>
`;
}
