export function renderAuthNav() {
    let authNav = document.getElementById('authNav');
    let token = localStorage.getItem('token');

    if(!authNav) return;

    if(token) {
        authNav.innerHTML = `
          <a href="/html/personalProfile" class="account-btn">My cabinet</a>
            <button type="button" class="logout-btn" id="logoutButton">Log out</button>`

        let logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/html/login';
        });

    }
    else {
        authNav.innerHTML = `
        <a href="/html/login" class="account-btn">Sign in</a>
        <a href="/html/signup" class="signup-btn">Sign up</a>`
    }
}