document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Registration Page Logic (No Firebase) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.name.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.href = 'login.html';
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Registration failed:', error);
                alert('Registration failed. Please try again later.');
            }
        });
    }

    // --- Login Page Logic (No Firebase) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await response.json();
                if (response.ok) {
                    // Store user info in sessionStorage
                    sessionStorage.setItem('user', JSON.stringify(result.user));
                    alert(result.message);
                    window.location.href = 'dashboard.html';
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Login failed:', error);
                alert('Login failed. Please try again later.');
            }
        });
    }

        // --- Session-based Auth Logic ---
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    // Session-based page protection
    const protectedPages = ['dashboard.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    const isProtected = protectedPages.includes(currentPage);
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

    if (user && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'dashboard.html';
    } else if (!user && isProtected) {
        window.location.href = 'login.html';
    }
});
