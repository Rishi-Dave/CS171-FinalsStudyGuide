# CS171 Finals Study Guide - Usage Guide

## Quick Start

### Running Locally

1. **Start the local server:**
   ```bash
   cd /Users/rishidave/Documents/CS171-FinalsStudyGuide
   python3 -m http.server 3000
   ```

2. **Open in your browser:**
   Navigate to: `http://localhost:3000`

3. **Start studying!**
   - Choose your exam type (Full Exam, True/False Practice, Short Answer Practice, or Topic-Specific)
   - Select your settings (Timed/Untimed, Practice Mode for instant feedback)
   - Click "Start Exam" and begin!

---

## Question Bank

The app now loads from **538 comprehensive practice questions** covering all CS171 topics:

### True/False Questions (484 total)
Organized into 9 topic-based files:
- **Topic 1**: Introduction & Logistics (55 questions)
- **Topic 2**: Statistics & Visualization (50 questions)
- **Topic 3**: Data Preprocessing (65 questions)
- **Topic 4**: Supervised Learning I (70 questions)
- **Topic 5**: Supervised Learning II (70 questions)
- **Topic 6**: Supervised Learning Advanced (70 questions)
- **Topic 7**: Unsupervised Learning I (55 questions)
- **Topic 8**: Density-Based & Evaluation (45 questions)
- **Topic 9**: Pattern Mining (4 questions)

### Short Answer Questions (54 total)
Organized into 4 topic-based files:
- **Topic 1**: ML Introduction, Data & Preprocessing (12 questions)
- **Topic 2**: Supervised Learning Methods (18 questions)
- **Topic 3**: Unsupervised Learning Methods (19 questions)
- **Topic 4**: Frequent Pattern Mining (5 questions)

---

## Features

### Exam Modes
1. **Full Exam** - Simulates real exam: 30 T/F + 5 Short Answer (~90 min)
2. **True/False Practice** - 50 random T/F questions (~45 min)
3. **Short Answer Practice** - 10 conceptual questions (~60 min)
4. **Topic-Specific** - Choose your focus areas for targeted practice

### Settings
- **Timed Mode**: 90 minutes (realistic exam conditions)
- **Untimed Mode**: No time pressure (learning mode)
- **Practice Mode**: Get instant feedback with explanations after each answer

### During the Exam
- **Navigation**: Use Previous/Next buttons or the Question Grid
- **Flag Questions**: Mark questions for review
- **Track Progress**: See answered, flagged, and remaining questions
- **Review Answers**: In practice mode, see explanations immediately

---

## Question Sources

All questions extracted from: `js/All Practice Questions CS171.txt`

This comprehensive question bank was created specifically for CS171 Machine Learning finals preparation and covers all major topics from the course.

---

## Technical Details

### File Structure
```
CS171-FinalsStudyGuide/
├── index.html              # Main app entry point
├── css/
│   └── styles.css         # App styling
├── js/
│   ├── questions.js       # Question loader (updated to use new files)
│   ├── exam.js           # Exam logic
│   ├── ui.js             # UI interactions
│   ├── truefalse_topic*.json   # 9 T/F question files
│   └── shortanswer_topic*.json # 4 SA question files
└── USAGE_GUIDE.md        # This file
```

### Integration Complete
The app has been successfully updated to load questions from the new topic-based JSON files. The question loader ([questions.js](js/questions.js:1)) now:
- Loads all 13 JSON files (9 T/F + 4 SA)
- Standardizes question format
- Removes duplicates
- Provides topics for filtering

---

## Troubleshooting

### Server won't start (port in use)
If port 3000 is busy, try a different port:
```bash
python3 -m http.server 8001
# Then open http://localhost:8001
```

### Questions not loading
1. Check browser console for errors (F12 → Console tab)
2. Verify all JSON files are in the `js/` directory
3. Make sure you're running from the correct directory

### No questions appear
- Ensure you're accessing via `http://localhost:PORT` (not `file://`)
- JSON files must be served via HTTP for the loader to work

---

## Tips for Studying

1. **Start with Topic-Specific**: Focus on your weak areas first
2. **Use Practice Mode**: Learn from explanations before timing yourself
3. **Take Full Exams**: Simulate real conditions once you're comfortable
4. **Review Flagged Questions**: Go back to questions you marked for review
5. **Track Your Progress**: Note which topics need more attention

Good luck on your finals! 🎓
