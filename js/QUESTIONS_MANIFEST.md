# CS171 Finals Study Guide - Questions Manifest

## Overview
All practice questions from "All Practice Questions CS171.txt" have been successfully parsed and organized into separate JSON files by topic.

**Total Questions Extracted: 538**
- Short Answer Questions: 54
- True/False Questions: 484

---

## Short Answer Questions (54 Total)

### Topic 1: ML Introduction, Data, and Preprocessing
**File:** `shortanswer_topic1_intro_data_preprocessing.json`
- **Questions:** SA 1-12 (12 questions)
- **Topics Covered:** ML Intro, Data Stats, Data Viz, Data Prep, Clustering, Sampling, Data Dist

### Topic 2: Supervised Learning Methods
**File:** `shortanswer_topic2_supervised_learning.json`
- **Questions:** SA 13-30 (18 questions)
- **Topics Covered:** Linear Regression, Gradient Descent, Evaluation, Naïve Bayes, k-NN, SVM, Logistic Regression, Regularization, Decision Trees, Ensemble, Neural Nets

### Topic 3: Unsupervised Learning Methods
**File:** `shortanswer_topic3_unsupervised_learning.json`
- **Questions:** SA 31-49 (19 questions)
- **Topics Covered:** K-Means, K-Medoids, Hierarchical Clustering, Dimensionality Reduction, SVD, Data Dist, Autoencoders, DBSCAN, Evaluation, Neural Nets, Collaborative Filtering

### Topic 4: Frequent Pattern Mining & Association Rules
**File:** `shortanswer_topic4_frequent_patterns.json`
- **Questions:** SA 50-54 (5 questions)
- **Topics Covered:** Max-Patterns, Apriori Property, Lift, Null Invariance, Support & Confidence

---

## True/False Questions (484 Total)

### Topic 1: Introduction, Logistics, and Data Types
**File:** `truefalse_topic1_intro_logistics.json`
- **Questions:** T/F 1-55 (55 questions)
- **Topics Covered:** Course logistics, academic integrity, ML basics, data types, data mining concepts, distance metrics, similarity measures

### Topic 2: Basic Statistics and Visualization
**File:** `truefalse_topic2_statistics_viz.json`
- **Questions:** T/F 56-105 (50 questions)
- **Topics Covered:** Statistical measures (mean, median, mode), distributions, skewness, variance, IQR, histograms, boxplots, scatter plots, correlation, PCA, t-SNE, Anscombe's Quartet, bias-variance tradeoff

### Topic 3: Data Preprocessing
**File:** `truefalse_topic3_preprocessing.json`
- **Questions:** T/F 106-170 (65 questions)
- **Topics Covered:** Data cleaning, missing values, data integration, entity resolution, dimensionality reduction, curse of dimensionality, feature selection, sampling methods, reservoir sampling, stratified sampling, normalization (min-max, z-score, log), wavelets, Fourier transforms, TF-IDF

### Topic 4: Supervised Learning I
**File:** `truefalse_topic4_supervised1.json`
- **Questions:** T/F 171-240 (70 questions)
- **Topics Covered:** Linear regression, gradient descent (BGD/SGD), learning rate, LMS rule, decision trees (ID3, C4.5, CART), information gain, Gini index, entropy, overfitting/underfitting, prepruning/postpruning, complexity classes (P, NP, NP-Hard)

### Topic 5: Supervised Learning II
**File:** `truefalse_topic5_supervised2.json`
- **Questions:** T/F 241-310 (70 questions)
- **Topics Covered:** Bayesian classification, Naïve Bayes, conditional independence, Laplacian correction, k-NN (lazy vs eager learning), distance-weighted k-NN, logistic regression, sigmoid function, maximum likelihood, regularization (Ridge/L2, Lasso/L1), generative vs discriminative models

### Topic 6: Supervised Learning Advanced & Evaluation
**File:** `truefalse_topic6_supervised_advanced.json`
- **Questions:** T/F 311-380 (70 questions)
- **Topics Covered:** Evaluation metrics (accuracy, precision, recall, F-score, sensitivity, specificity), cross-validation (k-fold, leave-one-out, stratified), t-test, perceptron, neural networks, backpropagation, SVM, kernel trick, support vectors, ensemble methods (bagging, random forests), class imbalance (SMOTE), transfer learning, LIME, CNNs, precision-recall curves

### Topic 7: Unsupervised Learning I
**File:** `truefalse_topic7_unsupervised1.json`
- **Questions:** T/F 381-435 (55 questions)
- **Topics Covered:** Clustering fundamentals, K-means (Lloyd's algorithm, SSE, K-means++, complexity), K-medoids (PAM), hierarchical clustering (AGNES, DIANA, single linkage, complete linkage, MST equivalence), dendrogram, hard vs soft clustering, Voronoi diagrams

### Topic 8: Unsupervised Learning - Density & Evaluation
**File:** `truefalse_topic8_density_eval.json`
- **Questions:** T/F 436-480 (45 questions)
- **Topics Covered:** DBSCAN (core points, border points, density-reachable, density-connected, noise), LOF (Local Outlier Factor), clustering evaluation (intrinsic vs extrinsic), Silhouette Coefficient, Hopkins Statistic, elbow method, homogeneity, completeness, NMI, SVD/PCA (Eckart Young Theorem), LSI, NMF, autoencoders, collaborative filtering, fraud detection

### Topic 9: Frequent Pattern Mining & Association Rules
**File:** `truefalse_topic9_pattern_mining.json`
- **Questions:** T/F 481-484 (4 questions)
- **Topics Covered:** Frequent itemsets, support, confidence, association rule mining process

---

## JSON File Structure

### Short Answer Format
```json
{
  "topic": "Topic Name",
  "questionType": "shortanswer",
  "questions": [
    {
      "id": "SA X",
      "topic": "Subtopic",
      "question": "Question text...",
      "reasoning": "Answer/explanation..."
    }
  ]
}
```

### True/False Format
```json
{
  "topic": "Topic Name",
  "questionType": "truefalse",
  "questions": [
    {
      "id": "T/F X",
      "topic": "Subtopic",
      "question": "Question text...",
      "answer": true/false,
      "reasoning": "Explanation..."
    }
  ]
}
```

---

## File Locations
All JSON files are located in:
```
/Users/rishidave/Documents/CS171-FinalsStudyGuide/js/
```

## Usage Notes
- All questions have been extracted with their complete information
- Questions are organized by topic for easy study and review
- JSON format allows for easy integration into web applications or study tools
- Each question includes its original ID, topic, question text, and reasoning/answer

## Data Quality
- All 54 Short Answer questions successfully parsed
- All 484 True/False questions successfully parsed
- Question IDs preserved from original source
- Topic classifications maintained
- Answers and reasoning captured for all questions

---

Generated on: 2025-12-07
Source File: All Practice Questions CS171.txt
