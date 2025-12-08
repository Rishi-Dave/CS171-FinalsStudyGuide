// ============================================
// CS171 ML Exam Simulator - UI Functions
// ============================================

function displayResults(results) {
    const screen = document.getElementById('resultsScreen');

    if (!screen) {
        console.error('Results screen element not found');
        return;
    }

    if (!results || typeof results !== 'object') {
        console.error('Invalid results object', results);
        return;
    }

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

    if (!modal || !container) {
        console.error('Grid modal elements not found');
        return;
    }

    if (!examState.questions || examState.questions.length === 0) {
        console.warn('No questions to display in grid');
        return;
    }

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
    const modals = document.querySelectorAll('.modal');
    if (modals && modals.length > 0) {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Only in exam screen
    const examScreen = document.getElementById('examScreen');
    if (!examScreen || !examScreen.classList.contains('active')) {
        return;
    }

    // Check if modal is open (if so, don't handle shortcuts)
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
        return;
    }

    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            if (examState.currentQuestion > 0) previousQuestion();
            break;
        case 'ArrowRight':
            e.preventDefault();
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
document.addEventListener('click', function(e) {
    const modal = e.target.closest('.modal');
    if (modal && e.target === modal) {
        closeModal();
    }
}, true);

// Prevent accidental page close during exam
window.addEventListener('beforeunload', function(e) {
    const examScreen = document.getElementById('examScreen');
    if (examScreen && examScreen.classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// ============================================
// Progress Dashboard Functions
// ============================================

/**
 * Toggle progress dashboard visibility
 */
function toggleProgressDashboard() {
    const dashboard = document.getElementById('progressDashboard');
    if (!dashboard) return;

    const isVisible = dashboard.style.display !== 'none';

    if (isVisible) {
        dashboard.style.display = 'none';
    } else {
        dashboard.style.display = 'block';
        renderProgressDashboard();
    }
}

/**
 * Render the progress dashboard
 */
function renderProgressDashboard() {
    if (typeof ProgressTracker === 'undefined') {
        console.error('ProgressTracker not loaded');
        return;
    }

    const analytics = ProgressTracker.getAnalytics();
    const content = document.getElementById('progressContent');

    if (!content) return;

    let html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <h3 style="color: white; opacity: 0.9;">Total Questions</h3>
                <div class="value" style="color: white;">${analytics.overall.totalQuestions}</div>
                <div class="description" style="color: rgba(255,255,255,0.8);">Attempted</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">
                <h3 style="color: white; opacity: 0.9;">Correct</h3>
                <div class="value" style="color: white;">${analytics.overall.totalCorrect}</div>
                <div class="description" style="color: rgba(255,255,255,0.8);">${analytics.overall.totalIncorrect} Incorrect</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
                <h3 style="color: white; opacity: 0.9;">Average Score</h3>
                <div class="value" style="color: white;">${analytics.overall.averageScore.toFixed(1)}%</div>
                <div class="description" style="color: rgba(255,255,255,0.8);">Overall Performance</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white;">
                <h3 style="color: white; opacity: 0.9;">Sessions</h3>
                <div class="value" style="color: white;">${analytics.overall.totalSessions}</div>
                <div class="description" style="color: rgba(255,255,255,0.8);">Practice Sessions</div>
            </div>
        </div>
    `;

    // Weak Topics
    if (analytics.weakTopics.length > 0) {
        html += `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #f5576c; margin-bottom: 15px;">🎯 Topics Needing Attention</h3>
                <div style="display: grid; gap: 10px;">
        `;
        analytics.weakTopics.forEach(topic => {
            html += `
                <div style="background: #fff5f5; border-left: 4px solid #f5576c; padding: 15px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${topic.topic}</strong>
                        <span style="color: #f5576c; font-weight: bold;">${topic.score.toFixed(1)}%</span>
                    </div>
                    <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">${topic.total} questions attempted</div>
                    <div style="background: #fecaca; height: 6px; border-radius: 3px; margin-top: 8px; overflow: hidden;">
                        <div style="background: #f5576c; height: 100%; width: ${topic.score}%;"></div>
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    // Mastered Topics
    if (analytics.masteredTopics.length > 0) {
        html += `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #10b981; margin-bottom: 15px;">✅ Mastered Topics</h3>
                <div style="display: grid; gap: 10px;">
        `;
        analytics.masteredTopics.slice(0, 5).forEach(topic => {
            html += `
                <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${topic.topic}</strong>
                        <span style="color: #10b981; font-weight: bold;">${topic.score.toFixed(1)}%</span>
                    </div>
                    <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">${topic.total} questions attempted</div>
                    <div style="background: #bbf7d0; height: 6px; border-radius: 3px; margin-top: 8px; overflow: hidden;">
                        <div style="background: #10b981; height: 100%; width: ${topic.score}%;"></div>
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    // Topic Performance Table
    if (analytics.topicPerformance.length > 0) {
        html += `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #667eea; margin-bottom: 15px;">📊 Performance by Topic</h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
                        <thead>
                            <tr style="background: #667eea; color: white;">
                                <th style="padding: 12px; text-align: left;">Topic</th>
                                <th style="padding: 12px; text-align: center;">Attempted</th>
                                <th style="padding: 12px; text-align: center;">Correct</th>
                                <th style="padding: 12px; text-align: center;">Incorrect</th>
                                <th style="padding: 12px; text-align: center;">Score</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        analytics.topicPerformance.forEach((topic, index) => {
            const bgColor = index % 2 === 0 ? '#f9fafb' : 'white';
            const scoreColor = topic.avgScore >= 80 ? '#10b981' : topic.avgScore >= 60 ? '#f59e0b' : '#f5576c';
            html += `
                <tr style="background: ${bgColor};">
                    <td style="padding: 12px; font-weight: 500;">${topic.topic}</td>
                    <td style="padding: 12px; text-align: center;">${topic.total}</td>
                    <td style="padding: 12px; text-align: center; color: #10b981;">${topic.correct}</td>
                    <td style="padding: 12px; text-align: center; color: #f5576c;">${topic.incorrect}</td>
                    <td style="padding: 12px; text-align: center; font-weight: bold; color: ${scoreColor};">${topic.avgScore.toFixed(1)}%</td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Recent Sessions
    if (analytics.recentSessions.length > 0) {
        html += `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #667eea; margin-bottom: 15px;">📝 Recent Sessions</h3>
                <div style="display: grid; gap: 10px;">
        `;
        analytics.recentSessions.forEach(session => {
            const date = new Date(session.timestamp);
            const scoreColor = session.score >= 80 ? '#10b981' : session.score >= 60 ? '#f59e0b' : '#f5576c';
            html += `
                <div style="background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${session.examType}</strong>
                            <div style="font-size: 0.85rem; color: #666; margin-top: 3px;">
                                ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: ${scoreColor};">${session.score.toFixed(1)}%</div>
                            <div style="font-size: 0.85rem; color: #666;">${session.correctAnswers}/${session.totalQuestions}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    // Action buttons
    html += `
        <div style="display: flex; gap: 15px; margin-top: 30px; flex-wrap: wrap;">
            <button onclick="exportProgress()" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 500;">
                📥 Export Data
            </button>
            <button onclick="resetProgress()" style="padding: 12px 24px; background: #f5576c; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 500;">
                🔄 Reset Progress
            </button>
        </div>
    `;

    content.innerHTML = html;
}

/**
 * Export progress data
 */
function exportProgress() {
    if (typeof ProgressTracker === 'undefined') return;

    const data = ProgressTracker.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cs171-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Reset progress
 */
function resetProgress() {
    if (typeof ProgressTracker === 'undefined') return;

    if (ProgressTracker.reset()) {
        renderProgressDashboard();
    }
}
