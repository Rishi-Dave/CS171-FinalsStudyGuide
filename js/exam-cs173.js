// ============================================
// CS173 NLP Exam Simulator - Core Exam Logic
// ============================================

// Exam State
const examState = {
    examType: 'full',
    timed: true,
    timeLimit: 60 * 60, // seconds (60 min for full exam)
    practiceMode: false,
    questions: [],
    currentQuestion: 0,
    answers: {},
    flagged: new Set(),
    selectedTopics: new Set(),
    startTime: null,
    timerInterval: null,
    showFeedback: {} // Track which questions have shown feedback
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    hideLoadingScreen();
    setupEventListeners();

    // Wait for QuestionBank to load
    const maxRetries = 50; // 5 seconds of retrying (50 * 100ms)
    let retries = 0;

    function tryPopulateTopics() {
        // Check if QuestionBank is loaded globally
        if (window.QuestionBank &&
            window.QuestionBank.questions &&
            window.QuestionBank.questions.multiplechoice &&
            window.QuestionBank.questions.multiplechoice.length > 0) {
            console.log('✅ QuestionBank detected, populating topics...');
            populateTopics();
        } else if (retries < maxRetries) {
            retries++;
            if (retries === 1 || retries % 10 === 0) {
                console.log(`⏳ Waiting for QuestionBank to load... (${retries*100}ms)`);
            }
            setTimeout(tryPopulateTopics, 100);
        } else {
            console.error('❌ Failed to load QuestionBank after 5 seconds');
            console.error('QuestionBank:', window.QuestionBank);
        }
    }

    tryPopulateTopics();

    // Also listen for the questionsLoaded event
    window.addEventListener('questionsLoaded', function() {
        console.log('📢 questionsLoaded event fired, re-populating topics');
        populateTopics();
    });
});

function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 500);
}

function setupEventListeners() {
    // Exam type selection
    document.querySelectorAll('[data-type]').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('[data-type]').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            examState.examType = this.dataset.type;

            // Update time limit based on exam type
            if (this.dataset.type === 'full') {
                examState.timeLimit = 60 * 60; // 60 minutes
            } else {
                examState.timeLimit = 0; // Untimed by default for practice modes
            }

            // Show/hide topic selection
            const topicSection = document.getElementById('topicSelection');
            topicSection.style.display = this.dataset.type === 'topic' ? 'block' : 'none';
        });
    });

    // Timing selection
    document.querySelectorAll('[data-setting]').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('[data-setting]').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            examState.timed = this.dataset.setting === 'timed';
        });
    });

    // Practice mode toggle
    const practiceModeCheckbox = document.getElementById('practiceMode');
    if (practiceModeCheckbox) {
        practiceModeCheckbox.addEventListener('change', function() {
            examState.practiceMode = this.checked;
        });
    }
}

function populateTopics() {
    // Handle case where QuestionBank hasn't loaded yet
    if (!window.QuestionBank || !window.QuestionBank.questions || !window.QuestionBank.questions.multiplechoice) {
        console.warn('QuestionBank not yet available for populateTopics');
        return;
    }

    const topics = QuestionBank.getTopics();
    const grid = document.getElementById('topicGrid');

    if (!grid) {
        console.error('Topic grid element not found');
        return;
    }

    grid.innerHTML = topics.map(topic => {
        const mcCount = QuestionBank.questions.multiplechoice.filter(q => q.topic === topic).length;

        return `
            <div class="topic-card" data-topic="${topic}">
                <h4>${topic}</h4>
                <p>${mcCount} Multiple Choice</p>
            </div>
        `;
    }).join('');

    // Add click handlers
    grid.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            const topic = this.dataset.topic;
            if (examState.selectedTopics.has(topic)) {
                examState.selectedTopics.delete(topic);
            } else {
                examState.selectedTopics.add(topic);
            }
        });
    });
}

// Start Exam
function startExam() {
    // Validate that QuestionBank is loaded
    if (!window.QuestionBank || !window.QuestionBank.questions || !window.QuestionBank.questions.multiplechoice) {
        alert('Error: Question bank not loaded. Please refresh the page and try again.');
        console.error('QuestionBank not found:', {
            QuestionBank: !!window.QuestionBank
        });
        return;
    }

    generateQuestions();

    if (examState.questions.length === 0) {
        alert('Please select at least one topic or choose a different exam type.');
        return;
    }

    // Initialize state
    examState.currentQuestion = 0;
    examState.answers = {};
    examState.flagged = new Set();
    examState.startTime = Date.now();

    // Show exam screen
    document.getElementById('setupScreen').classList.remove('active');
    document.getElementById('examScreen').classList.add('active');

    // Update UI
    document.getElementById('totalQuestions').textContent = examState.questions.length;

    // Start timer
    if (examState.timed) {
        startTimer();
    } else {
        document.getElementById('examTimer').textContent = 'Untimed';
    }

    // Display first question
    displayQuestion();
}

function generateQuestions() {
    let questions = [];

    // Validate QuestionBank exists
    if (!window.QuestionBank || !window.QuestionBank.questions || !window.QuestionBank.questions.multiplechoice) {
        console.error('QuestionBank not available');
        examState.questions = [];
        return;
    }

    try {
        if (examState.examType === 'full') {
            // Full Exam: 30 multiple choice questions (60 min)
            questions = QuestionBank.getRandomQuestions(30, 'multiplechoice');
            console.log('📝 Full Exam: 30 multiple choice questions (60 min)');
        } else if (examState.examType === 'mc-practice-short') {
            // Short Practice: 15 questions with intelligent selection
            if (window.ProgressTracker) {
                questions = ProgressTracker.selectQuestions(
                    QuestionBank.questions.multiplechoice, 15, {
                        favorWeakTopics: true,
                        excludeRecent: true
                    });
                console.log('🧠 MC Practice Short: Selected 15 questions targeting your weak areas');
            } else {
                // Fallback to random if no history
                questions = QuestionBank.getRandomQuestions(15, 'multiplechoice');
                console.log('📝 MC Practice Short: Random selection (no history yet)');
            }
        } else if (examState.examType === 'mc-practice-long') {
            // Long Practice: 50 questions with intelligent selection
            if (window.ProgressTracker) {
                questions = ProgressTracker.selectQuestions(
                    QuestionBank.questions.multiplechoice, 50, {
                        favorWeakTopics: true,
                        excludeRecent: true
                    });
                console.log('🧠 MC Practice Long: Selected 50 questions targeting your weak areas');
            } else {
                // Fallback to random if no history
                questions = QuestionBank.getRandomQuestions(50, 'multiplechoice');
                console.log('📝 MC Practice Long: Random selection (no history yet)');
            }
        }

        // Add type to all questions
        examState.questions = questions.map(q => ({...q, type: 'mc'}));
    } catch (error) {
        console.error('Error generating questions:', error);
        examState.questions = [];
    }
}

// Timer
function startTimer() {
    examState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - examState.startTime) / 1000);
        const remaining = examState.timeLimit - elapsed;

        if (remaining <= 0) {
            clearInterval(examState.timerInterval);
            alert('Time is up! Submitting your exam automatically.');
            submitExam();
            return;
        }

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        const timerEl = document.getElementById('examTimer');
        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Add warning classes
        timerEl.classList.remove('warning', 'danger');
        if (remaining <= 300 && remaining > 60) {
            timerEl.classList.add('warning');
        } else if (remaining <= 60) {
            timerEl.classList.add('danger');
        }

        // Alert at 5 minutes
        if (remaining === 300) {
            alert('5 minutes remaining!');
        }
    }, 1000);
}

// Display Question
function displayQuestion() {
    const question = examState.questions[examState.currentQuestion];
    const container = document.getElementById('questionContainer');

    if (!container) {
        console.error('Question container not found');
        return;
    }

    const userAnswer = examState.answers[examState.currentQuestion];

    // Check if we should show feedback (practice mode and already answered)
    if (examState.practiceMode &&
        userAnswer !== undefined &&
        examState.showFeedback[examState.currentQuestion]) {
        const isCorrect = userAnswer === question.answer;
        displayInstantFeedback(isCorrect, question);
        return;
    }

    let html = `
        <div class="question-header">
            <div class="question-meta">
                <span class="meta-badge type">Multiple Choice</span>
                <span class="meta-badge topic">${question.topic}</span>
                <span class="meta-badge">${question.difficulty || 'medium'}</span>
                ${examState.practiceMode ? '<span class="practice-mode-badge">🎯 Practice Mode</span>' : ''}
            </div>
            ${examState.flagged.has(examState.currentQuestion) ? '<span class="meta-badge" style="background: #f59e0b; color: white;">🚩 Flagged</span>' : ''}
        </div>
        <div class="question-text">${question.question}</div>
    `;

    // Multiple Choice Options
    html += `<div class="mc-options">`;
    const options = ['A', 'B', 'C', 'D'];
    options.forEach(option => {
        const isSelected = userAnswer === option;
        html += `
            <label class="mc-option ${isSelected ? 'selected' : ''}">
                <input type="radio" name="q${examState.currentQuestion}" value="${option}" ${isSelected ? 'checked' : ''} onchange="selectAnswer('${option}')">
                <span class="option-letter">${option}</span>
                <span class="option-text">${question.options[option]}</span>
            </label>
        `;
    });
    html += `</div>`;

    container.innerHTML = html;

    // Update navigation
    document.getElementById('prevButton').disabled = examState.currentQuestion === 0;
    document.getElementById('nextButton').innerHTML = examState.currentQuestion === examState.questions.length - 1 ?
        '<span class="nav-text">Finish</span><span class="nav-icon">✓</span>' :
        '<span class="nav-text">Next</span><span class="nav-icon">→</span>';

    // Update progress
    document.getElementById('currentQuestionNum').textContent = examState.currentQuestion + 1;
    const progress = ((examState.currentQuestion + 1) / examState.questions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;

    // Update flag button
    const flagBtn = document.getElementById('flagButton');
    if (examState.flagged.has(examState.currentQuestion)) {
        flagBtn.classList.add('flagged');
    } else {
        flagBtn.classList.remove('flagged');
    }

    // Update stats
    updateStats();
}

function updateStats() {
    const answered = Object.keys(examState.answers).length;
    const flagged = examState.flagged.size;
    const remaining = examState.questions.length - answered;

    document.getElementById('answeredCount').textContent = answered;
    document.getElementById('flaggedCount').textContent = flagged;
    document.getElementById('remainingCount').textContent = remaining;
}

function selectAnswer(answer) {
    examState.answers[examState.currentQuestion] = answer;
    updateStats();

    // Show instant feedback in practice mode
    const currentQuestion = examState.questions[examState.currentQuestion];
    if (examState.practiceMode && currentQuestion) {
        const isCorrect = answer === currentQuestion.answer;
        examState.showFeedback[examState.currentQuestion] = true;

        // Display feedback immediately
        displayInstantFeedback(isCorrect, currentQuestion);
    } else {
        displayQuestion();
    }
}

function toggleFlag() {
    if (examState.flagged.has(examState.currentQuestion)) {
        examState.flagged.delete(examState.currentQuestion);
    } else {
        examState.flagged.add(examState.currentQuestion);
    }
    displayQuestion();
}

function nextQuestion() {
    if (examState.currentQuestion < examState.questions.length - 1) {
        examState.currentQuestion++;
        displayQuestion();
    } else {
        confirmSubmit();
    }
}

function previousQuestion() {
    if (examState.currentQuestion > 0) {
        examState.currentQuestion--;
        displayQuestion();
    }
}

// Submit
function confirmSubmit() {
    const unanswered = examState.questions.length - Object.keys(examState.answers).length;
    const modal = document.getElementById('confirmModal');
    const warning = document.getElementById('confirmWarning');

    if (unanswered > 0) {
        warning.textContent = `⚠️ You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. These will be marked as incorrect.`;
        warning.style.display = 'block';
    } else {
        warning.style.display = 'none';
    }

    modal.classList.add('active');
}

function submitExam() {
    closeModal();
    clearInterval(examState.timerInterval);

    // Calculate results
    const results = calculateResults();

    // Record session in progress tracker
    if (window.ProgressTracker) {
        // Record individual question attempts
        examState.questions.forEach((question, index) => {
            const userAnswer = examState.answers[index];

            if (userAnswer !== undefined) {
                const isCorrect = userAnswer === question.answer;
                ProgressTracker.recordAttempt(
                    question.id,
                    question.topic,
                    isCorrect,
                    0 // We don't track per-question time yet
                );
            }
        });

        // Record session summary
        const topicBreakdown = {};
        examState.questions.forEach(q => {
            if (!topicBreakdown[q.topic]) {
                topicBreakdown[q.topic] = { total: 0, correct: 0 };
            }
            topicBreakdown[q.topic].total++;
        });

        ProgressTracker.recordSession({
            examType: examState.examType,
            totalQuestions: results.mcTotal,
            correctAnswers: results.mcCorrect,
            score: results.overallScore,
            timeSpent: results.timeSpent,
            topicBreakdown: topicBreakdown
        });

        console.log('📊 Progress tracked for this session');
    }

    // Show results screen
    document.getElementById('examScreen').classList.remove('active');
    displayResults(results);
}

function displayInstantFeedback(isCorrect, question) {
    const container = document.getElementById('questionContainer');

    if (!container || !question) {
        console.error('Container or question not found for feedback');
        return;
    }

    // Record attempt immediately in practice mode
    if (window.ProgressTracker) {
        ProgressTracker.recordAttempt(
            question.id,
            question.topic,
            isCorrect,
            0
        );
    }

    const userAnswer = examState.answers[examState.currentQuestion];

    let html = `
        <div class="question-header">
            <div class="question-meta">
                <span class="meta-badge type">Multiple Choice</span>
                <span class="meta-badge topic">${question.topic}</span>
                <span class="meta-badge">${question.difficulty || 'medium'}</span>
            </div>
            ${examState.flagged.has(examState.currentQuestion) ? '<span class="meta-badge" style="background: #f59e0b; color: white;">🚩 Flagged</span>' : ''}
        </div>
        <div class="question-text">${question.question}</div>

        <div class="mc-options">
    `;

    const options = ['A', 'B', 'C', 'D'];
    options.forEach(option => {
        const isUserAnswer = userAnswer === option;
        const isCorrectAnswer = question.answer === option;
        let optionClass = 'mc-option';
        let indicator = '';

        if (isUserAnswer) {
            optionClass += ' selected';
            if (isCorrect) {
                optionClass += ' correct-answer';
            } else {
                optionClass += ' incorrect-answer';
            }
        }

        if (isCorrectAnswer && !isCorrect) {
            optionClass += ' correct-answer';
            indicator = '<span style="margin-left: 10px; color: #10b981; font-weight: bold;">← Correct Answer</span>';
        }

        html += `
            <label class="${optionClass}">
                <input type="radio" name="q${examState.currentQuestion}" value="${option}" ${isUserAnswer ? 'checked' : ''} disabled>
                <span class="option-letter">${option}</span>
                <span class="option-text">${question.options[option]}${indicator}</span>
            </label>
        `;
    });

    html += `
        </div>

        <div class="instant-feedback ${isCorrect ? 'correct' : 'incorrect'}">
            <div class="feedback-header">
                ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            <div class="feedback-body">
                <strong>Explanation:</strong><br>
                ${question.explanation || 'No explanation available'}
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Update navigation and stats
    document.getElementById('prevButton').disabled = examState.currentQuestion === 0;
    document.getElementById('nextButton').innerHTML = examState.currentQuestion === examState.questions.length - 1 ?
        '<span class="nav-text">Finish</span><span class="nav-icon">✓</span>' :
        '<span class="nav-text">Next</span><span class="nav-icon">→</span>';

    const flagBtn = document.getElementById('flagButton');
    if (examState.flagged.has(examState.currentQuestion)) {
        flagBtn.classList.add('flagged');
    } else {
        flagBtn.classList.remove('flagged');
    }

    updateStats();
}

function calculateResults() {
    let mcCorrect = 0;
    let mcTotal = 0;

    const review = [];

    examState.questions.forEach((question, index) => {
        const userAnswer = examState.answers[index];

        mcTotal++;
        const correct = userAnswer === question.answer;
        if (correct) mcCorrect++;

        review.push({
            index: index + 1,
            question: question.question,
            type: 'mc',
            userAnswer: userAnswer || 'No answer',
            correctAnswer: question.answer,
            correct: correct,
            explanation: question.explanation,
            topic: question.topic,
            options: question.options
        });
    });

    const mcPercentage = mcTotal > 0 ? (mcCorrect / mcTotal) * 100 : 0;
    const overallScore = mcPercentage;

    return {
        mcCorrect,
        mcTotal,
        mcPercentage,
        overallScore,
        review,
        timeSpent: Math.floor((Date.now() - examState.startTime) / 1000)
    };
}
