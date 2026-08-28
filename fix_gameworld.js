const fs = require('fs');
let content = fs.readFileSync('frontend/src/game/GameWorld.jsx', 'utf8');
content = content.replace("); })}\`n            </div>\`n\`n          </div>\`n        ))} ", 
`); })}
            </div>

          </div>
        ))} `);
fs.writeFileSync('frontend/src/game/GameWorld.jsx', content);
