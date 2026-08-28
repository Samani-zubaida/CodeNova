const fs = require('fs');
let content = fs.readFileSync('frontend/src/game/QuizRunner.jsx', 'utf8');
content = content.replace(/addCompletedLevel\(\{ subject, levelId, title: .*?Lvl , date: new Date\(\)\.toLocaleDateString\(\) \}\);/, 
  'addCompletedLevel({ subject, levelId, title: `${subject.toUpperCase()} Lvl ${levelId}`, date: new Date().toLocaleDateString() });');
fs.writeFileSync('frontend/src/game/QuizRunner.jsx', content);
