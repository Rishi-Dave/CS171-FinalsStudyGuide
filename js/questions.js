// ============================================
// CS171 ML Exam - Master Question Loader
// Consolidates all JSON question files
// ============================================

// Global arrays (required by exam.js)
let window_tfQuestions = [];
let window_shortAnswerQuestions = [];

// Track loading status
let questionsLoaded = false;
let loadingErrors = [];

/**
 * Loader for all question JSON files
 * Handles multiple file formats and consolidates into standard format
 */
const QuestionLoader = {
    // Metadata - Updated to use new topic-based JSON files
    metadata: {
        truefalseFiles: [
            'truefalse_topic1_intro_logistics.json',
            'truefalse_topic2_statistics_viz.json',
            'truefalse_topic3_preprocessing.json',
            'truefalse_topic4_supervised1.json',
            'truefalse_topic5_supervised2.json',
            'truefalse_topic6_supervised_advanced.json',
            'truefalse_topic7_unsupervised1.json',
            'truefalse_topic8_density_eval.json',
            'truefalse_topic9_pattern_mining.json'
        ],
        shortAnswerFiles: [
            'shortanswer_topic1_intro_data_preprocessing.json',
            'shortanswer_topic2_supervised_learning.json',
            'shortanswer_topic3_unsupervised_learning.json',
            'shortanswer_topic4_frequent_patterns.json'
        ],
        baseDir: 'js/'
    },

    /**
     * Main initialization function
     */
    async init() {
        console.log('🚀 QuestionLoader: Starting to load questions...');

        try {
            // Load all questions in parallel
            const [tfQuestions, saQuestions] = await Promise.all([
                this.loadAllTruefalseQuestions(),
                this.loadAllShortAnswerQuestions()
            ]);

            // Combine results
            window_tfQuestions = tfQuestions;
            window_shortAnswerQuestions = saQuestions;

            // Expose globally (required by exam.js)
            window.tfQuestions = window_tfQuestions;
            window.shortAnswerQuestions = window_shortAnswerQuestions;

            questionsLoaded = true;

            // Log summary
            console.log(`✅ QuestionLoader: Successfully loaded ${tfQuestions.length} T/F questions`);
            console.log(`✅ QuestionLoader: Successfully loaded ${saQuestions.length} Short Answer questions`);
            console.log(`📊 Total: ${tfQuestions.length + saQuestions.length} questions`);

            // Trigger event for other scripts
            window.dispatchEvent(new Event('questionsLoaded'));

            return true;
        } catch (error) {
            console.error('❌ QuestionLoader: Fatal error during initialization', error);
            questionsLoaded = false;
            return false;
        }
    },

    /**
     * Load all true/false question files and consolidate
     */
    async loadAllTruefalseQuestions() {
        console.log('📝 Loading True/False questions...');

        const allQuestions = [];
        const seenQuestions = new Set(); // For deduplication
        let processedCount = 0;

        for (const file of this.metadata.truefalseFiles) {
            try {
                const url = this.metadata.baseDir + file;
                const data = await this.fetchJSON(url);

                // Extract questions from new format
                const questions = data.questions || [];

                if (questions.length === 0) {
                    console.warn(`⚠️  No questions found in ${file}`);
                    continue;
                }

                // Process and deduplicate
                for (const q of questions) {
                    const qText = q.question.toLowerCase().trim();

                    if (seenQuestions.has(qText)) {
                        console.log(`ℹ️ Skipping duplicate: "${q.question.substring(0, 50)}..."`);
                        continue;
                    }

                    seenQuestions.add(qText);

                    // Standardize format
                    const standardized = {
                        id: allQuestions.length + 1, // Reassign IDs sequentially
                        topic: this.standardizeTopic(q.topic || 'General'),
                        question: q.question,
                        answer: String(q.answer).toLowerCase() === 'true' || q.answer === true || q.answer === 1,
                        explanation: q.reasoning || q.explanation || '',
                        difficulty: q.difficulty || 'medium'
                    };

                    allQuestions.push(standardized);
                    processedCount++;
                }

                console.log(`✓ ${file}: ${questions.length} questions (${processedCount} total)`);

            } catch (error) {
                console.error(`❌ Error loading ${file}:`, error.message);
                loadingErrors.push(`${file}: ${error.message}`);
            }
        }

        console.log(`📊 True/False: ${allQuestions.length} questions loaded`);
        return allQuestions;
    },

    /**
     * Load all short answer question files and consolidate
     */
    async loadAllShortAnswerQuestions() {
        console.log('📝 Loading Short Answer questions...');

        const allQuestions = [];
        let processedCount = 0;

        for (const file of this.metadata.shortAnswerFiles) {
            try {
                const url = this.metadata.baseDir + file;
                const data = await this.fetchJSON(url);

                // Extract questions
                const questions = data.questions || [];

                for (const q of questions) {
                    // Standardize format - add points field
                    const standardized = {
                        id: allQuestions.length + 1,
                        topic: this.standardizeTopic(q.topic || 'General'),
                        question: q.question,
                        sampleAnswer: q.reasoning || q.answer || '',
                        points: q.points || 5, // Default 5 points if not specified
                        keyPoints: q.key_points || q.keyPoints || []
                    };

                    allQuestions.push(standardized);
                    processedCount++;
                }

                console.log(`✓ ${file}: ${questions.length} questions (${processedCount} total)`);

            } catch (error) {
                console.error(`❌ Error loading ${file}:`, error.message);
                loadingErrors.push(`${file}: ${error.message}`);
            }
        }

        console.log(`📊 Short Answer: ${allQuestions.length} questions loaded`);
        return allQuestions;
    },

    /**
     * Fetch and parse JSON file
     */
    async fetchJSON(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            throw error;
        }
    },

    /**
     * Standardize topic names
     */
    standardizeTopic(topic) {
        const topicMap = {
            'data basics': 'Data Types & Attributes',
            'data preprocessing': 'Data Preprocessing & Feature Engineering',
            'preprocessing': 'Data Preprocessing & Feature Engineering',
            'feature engineering': 'Data Preprocessing & Feature Engineering',
            'supervised learning': 'Supervised Learning',
            'supervised': 'Supervised Learning',
            'decision trees': 'Supervised Learning',
            'naive bayes': 'Supervised Learning',
            'knn': 'Supervised Learning',
            'k-nn': 'Supervised Learning',
            'regression': 'Supervised Learning',
            'classification': 'Supervised Learning',
            'linear regression': 'Supervised Learning',
            'logistic regression': 'Supervised Learning',
            'svm': 'Supervised Learning',
            'support vector': 'Supervised Learning',
            'model evaluation': 'Model Evaluation',
            'evaluation': 'Model Evaluation',
            'bias variance': 'Advanced Supervised',
            'regularization': 'Advanced Supervised',
            'ensemble': 'Advanced Supervised',
            'neural networks': 'Advanced Supervised',
            'boosting': 'Advanced Supervised',
            'bagging': 'Advanced Supervised',
            'unsupervised learning': 'Unsupervised Learning',
            'unsupervised': 'Unsupervised Learning',
            'clustering': 'Unsupervised Learning',
            'k-means': 'Unsupervised Learning',
            'hierarchical clustering': 'Unsupervised Learning',
            'dbscan': 'Unsupervised Learning',
            'dimensionality reduction': 'Advanced Unsupervised',
            'pca': 'Advanced Unsupervised',
            'pattern mining': 'Association Rules & Pattern Mining',
            'association rules': 'Association Rules & Pattern Mining',
            'apriori': 'Association Rules & Pattern Mining',
            'introduction': 'Introduction & ML Basics',
            'basics': 'Introduction & ML Basics',
            'ml basics': 'Introduction & ML Basics'
        };

        const normalized = topic.toLowerCase().trim();
        return topicMap[normalized] || topic; // Return original if no mapping found
    },

    /**
     * Get loading status
     */
    getStatus() {
        return {
            loaded: questionsLoaded,
            tfCount: window_tfQuestions.length,
            saCount: window_shortAnswerQuestions.length,
            totalCount: window_tfQuestions.length + window_shortAnswerQuestions.length,
            errors: loadingErrors
        };
    },

    /**
     * Get error report
     */
    getErrors() {
        return loadingErrors;
    }
};

/**
 * Initialize on script load
 * This runs immediately when questions.js is loaded
 */
(async function initialize() {
    // Wait for DOM to be ready, then load questions
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await QuestionLoader.init();
        });
    } else {
        // DOM already ready, load immediately
        await QuestionLoader.init();
    }
})();

// Also expose globally for manual access
window.QuestionLoader = QuestionLoader;

/**
 * Export for use in other scripts
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionLoader;
}
