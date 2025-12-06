// ============================================
// CS171 ML Exam Simulator - UI Functions
// ============================================

function displayResults(results) {
    const screen = document.getElementById('resultsScreen');
    screen.classList.add('active');
    
    const minutes = Math.floor(results.timeSpent / 60);
    const seconds = results.timeSpent % 60;
    
    let html = `
        <div class="results-container">
            <div class="results-header">
                <h2>📊 Exam Complete!</h2>
                <p>Here's how you performed</p>
            </div>

            <div class="score-display">
                <div class="score-main">${Math.round(results.overallScore)}%</div>
                <div class="score-subtitle">Overall Score</div>
            </div>

            <div class="results-breakdown">
                <div class="stat-card">
                    <h3>True/False</h3>
                    <div class="value">${results.tfCorrect}/${results.tfTotal}</div>
                    <div class="description">${Math.round(results.tfPercentage)}% Correct</div>
                </div>
                <div class="stat-card">
                    <h3>Short Answer</h3>
                    <div class="value">${results.saAnswered}/${results.saTotal}</div>
                    <div class="description">Completed</div>
                </div>
                <div class="stat-card">
                    <h3>Time Spent</h3>
                    <div class="value">${minutes}m ${seconds}s</div>
                    <div class="description">Total Duration</div>
                </div>
                <div class="stat-card">
                    <h3>Questions</h3>
                    <div class="value">${results.tfTotal + results.saTotal}</div>
                    <div class="description">Total Attempted</div>
                </div>
            </div>

            <div class="review-section">
                <h3>📝 Review Your Answers</h3>
    `;
    
    // Group by type
    const tfReviews = results.review.filter(r => r.type === 'tf');
    const saReviews = results.review.filter(r => r.type === 'sa');
    
    if (tfReviews.length > 0) {
        html += `<h4 style="color: var(--primary-color); margin-top: 30px; margin-bottom: 15px;">True/False Questions</h4>`;
        tfReviews.forEach(item => {
            html += `
                <div class="review-item ${item.correct ? 'correct' : 'incorrect'}">
                    <div class="review-question-text">
                        <strong>Question ${item.index}:</strong> ${item.question}
                    </div>
                    <div class="review-answer">
                        <strong>Your Answer:</strong> ${item.userAnswer}<br>
                        <strong>Correct Answer:</strong> ${item.correctAnswer}<br>
                        <strong>Topic:</strong> ${item.topic}<br>
                        <strong>Result:</strong> <span style="color: ${item.correct ? 'var(--success-color)' : 'var(--error-color)'};">${item.correct ? '✓ Correct' : '✗ Incorrect'}</span>
                    </div>
                    ${item.explanation ? `
                        <div class="explanation-box">
                            <div class="explanation-title">💡 Explanation</div>
                            ${item.explanation}
                        </div>
                    ` : ''}
                </div>
            `;
        });
    }
    
    if (saReviews.length > 0) {
        html += `<h4 style="color: var(--primary-color); margin-top: 30px; margin-bottom: 15px;">Short Answer Questions</h4>`;
        saReviews.forEach(item => {
            html += `
                <div class="review-item">
                    <div class="review-question-text">
                        <strong>Question ${item.index}:</strong> ${item.question}
                    </div>
                    <div class="review-answer">
                        <strong>Your Answer:</strong><br>
                        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 10px 0; white-space: pre-wrap;">
                            ${item.userAnswer || '<em>No answer provided</em>'}
                        </div>
                        <strong>Sample Answer (${item.points} points):</strong><br>
                        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            ${item.sampleAnswer}
                        </div>
                        <strong>Topic:</strong> ${item.topic}
                    </div>
                </div>
            `;
        });
    }
    
    html += `
            </div>
            <div style="text-align: center; margin-top: 40px;">
                <button class="start-button" onclick="location.reload()">
                    <span class="button-text">Take Another Exam</span>
                    <span class="button-icon">🔄</span>
                </button>
            </div>
        </div>
    `;
    
    screen.innerHTML = html;
}

function showQuestionGrid() {
    const modal = document.getElementById('gridModal');
    const container = document.getElementById('questionGridContainer');
    
    let html = '';
    examState.questions.forEach((q, index) => {
        const answered = examState.answers.hasOwnProperty(index);
        const flagged = examState.flagged.has(index);
        const current = index === examState.currentQuestion;
        
        let classes = 'grid-item';
        if (current) classes += ' current';
        else if (answered) classes += ' answered';
        if (flagged) classes += ' flagged';
        
        html += `<div class="${classes}" onclick="jumpToQuestion(${index})">${index + 1}</div>`;
    });
    
    container.innerHTML = html;
    modal.classList.add('active');
}

function jumpToQuestion(index) {
    examState.currentQuestion = index;
    closeModal();
    displayQuestion();
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Only in exam screen
    if (!document.getElementById('examScreen').classList.contains('active')) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            if (examState.currentQuestion > 0) previousQuestion();
            break;
        case 'ArrowRight':
            if (examState.currentQuestion < examState.questions.length - 1) nextQuestion();
            break;
        case 'f':
        case 'F':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleFlag();
            }
            break;
    }
});

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
});

// Prevent accidental page close
window.addEventListener('beforeunload', function(e) {
    if (document.getElementById('examScreen').classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});
