
let addReviewButton =  document.querySelector('.title-button');
let overlay = document.getElementById('overlay');
addReviewButton.addEventListener('click', async (e) => {
    // modal.style.display = 'flex';
    overlay.classList.add('active');
})

overlay.addEventListener('click',(e) => {
    if(e.target === overlay) {
        // modal.style.display = 'none';
        overlay.classList.remove('active');
    }
})

//TODO 1 - form normalise 2 - send review onclick 3 - decide on name and email in the form