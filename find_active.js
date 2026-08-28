const fs = require('fs');
let lines = fs.readFileSync('frontend/src/game/GameWorld.jsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (line.includes('activeQuiz')) {
    console.log(`Line ${i}: ${line.trim()}`);
  }
});
