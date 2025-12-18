// import "./views/reviewsView.js";
// import "./api/reviewsApi.js";
// import "./components/reviewButton.js";
// import "./components/sendReviewForm.js";
// import "./components/newReviewRow.js";
// import "./utils/utils.js";
// import "./components/reviewRowActions.js";

// let showFormButton = document.getElementById('showFormButton');
// let reviewForm = document.getElementById('reviewForm');
// let sendReviewButton = document.getElementById('sendReviewButton');
// let reviewContainer = document.getElementById('reviewsContainer');
// console.log('FORM:', document.getElementById('reviewForm'));
//
// // GET ENDPOINT - LOADING REVIEWS AND SHOWING THEM ON THE PAGE
// async function getReviews() {
//     try {
//         let sendGetRequest = await fetch('/get-review');
//         if (!sendGetRequest.ok) {
//             throw new Error('Failed to get data');
//         }
//         // console.log(await sendGetRequest.json())
//         return await sendGetRequest.json();
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }
//
// document.addEventListener('DOMContentLoaded', async () => {
//     let reviews = await getReviews();
//     for (let review of reviews) {
//         let reviewRow = document.createElement('div');
//         reviewRow.classList.add('review-item');
//         reviewRow.dataset.id = review.id;
//
//       //   reviewRow.innerHTML = `
//       //     <div class="column company"> ${review.company} </div>
//       //     <div class="column company"> ${review.rating} </div>
//       //     <div class="column company"> ${review.review} </div>
//       //     <div class="column company"> ${review.date} </div>
//       //     <button class ="edit-btn" title = "Update review"> ✏️</button>
//       //     <button class = 'delete-btn' title="Delete review">🗑️</button>
//       // `
//         reviewRow.appendChild(createReviewColumn(review.company, 'column', 'company'));
//         reviewRow.appendChild(createReviewColumn(review.rating, 'column', 'rating'));
//         reviewRow.appendChild(createReviewColumn(review.review, 'column', 'review'));
//         reviewRow.appendChild(createReviewColumn(review.date, 'column', 'company'));
//
//         reviewRow.appendChild(createButton('edit-btn', 'Update review', '✏️'));
//         reviewRow.appendChild(createButton('delete-btn', 'Delete review', '🗑️'));
//
//         reviewContainer.appendChild(reviewRow);
//     }
// })
// // SHOW FORM
// showFormButton.addEventListener('click', () => {
//     // reviewForm.classList.toggle('.hidden');
//     reviewForm.style.display = reviewForm.style.display === 'block' ? 'none' : 'block';
// })
//
// // POST REQUEST - SUBMIT REVIEW
//
// //sending data to the server
// async function sendPostRequest(data) {
//     try {
//         let sendRequest = await fetch('/submit-review', {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify(data),
//         });
//         let json = await sendRequest.json();
//         return {ok: sendRequest.ok, status: sendRequest.status, json};
//     }
//     catch (error) {
//         throw new Error('Failed to send the data');
//     }
// }
//
// //
// sendReviewButton.addEventListener('click', async (e) => {
//     // e.preventDefault(); is required only for submit
//
//     //saving data from the form
//     let reviewsContainer = document.getElementById('reviewsContainer');
//
//     let companyValue = document.getElementById('company').value.trim();
//     let ratingValue = document.getElementById('rating').value.trim();
//     let reviewValue = document.getElementById('review').value.trim();
//
//     //creating delete button
//     let deleteButton = document.createElement('button');
//     deleteButton.classList.add('delete-btn');
//     deleteButton.title = 'Delete review';
//     deleteButton.textContent = '🗑️';
//
//     // checking all the fields were filled out
//     if (!companyValue || !ratingValue || !reviewValue) {
//         alert("Please fill out all the fields")
//         return;
//     }
//
//     // getting the current date and converting it
//     let today = new Date();
//     let date = today.toLocaleDateString('ru-RU', {day: 'numeric', month: 'short', year: 'numeric'});
//
//     // unifying data
//     let data = {
//         company: companyValue,
//         rating: ratingValue,
//         review: reviewValue,
//         date: date
//     };
//
//     //adding review to the page if the request was successful
//
//     let requestResult = await sendPostRequest(data);
//     let reviewId = requestResult.json.id;
//     console.log(reviewId)
//     // if(requestResult.status === 201) {    or   // if(requestResult.success === 201) {
//
//     if (requestResult.ok) {
//         // creating a new row
//         let newReviewItem = document.createElement('div');
//         newReviewItem.classList.add("review-item");
//         // newReviewItem.appendChild(deleteButton);
//
//         //adding review data to the table
//         newReviewItem.dataset.id = reviewId;
// //         newReviewItem.innerHTML = `
// //              <div class="column company"> ${companyValue} </div>
// //              <div class="column rating"> ${ratingValue} </div>
// //              <div class="column review"> ${reviewValue} </div>
// //              <div class="column date"> ${date} </div>
// //              <button class ="edit-btn" title = "Update review"> ✏️</button>
// //              <button class = 'delete-btn' title="Delete review">🗑️</button>
// // `
//         newReviewItem.appendChild(createReviewColumn(companyValue, 'column', 'company'));
//         newReviewItem.appendChild(createReviewColumn(ratingValue, 'column', 'rating'));
//         newReviewItem.appendChild(createReviewColumn(reviewValue, 'column', 'review'));
//         newReviewItem.appendChild(createReviewColumn(date, 'column', 'date'));
//
//         newReviewItem.appendChild(createButton('edit-btn', 'Update review', '✏️'));
//         newReviewItem.appendChild(createButton('delete-btn', 'Delete review', '🗑️'));
//
//         reviewsContainer.appendChild(newReviewItem);
//
//         //clean the form
//         document.getElementById('company').value = '';
//         document.getElementById('rating').value = '';
//         document.getElementById('review').value = '';
//
//         //hide the form
//         document.getElementById('reviewForm').style.display = 'none';
//     }
// })
//
// // DELETE REQUEST - DELETING THE REVIEW
//
// async function sendDeleteRequest(closestReviewItemId) {
//     try {
//         let sendRequest = await fetch(`/delete-review/${closestReviewItemId}`, {
//             method: 'DELETE',
//             headers: {'Content-type': 'application/json'}
//         });
//
//         if (!sendRequest.ok) {
//             // closestReviewRow.remove();
//             throw new Error("The delete request wasn't successful.")
//         }
//         return {ok: sendRequest.ok, status: sendRequest.status, data: sendRequest.json()};
//     }
//     catch (error) {
//         console.log(error);
//         throw error;
//     }
// }
//
// // OPTION 1 adding eventListeners to each button
//
// let deleteButtons = document.querySelectorAll(' .delete-btn');
//
// deleteButtons.forEach((button) => {
//     button.addEventListener('click', (e) => {
//         let closestReviewRow = e.target.closest('.review-item');
//         if (closestReviewRow) closestReviewRow.remove();
//     })
// })
//
// // OPTION 2 adding eventListeners to the container
//
// let reviewsContainer = document.querySelector('.table-form-container-wrap');
//
// reviewsContainer.addEventListener('click', async (e) => {
//     if (e.target.classList.contains('delete-btn')) {
//         let closestReviewRow = e.target.closest('.review-item');
//         if (closestReviewRow) {
//             let closestReviewItemId = closestReviewRow.dataset.id;
//             let deleteResponse = await sendDeleteRequest(closestReviewItemId);
//
//             if(deleteResponse.ok) {
//                     closestReviewRow.remove();
//             }
//
//             // let sendRequest = await fetch(`/delete-review/${closestReviewItemId}`, {
//             //     method: 'DELETE',
//             //     headers: {'Content-type': 'application/json'}
//             // });
//             //
//             // if (sendRequest.ok) {
//             //     closestReviewRow.remove();
//             // }
//         }
//     }
// })
//
// async function sendUpdateRequest(closestReviewRowId, data) {
//     try {
//         let sendPutRequest = await fetch(`/update-review/${closestReviewRowId}`, {
//             method: 'PUT',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify(data)
//         });
//         if(!sendPutRequest.ok) {
//             throw new Error(`An error ${sendPutRequest.status} occurred while updating data ${sendPutRequest.statusText}`)
//         }
//         return sendPutRequest;
//     }
//     catch (error) {
//         console.log(error);
//         throw new Error("An error occurred while updating data")
//     }
// }
//
// // UPDATE REQUEST - UPDATING REVIEW
//
// reviewsContainer.addEventListener('click', async (event) => {
//     if (event.target.tagName === "BUTTON" && event.target.classList.contains('edit-btn')) {
//         let editButton = event.target;
//         // getting current row
//         let closestReviewRow = editButton.closest('.review-item');
//         if (closestReviewRow) {
//             let closestReviewRawId = closestReviewRow.dataset.id;
//
//             // getting current columns of the row
//             let columns = closestReviewRow.querySelectorAll(".column");
//
//             // saving current values of the fields
//             closestReviewRow.dataset.initialCompanyValue = columns[0].textContent;
//             closestReviewRow.dataset.initialRatingValue = columns[1].textContent;
//             closestReviewRow.dataset.initialReviewValue = columns[2].textContent;
//
//             //changing fields to editable text areas with current values ( divs to inputs)
//             columns[0].innerHTML = `<input type = 'text' value="${closestReviewRow.dataset.initialCompanyValue}">`
//             columns[1].innerHTML = `<input type = 'text' value = "${closestReviewRow.dataset.initialRatingValue}">`
//             columns[2].innerHTML = `<textarea id="review_updated">${closestReviewRow.dataset.initialReviewValue}</textarea>`
//
//             // creating save and cancel buttons
//             // editButton.outerHTML = `<button class="save-btn" title="Save changes"> 💾 </button>
//             //                         <button class="cancel-btn" title="Отмена">❌</button>`
//
//             // let buttons = closestReviewRow.querySelectorAll('button');
//             // buttons.forEach((button) => button.remove());
//
//             removeAllButtons(closestReviewRow);
//
//             closestReviewRow.appendChild(createButton('save-btn', "Save changes", '💾'));
//             closestReviewRow.appendChild(createButton('cancel-btn', "Cancel changes", '❌'));
//         }
//     }
//
//     else if (event.target.tagName === 'BUTTON' && event.target.classList.contains('save-btn')) {
//         let closestReviewRow = event.target.closest('.review-item');
//         let closestReviewRowId = closestReviewRow.dataset.id;
//         console.log(closestReviewRowId)
//         if (closestReviewRowId) {
//             let columns = closestReviewRow.querySelectorAll('.column');
//
//             // saving updated values of the fields
//             let updatedCompanyValue = columns[0].querySelector('input').value;
//             let updatedRatingValue = columns[1].querySelector('input').value;
//             let updatedReviewValue = columns[2].querySelector('textarea').value;
//
//             // preparing request data
//             let data = {
//                 company: updatedCompanyValue,
//                 rating: updatedRatingValue,
//                 review: updatedReviewValue
//             };
//
//             // try {
//             //     let sendPutRequest = await fetch(`/update-review/${closestReviewRowId}`, {
//             //         method: 'PUT',
//             //         headers: {'Content-type': 'application/json'},
//             //         body: JSON.stringify(data)
//             //     });
//             //
//             // }
//             // catch (error) {
//             //     throw new Error("An error occurred while updating data")
//             // }
//
//             let updateResponse = await sendUpdateRequest(closestReviewRowId, data);
//             // if(updateResponse.ok) {
//
//                 //changing fields back to divs with current values (inputs tom divs)
//                 columns[0].textContent = updatedCompanyValue;
//                 columns[1].textContent = updatedRatingValue;
//                 columns[2].textContent = updatedReviewValue;
//
//                 // removing all old buttons and creating new ones
//                 removeAllButtons(closestReviewRow);
//
//                 closestReviewRow.appendChild(createButton('edit-btn', 'Update review', '✏️'));
//                 closestReviewRow.appendChild(createButton('delete-btn', 'Delete review', '🗑️'));
//             // }
//         }
//     }
//     else if (event.target.tagName === 'BUTTON' && event.target.classList.contains('cancel-btn')) {
//         let cancelButton = event.target;
//         let closestReviewRow = cancelButton.closest('.review-item');
//         let columns = closestReviewRow.querySelectorAll('.column');
//         if (closestReviewRow) {
//             let closestReviewRowId = closestReviewRow.dataset.id;
//
//             // filling back divs with old values
//             columns[0].textContent = closestReviewRow.dataset.initialCompanyValue;
//             columns[1].textContent = closestReviewRow.dataset.initialRatingValue;
//             columns[2].textContent = closestReviewRow.dataset.initialReviewValue;
//
//             // removing all old buttons and creating new ones
//             removeAllButtons(closestReviewRow);
//
//             closestReviewRow.appendChild(createButton('edit-btn', 'Update review', '✏️'));
//             closestReviewRow.appendChild(createButton('delete-btn', 'Delete review', '🗑️'));
//         }
//     }
//
// })
//
// // HELP FUNCTION
// function createButton(className, title, textContent) {
//     let button = document.createElement('button');
//     button.className = className;
//     button.title = title;
//     button.textContent = textContent;
//     return button;
// }
//
// function removeAllButtons(closestReviewRow) {
//     let buttons = closestReviewRow.querySelectorAll('button');
//     buttons.forEach((button) => button.remove());
// }
//
// function createReviewColumn(textContent, ...classes) {
//     let reviewColumn = document.createElement('div');
//     reviewColumn.classList.add(...classes);
//     reviewColumn.textContent = textContent;
//     return reviewColumn;
// }
//
