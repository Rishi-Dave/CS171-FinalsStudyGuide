# CS171 Machine Learning Final Exam Simulator

An intelligent, adaptive study tool for CS171 Machine Learning finals with 538 practice questions and smart progress tracking.

## 🚀 Quick Start

```bash
cd CS171-FinalsStudyGuide
python3 -m http.server 3000
```

Then open: **http://localhost:3000**

## ✨ Features

### Core Features
- **538 Questions**: 484 True/False + 54 Short Answer
- **6 Exam Modes**: Full Exam, T/F Practice, Short Answer, Topic-Specific, Smart Practice, Review Mistakes
- **Practice Mode**: Instant feedback with explanations
- **Timed/Untimed**: Flexible study options

### 🧠 Smart Features (NEW!)
- **Progress Tracking**: Automatic performance monitoring (saved in localStorage)
- **Smart Practice**: AI-powered question selection targeting your weak areas
- **Review Mistakes**: Focus on questions you've gotten wrong
- **Analytics Dashboard**: Detailed performance breakdown by topic
- **Adaptive Learning**: Questions prioritized based on your accuracy

## 📊 Question Bank

Organized by topic:
- Introduction & Logistics
- Statistics & Visualization
- Data Preprocessing
- Supervised Learning (I, II, Advanced)
- Unsupervised Learning
- Density-Based Clustering & Evaluation
- Pattern Mining & Association Rules

## 🎯 Exam Modes

| Mode | Questions | Best For |
|------|-----------|----------|
| Full Exam | 30 T/F + 5 SA | Exam simulation |
| True/False Practice | 50 T/F | Quick practice |
| Short Answer Practice | 10 SA | Deep learning |
| Topic-Specific | Custom | Focused study |
| **Smart Practice** ⭐ | 30 T/F + 5 SA | **Adaptive learning** |
| **Review Mistakes** ⭐ | Your errors | **Target weaknesses** |

⭐ = Uses progress tracking for intelligent question selection

## 📈 Progress Tracking

**Automatically tracks:**
- ✅ Every question attempt (correct/incorrect)
- ✅ Performance by topic
- ✅ Session history
- ✅ Weak vs mastered topics

**View Progress**: Click "View Progress" button in header

**Data Persistence**: Saved in browser localStorage (survives page refreshes, browser restarts)

**Export**: Download your complete history as JSON backup

## 💡 Study Strategy

### First Time
1. Take "Full Exam" in Practice Mode
2. Review answers with explanations
3. Check Progress Dashboard
4. Repeat 2-3 times to build history

### Regular Practice
1. Daily: **Smart Practice** (30 min)
2. Weekly: Check Progress Dashboard
3. Focus: Topic-Specific on weak areas

### Before Exam
1. **Review Mistakes** mode
2. Full Exam (Timed Mode)
3. Check dashboard for confidence

## 📁 Project Structure

```
CS171-FinalsStudyGuide/
├── index.html                 # Main app
├── css/
│   └── styles.css            # Styling
├── js/
│   ├── progress-tracker.js   # Smart tracking system
│   ├── questions.js          # Question loader
│   ├── exam.js              # Exam logic
│   ├── ui.js                # UI functions
│   ├── truefalse_topic*.json   # 9 T/F files
│   ├── shortanswer_topic*.json # 4 SA files
│   └── All Practice Questions CS171.txt  # Source data
└── README.md                 # This file
```

## 📚 Documentation

- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick reference card
- **[ENHANCED_FEATURES.md](ENHANCED_FEATURES.md)** - Detailed feature documentation
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Complete user guide
- **[PROGRESS_PERSISTENCE.md](PROGRESS_PERSISTENCE.md)** - How progress tracking works

## 🔑 Key Features Explained

### Smart Practice Mode
- Analyzes your performance history
- Prioritizes weak topics (<70% accuracy)
- Avoids recently seen questions
- Focuses on your mistake patterns
- Most efficient way to improve!

### Progress Dashboard
- Overall statistics (questions, accuracy, sessions)
- Topic breakdown with color coding:
  - 🔴 Red (<60%): Needs attention
  - 🟡 Yellow (60-80%): Improving
  - 🟢 Green (>80%): Mastered
- Recent session history
- Export/reset options

### Review Mistakes
- Shows only incorrectly answered questions
- Sorted by error frequency
- Perfect for targeted improvement
- Requires some practice history first

## ⚙️ Technical Details

- **Frontend Only**: Pure HTML/CSS/JavaScript
- **No Backend**: All data stored locally
- **No Dependencies**: No npm/build process needed
- **Browser Storage**: localStorage for progress
- **Privacy**: All data stays on your machine

## 🎓 Tips

1. Use **Practice Mode** when learning
2. Use **Smart Practice** daily for best results
3. Export progress weekly as backup
4. Check dashboard to identify weak areas
5. Review mistakes before exams

## 🐛 Troubleshooting

**Questions not loading?**
- Ensure you're using `http://localhost:PORT` (not `file://`)
- Check browser console for errors
- Verify all JSON files are in `js/` directory

**No progress showing?**
- Complete and submit at least one exam
- Must use normal browsing mode (not incognito)
- Check same browser/profile

**Smart Practice/Review Mistakes not working?**
- Need to complete 3-5 exams first to build history
- Progress tracking must have data

## 📝 License

For educational use - CS171 Machine Learning course preparation

## 🎉 Good Luck!

This tool is designed to help you master CS171 concepts efficiently. Use Smart Practice daily, review your weak areas, and track your progress. You've got this! 🎓✨
