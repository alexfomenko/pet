import {sendDeleteRequest} from "../../api/reviewsApi.js";
import {sendUpdateRequest} from "../../api/reviewsApi.js";

function renderStars() {
    return `
        <div class="star" data-value ="1"></div>
        <div class="star" data-value ="2"></div>
        <div class="star" data-value ="3"></div>
        <div class="star" data-value ="4"></div>
        <div class="star" data-value ="5"></div>`;
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
                                <div class="company-about">
                                <a href="/html/companyAbout?company=${encodeURIComponent(review.company)}">${company}</a>
                                </div>
                            </div>

                            <div class="stars" data-rating-value = ${rating}>
                                <div class="stars-back">
                                    ${renderStars()}
                                </div>
                                <div class="stars-front" style="width: ${ratingPercent}%;">
                                    ${renderStars()}
                                </div>
                                <input type="hidden" class="review-rating-value" value="">
                            </div>
                        </div>

                        <p class="review-text">${reviewText}</p>

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

// export function handleChangeReviewActions() {
//     document.querySelectorAll('.edit-review-btn')[0].addEventListener("click", (event) => {
//         let text = document.querySelectorAll('.review-text')[0];
//         text.contentEditable = "true";
//     });
// }

export function handleChangeReviewActions() {
    let reviewsContainer = document.querySelector('.reviews-list');
    console.log(reviewsContainer)
    reviewsContainer.addEventListener('click', async (e) => {

        if (e.target.classList.contains('delete-review-btn')) {
            let closestReviewRow = e.target.closest('.review');
            if (closestReviewRow) {
                let closestReviewItemId = closestReviewRow.dataset.reviewId;
                let deleteResponse = await sendDeleteRequest(closestReviewItemId);
                if(deleteResponse.ok) {
                    closestReviewRow.remove();
                }
            }
        }

        else if (e.target.tagName === "BUTTON" && e.target.classList.contains('edit-review-btn')) {
            let editButton = e.target;
            // getting current row
            let closestReviewRow = editButton.closest('.review');
            if (closestReviewRow) {
                let closestReviewRawId = closestReviewRow.dataset.reviewId;
                let companyEl = closestReviewRow.querySelector('.company-about');
                let starsContainer = closestReviewRow.querySelector('.stars');
                let reviewEl = closestReviewRow.querySelector('.review-text');
                let reviewFooterButtons = closestReviewRow.querySelector('.review-footer-buttons');

                // saving current values of the fields for Cancel button ! so that I can extract them later from dataset in case the user wants to cancel her actions
                closestReviewRow.dataset.initialCompanyValue = companyEl.textContent;
                // closestReviewRow.dataset.initialRatingValue = ratingStars; //todo
                closestReviewRow.dataset.initialReviewValue = reviewEl.textContent;

                //changing fields to editable text areas with current values ( divs to inputs)
                companyEl.innerHTML = `<input type = 'text' id='company_updated' value="${closestReviewRow.dataset.initialCompanyValue}">`
                // ratingStars.innerHTML = `<input type = 'text' value = "${closestReviewRow.dataset.initialRatingValue}">`
                reviewEl.innerHTML = `<textarea id="review_updated">${closestReviewRow.dataset.initialReviewValue}</textarea>`

                handleStarRatingUpdate(starsContainer);

                removeAllButtons(closestReviewRow);
                reviewFooterButtons.appendChild(createButton('save-review-btn ghost-btn', "Save", 'Save'));
                reviewFooterButtons.appendChild(createButton('cancel-review-btn ghost-btn', "Cancel", 'Cancel'));
            }
        }

        else if (e.target.tagName === 'BUTTON' && e.target.classList.contains('save-review-btn')) {
            let closestReviewRow = e.target.closest('.review');
            let closestReviewRowId = closestReviewRow.dataset.reviewId;
            let reviewFooterButtons = closestReviewRow.querySelector('.review-footer-buttons');
            // console.log(closestReviewRowId)
            if (closestReviewRowId) {
                let updatedCompanyValue = closestReviewRow.querySelector('#company_updated').value;
                let updatedRatingValue = closestReviewRow.querySelector('.stars').dataset.ratingValue;
                let updatedReviewValue = closestReviewRow.querySelector('#review_updated').value;

                // preparing data and sending request
                let data = {
                    company: updatedCompanyValue,
                    rating: updatedRatingValue,
                    review: updatedReviewValue,
                };

                console.log(data)
                let updateResponse = await sendUpdateRequest(closestReviewRowId, data);

                //changing fields back to divs with current values (inputs tom divs)
               closestReviewRow.querySelector('.company-about').textContent = updatedCompanyValue ;
               // closestReviewRow .querySelector('').textContent = updatedRatingValue; //todo
               closestReviewRow.querySelector('.review-text').textContent = updatedReviewValue ;

                // removing all old buttons and creating new ones
                removeAllButtons(closestReviewRow);
                reviewFooterButtons.appendChild(createButton('edit-review-btn ghost-btn', 'Edit', 'Edit'));
                reviewFooterButtons.appendChild(createButton('delete-review-btn ghost-btn', 'Delete', 'Delete'));
                // }
            }
        }
        else if (e.target.tagName === 'BUTTON' && e.target.classList.contains('cancel-review-btn')) {
            let cancelButton = e.target;
            let closestReviewRow = cancelButton.closest('.review');
            let reviewFooterButtons = closestReviewRow.querySelector('.review-footer-buttons');
            if (closestReviewRow) {
                // filling back divs with old values
              closestReviewRow.querySelector('.company-about').textContent = closestReviewRow.dataset.initialCompanyValue;
              // closestReviewRow .querySelector('').textContent = closestReviewRow.dataset.initialRatingValue; //todo
              closestReviewRow.querySelector('.review-text').textContent = closestReviewRow.dataset.initialReviewValue;

                // removing all old buttons and creating new ones
                removeAllButtons(closestReviewRow);
                reviewFooterButtons.appendChild(createButton('edit-review-btn ghost-btn', 'Edit', 'Edit'));
                reviewFooterButtons.appendChild(createButton('delete-review-btn ghost-btn', 'Delete', 'Delete'));
            }
        }
    })
}

function removeAllButtons(closestReviewRow) {
    let buttons = closestReviewRow.querySelectorAll('button');
    buttons.forEach((button) => button.remove());
}

function createButton(className, title, textContent) {
    let button = document.createElement('button');
    button.className = className;
    button.title = title;
    button.textContent = textContent;
    return button;
}

function handleStarRatingUpdate(starsContainer) {
    starsContainer.addEventListener('click', (e) => {
        let rect = starsContainer.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        let starWidth = rect.width / 5;
        let rating = Math.ceil(clickX / starWidth);

        let starsFront = starsContainer.querySelector('.stars-front');
        starsFront.style.width = `${rating * 20}%`;
        starsContainer.dataset.ratingValue = String(rating);
    });
}