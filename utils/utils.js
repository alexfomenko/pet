export function removeAllButtons(closestReviewRow) {
    let buttons = closestReviewRow.querySelectorAll('button');
    buttons.forEach((button) => button.remove());
}

export function createReviewColumn(textContent, ...classes) {
    let reviewColumn = document.createElement('div');
    reviewColumn.classList.add(...classes);
    reviewColumn.textContent = textContent;
    return reviewColumn;
}

