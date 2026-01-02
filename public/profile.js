document.addEventListener('DOMContentLoaded', () => {
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const submissionHistory = document.getElementById('submission-history');

    // Get user from sessionStorage
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    
    if (user) {
        // Display user info
        userName.textContent = user.name;
        userEmail.textContent = user.email;

        // For now, show a message for submission history
        // In a real app, you would fetch this from a database
        submissionHistory.innerHTML = '<p>No submissions yet. Start scoring essays to see your history!</p>';
    } else {
        window.location.href = 'login.html';
    }
});
