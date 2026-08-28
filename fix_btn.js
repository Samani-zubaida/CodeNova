const fs = require('fs');
let content = fs.readFileSync('frontend/src/game/GameWorld.jsx', 'utf8');
content = content.replace(
  '</nav>\n      </div>',
  '</nav>\n        <div className="px-6 py-4 border-t border-[#333]">\n          <button onClick={() => window.location.href="/host"} className="w-full bg-[#AB526B] hover:bg-[#8e4257] text-white font-bold py-3 rounded-lg transition-colors text-sm shadow-lg shadow-[#AB526B]/20">Host Competition</button>\n        </div>\n      </div>'
);
fs.writeFileSync('frontend/src/game/GameWorld.jsx', content);
