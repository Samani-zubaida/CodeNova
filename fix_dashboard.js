const fs = require('fs');
let lines = fs.readFileSync('backend/routes/dashboard.js', 'utf8').split('\n');
const idx = lines.findIndex(line => line.includes('const competitions = await Competition.find({});'));

if (idx !== -1) {
  lines.splice(idx + 1, 0,
    '    const now = new Date();',
    '    const updatedCompetitions = competitions.map(comp => {',
    '      if (comp.type === "Hosted" && comp.startTime) {',
    '        if (now >= comp.startTime && now <= comp.endTime) comp.status = "Active";',
    '        else if (now > comp.endTime) comp.status = "Completed";',
    '        else comp.status = "Upcoming";',
    '      }',
    '      return comp;',
    '    });',
    '    res.json(updatedCompetitions);'
  );
  
  // Remove the old res.json(competitions)
  const resIdx = lines.findIndex((line, i) => i > idx && line.includes('res.json(competitions);'));
  if (resIdx !== -1) lines.splice(resIdx, 1);

  fs.writeFileSync('backend/routes/dashboard.js', lines.join('\n'));
}
