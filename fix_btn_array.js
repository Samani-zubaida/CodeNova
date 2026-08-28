const fs = require('fs');
let lines = fs.readFileSync('frontend/src/game/GameWorld.jsx', 'utf8').split('\n');
const navIndex = lines.findIndex(line => line.includes('</nav>'));
if (navIndex !== -1) {
  lines.splice(navIndex + 1, 0, 
    '        <div className="px-6 py-4 border-t border-[#BCA297]/20 mt-auto">',
    '          <button onClick={() => window.location.href="/host"} className="w-full bg-[#AB526B] hover:bg-[#8e4257] text-white font-bold py-3 rounded-lg transition-colors text-sm shadow-lg shadow-[#AB526B]/20">Host Competition</button>',
    '        </div>'
  );
  fs.writeFileSync('frontend/src/game/GameWorld.jsx', lines.join('\n'));
}
