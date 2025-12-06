// ============================================
// CS171 ML Exam Simulator - Core Exam Logic
// ============================================

// Exam State
const examState = {
    examType: 'full',
    timed: true,
    timeLimit: 90 * 60, // seconds
    questions: [],
    currentQuestion: 0,
    answers: {},
    flagged: new Set(),
    selectedTopics: new Set(),
    startTime: null,
    timerInterval: null
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    hideLoadingScreen();
    setupEventListeners();
    populateTopics();
});

function hideLoadingScreen() {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 500);
}

function setupEventListeners() {
    // Exam type selection
    document.querySelectorAll('[data-type]').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('[data-type]').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            examState.examType = this.dataset.type;
            
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
}

function populateTopics() {
    const topics = [... new Set(tfQuestions.map(q => q.topic))];
    const grid = document.getElementById('topicGrid');
    
    grid.innerHTML = topics.map(topic => {
        const tfCount = tfQuestions.filter(q => q.topic === topic).length;
        const saCount = shortAnswerQuestions.filter(q => q.topic === topic).length;
        
        return `
            <div class="topic-card" data-topic="${topic}">
                <h4>${topic}</h4>
                <p>${tfCount} T/F, ${saCount} SA</p>
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
    let selectedTF = [];
    let selectedSA = [];
    
    if (examState.examType === 'full') {
        selectedTF = shuffleArray([...tfQuestions]).slice(0, 30);
        selectedSA = shuffleArray([...shortAnswerQuestions]).slice(0, 5);
    } else if (examState.examType === 'tf-practice') {
        selectedTF = shuffleArray([...tfQuestions]).slice(0, 50);
    } else if (examState.examType === 'sa-practice') {
        selectedSA = shuffleArray([...shortAnswerQuestions]).slice(0, 10);
    } else if (examState.examType === 'topic') {
        if (examState.selectedTopics.size === 0) {
            return;
        }
        const topicArray = Array.from(examState.selectedTopics);
        selectedTF = shuffleArray(tfQuestions.filter(q => topicArray.includes(q.topic))).slice(0, 30);
        selectedSA = shuffleArray(shortAnswerQuestions.filter(q => topicArray.includes(q.topic))).slice(0, 5);
    }
    
    examState.questions = [
        ...selectedTF.map(q => ({...q, type: 'tf'})),
        ...selectedSA.map(q => ({...q, type: 'sa'}))
    ];
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
    
    let html = `
        <div class="question-header">
            <div class="question-meta">
                <span class="meta-badge type">${question.type === 'tf' ? 'True/False' : 'Short Answer'}</span>
                <span class="meta-badge topic">${question.topic}</span>
                <span class="meta-badge">${question.difficulty || 'medium'}</span>
            </div>
            ${examState.flagged.has(examState.currentQuestion) ? '<span class="meta-badge" style="background: #f59e0b; color: white;">🚩 Flagged</span>' : ''}
        </div>
        <div class="question-text">${question.question}</div>
    `;
    
    if (question.type === 'tf') {
        const userAnswer = examState.answers[examState.currentQuestion];
        html += `
            <div class="tf-options">
                <button class="tf-button ${userAnswer === true ? 'selected' : ''}" onclick="selectAnswer(true)">
                    <span class="button-icon">✓</span>
                    <span>True</span>
                </button>
                <button class="tf-button ${userAnswer === false ? 'selected' : ''}" onclick="selectAnswer(false)">
                    <span class="button-icon">✗</span>
                    <span>False</span>
                </button>
            </div>
        `;
    } else {
        const userAnswer = examState.answers[examState.currentQuestion] || '';
        html += `
            <div class="short-answer-area">
                <textarea 
                    class="short-answer-input" 
                    placeholder="Type your answer here. Be thorough but concise. Consider including definitions, examples, and explanations."
                    oninput="saveShortAnswer(this.value)">${userAnswer}</textarea>
                <div class="char-count">${userAnswer.length} characters</div>
            </div>
        `;
    }
    
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
    displayQuestion();
}

function saveShortAnswer(text) {
    examState.answers[examState.currentQuestion] = text;
    updateStats();
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
    
    // Show results screen
    document.getElementById('examScreen').classList.remove('active');
    displayResults(results);
}

function calculateResults() {
    let tfCorrect = 0;
    let tfTotal = 0;
    let saAnswered = 0;
    let saTotal = 0;
    
    const review = [];
    
    examState.questions.forEach((question, index) => {
        const userAnswer = examState.answers[index];
        
        if (question.type === 'tf') {
            tfTotal++;
            const correct = userAnswer === question.answer;
            if (correct) tfCorrect++;
            
            review.push({
                index: index + 1,
                question: question.question,
                type: 'tf',
                userAnswer: userAnswer === undefined ? 'No answer' : (userAnswer ? 'True' : 'False'),
                correctAnswer: question.answer ? 'True' : 'False',
                correct: correct,
                explanation: question.explanation,
                topic: question.topic
            });
        } else {
            saTotal++;
            if (userAnswer && userAnswer.trim()) saAnswered++;
            
            review.push({
                index: index + 1,
                question: question.question,
                type: 'sa',
                userAnswer: userAnswer || 'No answer provided',
                sampleAnswer: question.sampleAnswer,
                points: question.points,
                topic: question.topic
            });
        }
    });
    
    const tfPercentage = tfTotal > 0 ? (tfCorrect / tfTotal) * 100 : 0;
    const overallScore = tfTotal > 0 ? tfPercentage : 0;
    
    return {
        tfCorrect,
        tfTotal,
        tfPercentage,
        saAnswered,
        saTotal,
        overallScore,
        review,
        timeSpent: Math.floor((Date.now() - examState.startTime) / 1000)
    };
}
