export function createButton(className, title, textContent) {
    let button = document.createElement('button');
    button.className = className;
    button.title = title;
    button.textContent = textContent;
    return button;
}
