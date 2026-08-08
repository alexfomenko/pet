
const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    window.location.href = '/html/login';
});

// const logoutButton = document.getElementById('logoutButton');
//
// logoutButton.addEventListener('click', () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userName');
//
//     window.location.href = '/html/login';
// });

