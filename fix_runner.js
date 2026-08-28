const fs = require('fs');
let content = fs.readFileSync('frontend/src/game/QuizRunner.jsx', 'utf8');

// Update function signature
content = content.replace(
  'export default function QuizRunner({ subject, levelId, onBack, onLevelComplete }) {',
  'export default function QuizRunner({ subject, levelId, competitionData, onBack, onLevelComplete }) {'
);

// Update fetch logic
content = content.replace(
  "fetch(`http://localhost:5000/api/levels/${subject}/${levelId}`)",
  "competitionData ? Promise.resolve({ ok: true, json: () => Promise.resolve(competitionData) }) : fetch(`http://localhost:5000/api/levels/${subject}/${levelId}`)"
);

// Update XP/Level Completion logic
content = content.replace(
  "unlockNextLevel(subject);",
  "if (!competitionData) unlockNextLevel(subject);"
);

content = content.replace(
  "addCompletedLevel({ subject, levelId, title: `${subject.toUpperCase()} Lvl ${levelId}`, date: new Date().toLocaleDateString() });",
  "if (!competitionData) addCompletedLevel({ subject, levelId, title: `${subject.toUpperCase()} Lvl ${levelId}`, date: new Date().toLocaleDateString() });"
);

// Submit competition score to backend
content = content.replace(
  "setIsLevelComplete(true);",
  "setIsLevelComplete(true);\n      if (competitionData) {\n        fetch(`http://localhost:5000/api/competitions/${competitionData._id}/submit-score`, {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ username: 'Player1', score: earnedXP })\n        });\n      }"
);

// Fix initial code evaluation since competitionData questions have 'description' and 'initialCode' but no 'type'. They should all be 'code-editor' type.
content = content.replace(
  "const nextQ = questions[currentIndex + 1];",
  "const nextQ = questions[currentIndex + 1];\n      if (competitionData) nextQ.type = 'code-editor';"
);

// Map competitionData questions on load to ensure they have the right type
content = content.replace(
  "setQuestions(data.questions);",
  "setQuestions(competitionData ? data.questions.map(q => ({...q, type: 'code-editor', question: q.title, explanation: q.description})) : data.questions);"
);


fs.writeFileSync('frontend/src/game/QuizRunner.jsx', content);
