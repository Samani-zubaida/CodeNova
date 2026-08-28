const fs = require('fs');
let lines = fs.readFileSync('frontend/src/game/GameWorld.jsx', 'utf8').split('\n');
console.log(lines.slice(22, 28).join('\n'));
