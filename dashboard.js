document.addEventListener('DOMContentLoaded', () => {
    const essayForm = document.getElementById('essay-form');
    const resultsContainer = document.getElementById('results-container');
    const scoreProgress = document.getElementById('score-progress');
    const scoreText = document.getElementById('score-text');
    const feedbackCards = document.getElementById('feedback-cards');

    // Placeholder for API endpoint
    const API_ENDPOINT = 'https://api.placeholder.com/score';

    essayForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const essayText = document.getElementById('essay-text').value;

        // Simulate API call
        // In a real application, you would use fetch() to call your serverless function
        setTimeout(() => {
            const score = (Math.random() * 10).toFixed(1);
            const feedback = {
                clarity: 'Your essay is generally clear, but some sentences could be more concise.',
                coherence: 'The arguments flow logically, but transitions between paragraphs could be smoother.',
                grammar: 'A few minor grammatical errors were found. Review subject-verb agreement.'
            };

            displayResults(score, feedback);
            saveSubmission(essayText, score, feedback);
        }, 1500);
    });

    function displayResults(score, feedback) {
        resultsContainer.classList.remove('hidden');
        scoreProgress.style.width = `${score * 10}%`;
        scoreText.textContent = `${score}/10`;

        feedbackCards.innerHTML = '';
        for (const key in feedback) {
            const card = document.createElement('div');
            card.className = 'feedback-card';
            card.innerHTML = `<h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4><p>${feedback[key]}</p>`;
            feedbackCards.appendChild(card);
        }
    }

    function saveSubmission(essay, score, feedback) {
        const user = auth.currentUser;
        if (user) {
            const submission = {
                essay: essay,
                score: score,
                feedback: feedback,
                timestamp: new Date().toISOString()
            };
            db.ref('submissions/' + user.uid).push(submission);
        }
    }
});
