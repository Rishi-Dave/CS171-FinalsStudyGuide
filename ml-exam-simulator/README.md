# CS171 Machine Learning Final Exam Simulator

A comprehensive, professional web-based exam simulator designed to help you prepare for your CS171 Machine Learning final exam.

## 📚 Features

### Question Bank
- **580+ True/False Questions** covering all course topics
- **60+ Short Answer Questions** with detailed sample answers
- Questions organized by topic and difficulty level
- Real exam-style questions based on your course materials

### Exam Modes
1. **Full Exam Mode** - 30 T/F + 5 Short Answer (matches actual exam format)
2. **True/False Practice** - 50 random T/F questions for quick review
3. **Short Answer Practice** - 10 conceptual questions for deep understanding
4. **Topic-Specific Mode** - Focus on specific topics you need to study

### Study Features
- ⏱️ Timed and Untimed modes
- 🚩 Flag questions for review
- 📊 Progress tracking
- 📈 Detailed performance analytics
- 💡 Explanations for all T/F questions
- ✍️ Sample answers for short answer questions
- 🎯 Question navigator grid
- ⌨️ Keyboard shortcuts for faster navigation

### Topics Covered
- Introduction & ML Basics
- Data Types & Attributes
- Data Preprocessing & Feature Engineering
- Supervised Learning (Decision Trees, Naive Bayes, k-NN, Linear/Logistic Regression, SVM)
- Advanced Supervised (Ensemble Methods, Neural Networks, Regularization)
- Model Evaluation (Accuracy, Precision, Recall, F1, ROC, AUC, Cross-validation)
- Unsupervised Learning (K-Means, Hierarchical, DBSCAN)
- Advanced Unsupervised (PCA, Dimensionality Reduction)
- Association Rules & Pattern Mining

## 🚀 Setup Instructions

### Option 1: Simple Setup (Recommended)

1. **Extract the folder** to your desired location
2. **Open in browser** - Simply double-click `index.html`
3. **Start studying!**

That's it! The simulator runs entirely in your browser with no server required.

### Option 2: Using a Local Server (For full functionality)

If you want to avoid any CORS issues or prefer using a local server:

#### Using Python (Recommended)

```bash
# Navigate to the project folder
cd path/to/ml-exam-simulator

# Python 3
python3 -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser to: `http://localhost:8000`

#### Using Node.js

```bash
# Install http-server globally (one time only)
npm install -g http-server

# Navigate to project folder
cd path/to/ml-exam-simulator

# Start server
http-server -p 8000
```

Then open your browser to: `http://localhost:8000`

#### Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📖 How to Use

### Starting an Exam

1. **Choose Exam Type**
   - Full Exam: Simulates the real exam (30 T/F + 5 SA)
   - Practice modes: Focus on specific question types
   - Topic-Specific: Select topics you want to practice

2. **Select Timing**
   - Timed: 90 minutes (real exam conditions)
   - Untimed: Practice mode with no time pressure

3. **Click "Start Exam"**

### During the Exam

- **Answer Questions**: Click True/False buttons or type in text areas
- **Navigate**: Use Previous/Next buttons or arrow keys
- **Flag Questions**: Mark questions you want to review later (button or Ctrl+F)
- **View Progress**: See answered, flagged, and remaining questions
- **Question Grid**: Click "Grid" to see all questions and jump to any question
- **Submit**: Click "Submit" when ready (you'll be asked to confirm)

### Keyboard Shortcuts

- `←` Left Arrow: Previous question
- `→` Right Arrow: Next question
- `Ctrl+F` or `Cmd+F`: Flag/unflag current question

### After Submission

- View your overall score
- See detailed breakdown of T/F performance
- Review all your answers with:
  - Correct answers for T/F questions
  - Explanations for T/F questions
  - Sample answers for short answer questions
- Take another exam to continue practicing

## 📁 Project Structure

```
ml-exam-simulator/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling and animations
├── js/
│   ├── questions.js    # Question bank (580 T/F + 60 SA)
│   ├── exam.js         # Core exam logic
│   └── ui.js           # UI functions and interactions
└── README.md           # This file
```

## 🎨 Features Explained

### Enhanced UI
- Modern, professional design with smooth animations
- Responsive layout works on desktop, tablet, and mobile
- Dark/light mode support based on system preferences
- Color-coded feedback (correct=green, incorrect=red, flagged=orange)
- Progress bar showing completion percentage
- Real-time statistics during exam

### Intelligent Question Selection
- Random selection from comprehensive bank
- Balanced coverage across all topics
- No duplicate questions in single exam session
- Difficulty distribution mirrors actual exam

### Performance Tracking
- Detailed breakdown by question type
- Topic-level analysis available
- Time management insights
- Flag patterns show areas needing review

## 💡 Study Tips

1. **Start with Full Exam Mode** to get a feel for the real exam
2. **Review explanations** for questions you got wrong
3. **Flag difficult questions** and review them later
4. **Use Topic-Specific mode** to focus on weak areas
5. **Take multiple practice exams** to build confidence
6. **Practice in Timed mode** to improve time management
7. **Read sample answers** for short answer questions carefully
8. **Compare your answers** to sample answers to improve

## ⚠️ Important Notes

- Your progress is **not saved** between sessions
- Refreshing the page will **restart** the exam
- Works best in modern browsers (Chrome, Firefox, Safari, Edge)
- Internet connection **not required** after initial load
- All questions are based on your actual course materials

## 🐛 Troubleshooting

### Page won't load or looks broken
- Make sure all files (index.html, css/styles.css, js/*.js) are in the correct folders
- Try using a local server instead of opening the file directly
- Clear your browser cache and reload

### Timer not working
- Check that JavaScript is enabled in your browser
- Try a different browser

### Questions not displaying
- Check browser console for errors (F12 > Console tab)
- Make sure js/questions.js loaded correctly
- Refresh the page

## 📝 Question Bank Details

### True/False Questions (580+)
- **Introduction & Basics**: 40 questions
- **Data & Attributes**: 50 questions
- **Preprocessing**: 70 questions
- **Supervised Learning**: 120 questions
- **Advanced Supervised**: 80 questions
- **Unsupervised Learning**: 80 questions
- **Advanced Unsupervised**: 40 questions
- **Model Evaluation**: 60 questions
- **Pattern Mining**: 40 questions

### Short Answer Questions (60)
- Covers all major topics
- Includes sample answers with key points
- Graded conceptual understanding questions
- Real exam difficulty level

## 🎓 About

This simulator was created to help CS171 students prepare for their final exam by providing:
- Comprehensive practice questions
- Real exam simulation
- Immediate feedback and learning
- Flexible study modes

The questions are based on actual course materials including:
- Lecture slides
- Practice quizzes
- Assignments
- Past exam questions

## 📧 Support

If you encounter any issues or have suggestions for improvement:
1. Check the Troubleshooting section above
2. Review the browser console for error messages
3. Try the simple server setup method

## 🚀 Good Luck!

Remember: This simulator is a study tool to supplement your learning. Make sure to also:
- Review your lecture notes
- Understand the concepts, don't just memorize
- Practice explaining concepts in your own words
- Work through example problems
- Use your actual course materials and cheat sheet

**You've got this! 💪**
