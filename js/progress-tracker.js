// ============================================
// CS171 ML Exam - Progress Tracking System
// Tracks performance, identifies weak areas, and personalizes learning
// ============================================

/**
 * Progress Tracker - Manages user performance data and learning analytics
 */
const ProgressTracker = {
    // Storage key
    STORAGE_KEY: 'cs171_exam_progress',

    // Data structure
    data: {
        version: '1.0',
        lastUpdated: null,
        statistics: {
            totalQuestions: 0,
            totalCorrect: 0,
            totalIncorrect: 0,
            totalSkipped: 0,
            averageScore: 0
        },
        questionHistory: {}, // questionId -> { attempts, correct, incorrect, lastAttempt, avgTime }
        topicPerformance: {}, // topic -> { total, correct, incorrect, avgScore }
        sessions: [], // Array of exam sessions
        weakTopics: [], // Topics that need more practice
        masteredTopics: [] // Topics with high accuracy
    },

    /**
     * Initialize the progress tracker
     */
    init() {
        this.load();
        console.log('📊 ProgressTracker initialized');
        console.log(`   Total questions attempted: ${this.data.statistics.totalQuestions}`);
        console.log(`   Average score: ${this.data.statistics.averageScore.toFixed(1)}%`);
        return this;
    },

    /**
     * Load data from localStorage
     */
    load() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const loaded = JSON.parse(stored);
                // Merge with default structure to handle version updates
                this.data = { ...this.data, ...loaded };
                console.log('✅ Progress data loaded from storage');
            } else {
                console.log('📝 No previous progress data found - starting fresh');
            }
        } catch (error) {
            console.error('❌ Error loading progress data:', error);
            // Keep default data
        }
    },

    /**
     * Save data to localStorage
     */
    save() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            console.log('💾 Progress data saved');
        } catch (error) {
            console.error('❌ Error saving progress data:', error);
        }
    },

    /**
     * Record a question attempt
     */
    recordAttempt(questionId, topic, isCorrect, timeSpent = 0) {
        const qid = String(questionId);

        // Initialize question history if needed
        if (!this.data.questionHistory[qid]) {
            this.data.questionHistory[qid] = {
                attempts: 0,
                correct: 0,
                incorrect: 0,
                lastAttempt: null,
                avgTime: 0,
                topic: topic
            };
        }

        // Update question history
        const qHistory = this.data.questionHistory[qid];
        qHistory.attempts++;
        qHistory.lastAttempt = new Date().toISOString();

        if (isCorrect) {
            qHistory.correct++;
        } else {
            qHistory.incorrect++;
        }

        // Update average time
        qHistory.avgTime = ((qHistory.avgTime * (qHistory.attempts - 1)) + timeSpent) / qHistory.attempts;

        // Update topic performance
        this.updateTopicPerformance(topic, isCorrect);

        // Update global statistics
        this.updateGlobalStats(isCorrect);

        // Save after each attempt
        this.save();
    },

    /**
     * Update topic performance metrics
     */
    updateTopicPerformance(topic, isCorrect) {
        if (!this.data.topicPerformance[topic]) {
            this.data.topicPerformance[topic] = {
                total: 0,
                correct: 0,
                incorrect: 0,
                avgScore: 0
            };
        }

        const topicData = this.data.topicPerformance[topic];
        topicData.total++;

        if (isCorrect) {
            topicData.correct++;
        } else {
            topicData.incorrect++;
        }

        topicData.avgScore = (topicData.correct / topicData.total) * 100;

        // Update weak/mastered topics
        this.categorizeTopics();
    },

    /**
     * Update global statistics
     */
    updateGlobalStats(isCorrect) {
        this.data.statistics.totalQuestions++;

        if (isCorrect) {
            this.data.statistics.totalCorrect++;
        } else {
            this.data.statistics.totalIncorrect++;
        }

        this.data.statistics.averageScore =
            (this.data.statistics.totalCorrect / this.data.statistics.totalQuestions) * 100;
    },

    /**
     * Record a complete exam session
     */
    recordSession(sessionData) {
        const session = {
            timestamp: new Date().toISOString(),
            examType: sessionData.examType || 'unknown',
            totalQuestions: sessionData.totalQuestions || 0,
            correctAnswers: sessionData.correctAnswers || 0,
            score: sessionData.score || 0,
            timeSpent: sessionData.timeSpent || 0,
            topicBreakdown: sessionData.topicBreakdown || {}
        };

        this.data.sessions.push(session);

        // Keep only last 50 sessions to avoid storage bloat
        if (this.data.sessions.length > 50) {
            this.data.sessions = this.data.sessions.slice(-50);
        }

        this.save();
    },

    /**
     * Categorize topics into weak/mastered based on performance
     */
    categorizeTopics() {
        this.data.weakTopics = [];
        this.data.masteredTopics = [];

        for (const [topic, performance] of Object.entries(this.data.topicPerformance)) {
            // Need at least 5 attempts to categorize
            if (performance.total < 5) continue;

            if (performance.avgScore >= 80) {
                this.data.masteredTopics.push({
                    topic: topic,
                    score: performance.avgScore,
                    total: performance.total
                });
            } else if (performance.avgScore < 60) {
                this.data.weakTopics.push({
                    topic: topic,
                    score: performance.avgScore,
                    total: performance.total
                });
            }
        }

        // Sort by score
        this.data.weakTopics.sort((a, b) => a.score - b.score);
        this.data.masteredTopics.sort((a, b) => b.score - a.score);
    },

    /**
     * Get smart question selection weights
     * Returns multiplier for each topic (higher = more likely to be selected)
     */
    getTopicWeights() {
        const weights = {};

        for (const [topic, performance] of Object.entries(this.data.topicPerformance)) {
            if (performance.total === 0) {
                // Never seen - high priority
                weights[topic] = 3.0;
            } else if (performance.avgScore < 50) {
                // Weak area - highest priority
                weights[topic] = 5.0;
            } else if (performance.avgScore < 70) {
                // Needs improvement - high priority
                weights[topic] = 3.0;
            } else if (performance.avgScore < 85) {
                // Moderate - normal priority
                weights[topic] = 1.5;
            } else {
                // Mastered - lower priority (but still review)
                weights[topic] = 0.5;
            }
        }

        return weights;
    },

    /**
     * Select questions intelligently based on performance
     */
    selectQuestions(allQuestions, count, options = {}) {
        const {
            favorWeakTopics = true,
            excludeRecent = true,
            excludeRecentCount = 20
        } = options;

        const weights = this.getTopicWeights();
        const now = new Date().getTime();
        const ONE_HOUR = 60 * 60 * 1000;

        // Filter and score questions
        const scoredQuestions = allQuestions.map(q => {
            const qid = String(q.id);
            const history = this.data.questionHistory[qid];

            let score = 1.0;

            // Topic weight
            if (favorWeakTopics && weights[q.topic]) {
                score *= weights[q.topic];
            }

            // Penalize recently answered questions
            if (excludeRecent && history && history.lastAttempt) {
                const timeSinceAttempt = now - new Date(history.lastAttempt).getTime();
                if (timeSinceAttempt < ONE_HOUR) {
                    score *= 0.1; // Heavy penalty for very recent
                } else if (timeSinceAttempt < 24 * ONE_HOUR) {
                    score *= 0.5; // Moderate penalty for recent
                }
            }

            // Favor questions never attempted or frequently missed
            if (!history) {
                score *= 2.0; // Never seen
            } else if (history.attempts > 0) {
                const errorRate = history.incorrect / history.attempts;
                if (errorRate > 0.5) {
                    score *= 2.5; // Frequently missed
                } else if (errorRate > 0.3) {
                    score *= 1.5; // Sometimes missed
                } else if (errorRate === 0) {
                    score *= 0.8; // Always correct (lower priority)
                }
            }

            return { question: q, score: score };
        });

        // Sort by score (descending) and take top N
        scoredQuestions.sort((a, b) => b.score - a.score);

        // Add some randomness to avoid always picking the same questions
        const topCandidates = scoredQuestions.slice(0, Math.min(count * 3, scoredQuestions.length));
        const selected = [];

        while (selected.length < count && topCandidates.length > 0) {
            // Weighted random selection from top candidates
            const weights = topCandidates.map(sq => sq.score);
            const totalWeight = weights.reduce((sum, w) => sum + w, 0);
            let random = Math.random() * totalWeight;

            for (let i = 0; i < topCandidates.length; i++) {
                random -= weights[i];
                if (random <= 0) {
                    selected.push(topCandidates[i].question);
                    topCandidates.splice(i, 1);
                    break;
                }
            }
        }

        console.log(`🎯 Smart selection: ${selected.length} questions prioritizing weak areas`);
        return selected;
    },

    /**
     * Get questions that were answered incorrectly
     */
    getIncorrectQuestions(allQuestions, limit = 20) {
        const incorrect = [];

        for (const q of allQuestions) {
            const qid = String(q.id);
            const history = this.data.questionHistory[qid];

            if (history && history.incorrect > 0) {
                const errorRate = history.incorrect / history.attempts;
                incorrect.push({
                    question: q,
                    errorRate: errorRate,
                    attempts: history.attempts
                });
            }
        }

        // Sort by error rate (descending), then by attempts (descending)
        incorrect.sort((a, b) => {
            if (b.errorRate !== a.errorRate) {
                return b.errorRate - a.errorRate;
            }
            return b.attempts - a.attempts;
        });

        return incorrect.slice(0, limit).map(item => item.question);
    },

    /**
     * Get analytics summary
     */
    getAnalytics() {
        return {
            overall: {
                totalQuestions: this.data.statistics.totalQuestions,
                totalCorrect: this.data.statistics.totalCorrect,
                totalIncorrect: this.data.statistics.totalIncorrect,
                averageScore: this.data.statistics.averageScore,
                totalSessions: this.data.sessions.length
            },
            topicPerformance: Object.entries(this.data.topicPerformance)
                .map(([topic, perf]) => ({
                    topic: topic,
                    total: perf.total,
                    correct: perf.correct,
                    incorrect: perf.incorrect,
                    avgScore: perf.avgScore
                }))
                .sort((a, b) => b.avgScore - a.avgScore),
            weakTopics: this.data.weakTopics,
            masteredTopics: this.data.masteredTopics,
            recentSessions: this.data.sessions.slice(-10).reverse()
        };
    },

    /**
     * Reset all progress data
     */
    reset() {
        if (confirm('Are you sure you want to reset all progress data? This cannot be undone.')) {
            localStorage.removeItem(this.STORAGE_KEY);
            // Reset to defaults
            this.data = {
                version: '1.0',
                lastUpdated: null,
                statistics: {
                    totalQuestions: 0,
                    totalCorrect: 0,
                    totalIncorrect: 0,
                    totalSkipped: 0,
                    averageScore: 0
                },
                questionHistory: {},
                topicPerformance: {},
                sessions: [],
                weakTopics: [],
                masteredTopics: []
            };
            console.log('🔄 Progress data reset');
            return true;
        }
        return false;
    },

    /**
     * Export progress data as JSON
     */
    export() {
        return JSON.stringify(this.data, null, 2);
    },

    /**
     * Import progress data from JSON
     */
    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.data = imported;
            this.save();
            console.log('✅ Progress data imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Error importing progress data:', error);
            return false;
        }
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ProgressTracker.init();
    });
} else {
    ProgressTracker.init();
}

// Expose globally
window.ProgressTracker = ProgressTracker;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressTracker;
}
