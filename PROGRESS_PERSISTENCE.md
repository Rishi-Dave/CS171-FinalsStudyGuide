# Progress Persistence - How It Works

## ✅ Your Progress is ALWAYS Saved!

Good news! Your CS171 study app **automatically saves all progress** using browser localStorage. This means:

- ✅ **Page refresh** → Progress preserved
- ✅ **Browser restart** → Progress preserved
- ✅ **Server restart** → Progress preserved
- ✅ **Computer restart** → Progress preserved
- ✅ **Days/weeks later** → Progress preserved

---

## 🔍 How It Works

### Automatic Saving

Every time you:
1. Answer a question in practice mode → **Saved immediately**
2. Submit an exam → **Saved immediately**
3. Complete a session → **Saved immediately**

**Storage Location**: Browser's localStorage (`cs171_exam_progress`)

### Automatic Loading

When you open the app:
1. App starts → Checks localStorage
2. Finds saved data → Loads automatically
3. No data found → Starts fresh

You'll see this in the browser console:
```
📊 ProgressTracker initialized
   Total questions attempted: 150
   Average score: 82.5%
✅ Progress data loaded from storage
```

---

## 🧪 Test It Yourself

### Quick Test:

1. **Take a practice exam** (any mode)
2. **Submit it** and view results
3. **Refresh the page** (Cmd+R / Ctrl+R)
4. **Click "View Progress"** → Your data is still there!
5. **Close browser completely**
6. **Open again** → Data still there!
7. **Restart server** → Data still there!

---

## 📱 Storage Details

### What Gets Saved:
- ✅ Every question attempt (correct/incorrect)
- ✅ Topic performance statistics
- ✅ Session history (last 50 sessions)
- ✅ Weak/mastered topics
- ✅ Timestamps and scores

### What Doesn't Get Saved:
- ❌ Current exam in progress (if you refresh mid-exam, you lose that session)
- ❌ Data in private/incognito mode (cleared when you close browser)

### Storage Capacity:
- localStorage limit: ~5-10 MB (plenty for this app)
- Current usage: ~100-500 KB (very small)
- Data retention: Last 50 sessions (older ones auto-removed)

---

## ⚠️ When Data Might Be Lost

### Browser Settings
If you manually:
- Clear browser cache/cookies
- Clear site data
- Use incognito/private mode (data cleared on exit)

### Browser Issues
- Rare: localStorage corruption
- Solution: Use the Export feature regularly as backup

---

## 💾 Backup Your Data

### Export Progress (Recommended!)

1. Click **"View Progress"** button
2. Scroll to bottom
3. Click **"Export Data"**
4. Saves file: `cs171-progress-2025-12-07.json`

**When to export:**
- Before clearing browser data
- Before switching browsers
- Weekly as backup
- Before exam (for peace of mind)

### Import Progress

Currently manual process:
1. Open browser console (F12)
2. Run:
```javascript
// Copy your JSON file contents, then:
const importedData = { /* paste JSON here */ };
ProgressTracker.import(JSON.stringify(importedData));
```

---

## 🔄 Transfer Between Devices

### Option 1: Export/Import
1. **Old device**: Export data
2. **Transfer**: Email/USB the JSON file
3. **New device**: Import via console (see above)

### Option 2: Cloud Sync (Manual)
1. Export regularly
2. Save to Google Drive/Dropbox
3. Import on other devices as needed

**Note**: No automatic sync between devices - data is per-browser

---

## 🧹 Clear Progress

### Complete Reset:
1. Click **"View Progress"**
2. Click **"Reset Progress"**
3. Confirm warning
4. All data cleared (starts fresh)

### Partial Clear:
Open browser console (F12):
```javascript
// Clear just sessions
ProgressTracker.data.sessions = [];
ProgressTracker.save();

// Clear just one topic
delete ProgressTracker.data.topicPerformance["Supervised Learning"];
ProgressTracker.save();
```

---

## 🔒 Privacy & Security

### Where is data stored?
- **Location**: Your browser's localStorage
- **Server**: NO data sent to server
- **Internet**: NO data uploaded anywhere
- **Privacy**: 100% local, completely private

### Who can access it?
- **You**: Yes (via the app)
- **Same browser**: Yes
- **Other browsers**: No (Chrome ≠ Safari ≠ Firefox)
- **Other users**: No (separate browser profiles)
- **Anyone else**: No

### Security:
- Data never leaves your computer
- Plain text JSON (not encrypted)
- Only accessible through the app or browser console

---

## 🎯 Best Practices

### Daily Use:
- Just use the app normally
- Data saves automatically
- No manual action needed

### Weekly:
- Check progress dashboard
- Export data as backup

### Before Important Events:
- Export progress before exam
- Keep backup of your study history

### Browser Maintenance:
- Export BEFORE clearing cache
- Don't use incognito for serious practice

---

## 🐛 Troubleshooting

### "No progress showing"
**Check:**
1. Did you complete an exam? (must submit, not just close)
2. Same browser? (Chrome vs Safari are separate)
3. Console errors? (F12 → Console tab)

**Solution:**
```javascript
// Check if data exists:
console.log(localStorage.getItem('cs171_exam_progress'));
```

### "Progress disappeared"
**Possible causes:**
- Incognito mode
- Browser cache cleared
- Different browser/profile

**Solution:**
- Import your last export
- Start fresh if no backup

### "Can't export"
**Check:**
- Pop-up blocker disabled?
- Browser permissions OK?

**Alternative:**
```javascript
// Manual export via console:
console.log(ProgressTracker.export());
// Copy the output and save to file
```

---

## 💡 Pro Tips

1. **Export weekly** - Easy backup habit
2. **Check console** - See save confirmations
3. **Consistent browser** - Use same one for studying
4. **Not incognito** - Use normal browsing mode
5. **Before clearing** - Export first!

---

## ✨ Summary

**Your progress is automatically saved and persists across:**
- ✅ Page refreshes
- ✅ Browser restarts
- ✅ Server restarts
- ✅ Computer restarts

**You don't need to do anything** - it just works!

**Optional but recommended:**
- Export weekly as backup
- Use same browser for studying
- Avoid incognito mode

Happy studying! Your progress is safe! 🎓
