// components/common/countChars.js
export function countChars(field, counter) {
    let currentCount = counter.querySelector('.js-current-count');

    let updateCounter = () => {
        let currentLength = field.value.length;
        currentCount.textContent = currentLength;
        counter.classList.toggle(
            'char-counter--warning',
            currentLength >= field.maxLength * 0.9
        );
    };

    field.addEventListener('input', updateCounter);
    updateCounter();
}