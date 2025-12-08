# CS173 Multiple Choice Questions Manifest

## Parsing Summary
**Source File**: `/Users/rishidave/Documents/CS171-FinalsStudyGuide/Practice questions CS173.txt`

**Total Questions Extracted**: 200
**Number of Topic Files Created**: 10
**Question ID Range**: MC 1 - MC 200

---

## File Structure

All files are located in: `/Users/rishidave/Documents/CS171-FinalsStudyGuide/js/`

### Topic Files Created

| File Name | Topic | Questions | Question IDs |
|-----------|-------|-----------|--------------|
| `multiplechoice_topic1_regex_bpe.json` | Regular Expressions, Text Processing, and BPE | 19 | MC 1-11, MC 101-108 |
| `multiplechoice_topic2_ngram_smoothing.json` | N-gram Language Models, Smoothing, and Perplexity | 16 | MC 12-20, MC 109-115 |
| `multiplechoice_topic3_classification_loss.json` | Classification, Loss, and Gradient Descent | 16 | MC 21-29, MC 116-122 |
| `multiplechoice_topic4_vector_semantics.json` | Vector Semantics and Embeddings (TF-IDF, Word2Vec) | 16 | MC 30-39, MC 123-128 |
| `multiplechoice_topic5_deep_sequential.json` | Deep Sequential Models (MLP, RNN, LSTM) | 15 | MC 40-48, MC 129-134 |
| `multiplechoice_topic6_seq2seq_attention.json` | Seq2Seq, Decoding, and Attention | 12 | MC 49-55, MC 135-139 |
| `multiplechoice_topic7_transformers.json` | Transformers and Pretrained Language Models | 17 | MC 56-66, MC 140-145 |
| `multiplechoice_topic8_modern_llm.json` | Modern LLM Techniques and Alignment | 13 | MC 67-74, MC 146-150 |
| `multiplechoice_topic9_advanced_concepts.json` | Advanced Concepts and Applications | 26 | MC 75-100 |
| `multiplechoice_topic10_comprehensive_review.json` | Comprehensive Review - All Topics | 50 | MC 151-200 |

---

## JSON Format

Each file follows this structure:

```json
{
  "topic": "Topic Name",
  "questionType": "multiplechoice",
  "questions": [
    {
      "id": "MC 1",
      "topic": "Subtopic",
      "question": "Question text...",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "answer": "B",
      "reasoning": "Explanation of the correct answer"
    }
  ]
}
```

---

## Topic Breakdown

### Topic 1: Regular Expressions, Text Processing, and BPE (19 questions)
- Regular expression patterns and operators
- Text normalization and tokenization
- Byte Pair Encoding (BPE) algorithm
- Morphemes, clitics, and lemmatization
- Heaps' Law

### Topic 2: N-gram Language Models, Smoothing, and Perplexity (16 questions)
- Maximum Likelihood Estimation (MLE)
- Markov Assumption
- Add-1 (Laplace) smoothing
- Interpolation and backoff
- Perplexity calculation
- Log space computation

### Topic 3: Classification, Loss, and Gradient Descent (16 questions)
- Sigmoid and Softmax activation functions
- Binary and multi-class classification
- Cross-Entropy Loss
- Logistic regression
- Stochastic Gradient Descent (SGD)
- Hyperparameters and convexity

### Topic 4: Vector Semantics and Embeddings (16 questions)
- TF-IDF (Term Frequency-Inverse Document Frequency)
- Cosine similarity vs. dot product
- Word2Vec and Skip-Gram with Negative Sampling (SGNS)
- Dense vs. sparse embeddings
- Distributional Hypothesis
- Context window size effects

### Topic 5: Deep Sequential Models (15 questions)
- Feedforward Neural Networks (FNN)
- Activation functions (ReLU, Tanh, Sigmoid)
- Recurrent Neural Networks (RNN)
- Vanishing and exploding gradients
- Backpropagation Through Time (BPTT)
- LSTM (Long Short-Term Memory)
- Dropout regularization

### Topic 6: Seq2Seq, Decoding, and Attention (12 questions)
- Encoder-Decoder architecture
- Information bottleneck problem
- Greedy decoding vs. Beam search
- BLEU score and Brevity Penalty
- Attention mechanism
- Query, Key, Value vectors

### Topic 7: Transformers and Pretrained Language Models (17 questions)
- Self-Attention mechanism
- Positional Encoding
- Multi-Head Attention
- Scaled dot-product attention
- BERT (Encoder-only)
- GPT (Decoder-only)
- BART/T5 (Encoder-Decoder)
- Masked Language Modeling (MLM)
- Next Sentence Prediction (NSP)
- Causal masking

### Topic 8: Modern LLM Techniques and Alignment (13 questions)
- In-Context Learning (ICL)
- Instruction Tuning / Supervised Fine-Tuning (SFT)
- Chain-of-Thought (CoT) prompting
- Reinforcement Learning from Human Feedback (RLHF)
- Reward Model (RM)
- Proximal Policy Optimization (PPO)
- Reward hacking
- Emergent abilities

### Topic 9: Advanced Concepts and Applications (26 questions)
- Course logistics and academic integrity
- Types vs. Tokens
- Perplexity calculations
- Machine Translation evaluation
- Chain Rule of Probability
- BERT pretraining details
- Few-shot learning vs. ICL
- Heaps' Law
- RNN hidden state mechanics
- Clitics and morphemes
- LLM training pipeline

### Topic 10: Comprehensive Review (50 questions)
- Mixed questions covering all topics
- Reinforces key concepts from Topics 1-9
- Includes additional questions on:
  - N-gram models and Markov assumptions
  - Transformer components
  - BERT and GPT architecture details
  - RLHF pipeline steps
  - Word embeddings and semantic similarity
  - Neural network optimization
  - Smoothing techniques
  - Loss functions and backpropagation

---

## Parsing Notes

### Source File Structure
The source file contained two main sections:
1. **First Section** (Lines 1-483): Questions 1-100 organized by 11 topic sections (I-XI)
2. **Second Section** (Lines 484-1018): "Extensive Practice Question Database" with an additional 100 questions

### Question Numbering
- Original file had questions numbered 1-100 in each section
- Converted to unique IDs MC 1 through MC 200 for the exam system
- Questions from the first section: MC 1-100
- Questions from the second section: MC 101-200

### Data Quality
- All 200 questions successfully parsed
- Each question includes:
  - Unique ID
  - Topic classification
  - Question text
  - Four multiple choice options (A, B, C, D)
  - Correct answer
  - Reasoning/explanation (where available from source)

### Topic Organization
Questions were grouped by their natural topic sections from the source file, with some consolidation to create balanced topic files suitable for the exam interface.

---

## Integration with Exam System

These files follow the same JSON structure as the existing CS171 question files and can be integrated into the exam system using the same loading mechanisms.

To use these questions in the exam interface:
1. Files are already in the correct location: `/js/`
2. Update `questions.js` to include these new files
3. Questions will be available for practice with their topic-based organization

---

**Parsing Completed**: December 8, 2024
**Total Questions**: 200
**Total Files**: 10
**All questions verified with unique IDs from MC 1 to MC 200**
