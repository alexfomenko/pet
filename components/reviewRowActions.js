// import {removeAllButtons} from "../utils/utils.js";
import {createButton} from "./reviewButton.js";
import {sendDeleteRequest, sendUpdateRequest} from "../api/reviewsApi.js";

let reviewsContainer = document.querySelector('.table-form-container-wrap');

reviewsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        let closestReviewRow = e.target.closest('.review-item');
        if (closestReviewRow) {
            let closestReviewItemId = closestReviewRow.dataset.id;
            let deleteResponse = await sendDeleteRequest(closestReviewItemId);

            if(deleteResponse.ok) {
                closestReviewRow.remove();
            }

            // let sendRequest = await fetch(`/delete-review/${closestReviewItemId}`, {
            //     method: 'DELETE',
            //     headers: {'Content-type': 'application/json'}
            // });
            //
            // if (sendRequest.ok) {
            //     closestReviewRow.remove();
            // }
        }
    }

       else if (e.target.tagName === "BUTTON" && e.target.classList.contains('edit-btn')) {
            let editButton = e.target;
            // getting current row
            let closestReviewRow = editButton.closest('.review-item');
            if (closestReviewRow) {
                let closestReviewRawId = closestReviewRow.dataset.id;

                // getting current columns of the row
                let columns = closestReviewRow.querySelectorAll(".column");

                // saving current values of the fields
                closestReviewRow.dataset.initialCompanyValue = columns[0].textContent;
                closestReviewRow.dataset.initialRatingValue = columns[1].textContent;
                closestReviewRow.dataset.initialReviewValue = columns[2].textContent;

                //changing fields to editable text areas with current values ( divs to inputs)
                columns[0].innerHTML = `<input type = 'text' value="${closestReviewRow.dataset.initialCompanyValue}">`
                columns[1].innerHTML = `<input type = 'text' value = "${closestReviewRow.dataset.initialRatingValue}">`
                columns[2].innerHTML = `<textarea id="review_updated">${closestReviewRow.dataset.initialReviewValue}</textarea>`

                // creating save and cancel buttons
                // editButton.outerHTML = `<button class="save-btn" title="Save changes"> 💾 </button>
                //                         <button class="cancel-btn" title="Отмена">❌</button>`

                // let buttons = closestReviewRow.querySelectorAll('button');
                // buttons.forEach((button) => button.remove());

                removeAllButtons(closestReviewRow);

                closestReviewRow.appendChild(createButton('save-btn', "Save changes", '💾'));
                closestReviewRow.appendChild(createButton('cancel-btn', "Cancel changes", '❌'));
            }
        }

        else if (e.target.tagName === 'BUTTON' && e.target.classList.contains('save-btn')) {
            let closestReviewRow = e.target.closest('.review-item');
            let closestReviewRowId = closestReviewRow.dataset.id;
            console.log(closestReviewRowId)
            if (closestReviewRowId) {
                let columns = closestReviewRow.querySelectorAll('.column');

                // saving updated values of the fields
                let updatedCompanyValue = columns[0].querySelector('input').value;
                let updatedRatingValue = columns[1].querySelector('input').value;
                let updatedReviewValue = columns[2].querySelector('textarea').value;

                // preparing request data
                let data = {
                    company: updatedCompanyValue,
                    rating: updatedRatingValue,
                    review: updatedReviewValue
                };

                // try {
                //     let sendPutRequest = await fetch(`/update-review/${closestReviewRowId}`, {
                //         method: 'PUT',
                //         headers: {'Content-type': 'application/json'},
                //         body: JSON.stringify(data)
                //     });
                //
                // }
                // catch (error) {
                //     throw new Error("An error occurred while updating data")
                // }

                let updateResponse = await sendUpdateRequest(closestReviewRowId, data);
                // if(updateResponse.ok) {

                //changing fields back to divs with current values (inputs tom divs)
                columns[0].textContent = updatedCompanyValue;
                columns[1].textContent = updatedRatingValue;
                columns[2].textContent = updatedReviewValue;

                // removing all old buttons and creating new ones
                removeAllButtons(closestReviewRow);

                closestReviewRow.appendChild(createButton('edit-btn', 'Update review', '✏️'));
                closestReviewRow.appendChild(createButton('delete-btn', 'Delete review', '🗑️'));
                // }
            }
        }
        else if (e.target.tagName === 'BUTTON' && e.target.classList.contains('cancel-btn')) {
            let cancelButton = e.target;
            let closestReviewRow = cancelButton.closest('.review-item');
            let columns = closestReviewRow.querySelectorAll('.column');
            if (closestReviewRow) {
                let closestReviewRowId = closestReviewRow.dataset.id;

                // filling back divs with old values
                columns[0].textContent = closestReviewRow.dataset.initialCompanyValue;
                columns[1].textContent = closestReviewRow.dataset.initialRatingValue;
                columns[2].textContent = closestReviewRow.dataset.initialReviewValue;

                // removing all old buttons and creating new ones
                removeAllButtons(closestReviewRow);

                closestReviewRow.appendChild(createButton('edit-btn', 'Update review', '✏️'));
                closestReviewRow.appendChild(createButton('delete-btn', 'Delete review', '🗑️'));
            }
        }
})

export function removeAllButtons(closestReviewRow) {
    let buttons = closestReviewRow.querySelectorAll('button');
    buttons.forEach((button) => button.remove());
}