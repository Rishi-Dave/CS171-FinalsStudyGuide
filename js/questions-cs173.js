// ============================================
// CS173 NLP Exam - Question Loading System
// Loads and standardizes multiple choice questions from JSON files
// ============================================

/**
 * Question Bank Manager - Loads questions from multiple JSON files
 */
const QuestionBank = {
    // Metadata about question files
    metadata: {
        multiplechoiceFiles: [
            'multiplechoice_topic1_regex_bpe.json',
            'multiplechoice_topic2_ngram_smoothing.json',
            'multiplechoice_topic3_classification_loss.json',
            'multiplechoice_topic4_vector_semantics.json',
            'multiplechoice_topic5_deep_sequential.json',
            'multiplechoice_topic6_seq2seq_attention.json',
            'multiplechoice_topic7_transformers.json',
            'multiplechoice_topic8_modern_llm.json',
            'multiplechoice_topic9_advanced_concepts.json',
            'multiplechoice_topic10_comprehensive_review.json'
        ],
        baseDir: 'js/'
    },

    // Loaded questions
    questions: {
        multiplechoice: [],
        all: []
    },

    // Topics available
    topics: new Set(),

    /**
     * Initialize and load all questions
     */
    async init() {
        console.log('📚 Loading CS173 NLP question bank...');
        const startTime = performance.now();

        try {
            // Load multiple choice questions
            await this.loadMultipleChoiceQuestions();

            // Combine all questions
            this.questions.all = [...this.questions.multiplechoice];

            // Extract unique topics
            this.extractTopics();

            const loadTime = (performance.now() - startTime).toFixed(2);
            console.log(`✅ Question bank loaded successfully in ${loadTime}ms`);
            console.log(`   Multiple Choice: ${this.questions.multiplechoice.length}`);
            console.log(`   Total Questions: ${this.questions.all.length}`);
            console.log(`   Topics: ${this.topics.size}`);

            return true;
        } catch (error) {
            console.error('❌ Error loading question bank:', error);
            return false;
        }
    },

    /**
     * Load multiple choice questions from JSON files
     */
    async loadMultipleChoiceQuestions() {
        const promises = this.metadata.multiplechoiceFiles.map(filename =>
            this.loadJSONFile(this.metadata.baseDir + filename)
        );

        const results = await Promise.all(promises);

        for (const data of results) {
            if (data && data.questions) {
                // Standardize question format
                const standardized = data.questions.map(q => ({
                    id: q.id,
                    topic: q.topic || data.topic || 'General',
                    question: q.question,
                    options: q.options, // { A: "...", B: "...", C: "...", D: "..." }
                    answer: q.answer, // "A", "B", "C", or "D"
                    reasoning: q.reasoning || '',
                    type: 'multiplechoice'
                }));

                this.questions.multiplechoice.push(...standardized);
            }
        }

        console.log(`   Loaded ${this.questions.multiplechoice.length} multiple choice questions from ${this.metadata.multiplechoiceFiles.length} files`);
    },

    /**
     * Load a single JSON file
     */
    async loadJSONFile(filepath) {
        try {
            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`❌ Error loading ${filepath}:`, error);
            return null;
        }
    },

    /**
     * Extract unique topics from questions
     */
    extractTopics() {
        this.topics.clear();
        this.questions.all.forEach(q => {
            if (q.topic) {
                this.topics.add(q.topic);
            }
        });
    },

    /**
     * Get questions by topic
     */
    getQuestionsByTopic(topic) {
        return this.questions.all.filter(q => q.topic === topic);
    },

    /**
     * Get questions by type
     */
    getQuestionsByType(type) {
        if (type === 'multiplechoice') {
            return this.questions.multiplechoice;
        }
        return [];
    },

    /**
     * Get random questions
     */
    getRandomQuestions(count, type = 'all') {
        let pool = type === 'all' ? this.questions.all : this.getQuestionsByType(type);

        // Shuffle and take first N
        pool = this.shuffleArray([...pool]);
        return pool.slice(0, count);
    },

    /**
     * Shuffle array (Fisher-Yates algorithm)
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    /**
     * Get all topics as array
     */
    getTopics() {
        return Array.from(this.topics).sort();
    },

    /**
     * Get statistics about question bank
     */
    getStats() {
        return {
            total: this.questions.all.length,
            multiplechoice: this.questions.multiplechoice.length,
            topics: this.topics.size,
            topicList: this.getTopics()
        };
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        const success = await QuestionBank.init();
        if (success) {
            // Hide loading screen
            document.getElementById('loadingScreen').style.display = 'none';
        } else {
            // Show error message
            document.getElementById('loadingScreen').innerHTML = `
                <div class="loading-content">
                    <h2>❌ Error Loading Questions</h2>
                    <p>Please refresh the page to try again</p>
                </div>
            `;
        }
    });
} else {
    QuestionBank.init().then(success => {
        if (success) {
            document.getElementById('loadingScreen').style.display = 'none';
        }
    });
}

// Expose globally
window.QuestionBank = QuestionBank;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionBank;
}
