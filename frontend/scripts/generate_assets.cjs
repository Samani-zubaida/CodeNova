const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../public/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Generate town.json (Tiled Map format)
const width = 20;
const height = 20;
const groundData = Array(width * height).fill(1); // 1 = grass

// Add some paths (2 = dirt)
for(let i=5; i<15; i++) {
    groundData[i*width + 10] = 2; // Vertical path
}

const buildingData = Array(width * height).fill(0);
// Add a building (3 = building block)
for(let y=5; y<8; y++) {
    for(let x=12; x<16; x++) {
        buildingData[y*width + x] = 3;
    }
}

const townJSON = {
  "height": height,
  "width": width,
  "tilewidth": 32,
  "tileheight": 32,
  "orientation": "orthogonal",
  "layers": [
    {
      "name": "Ground",
      "type": "tilelayer",
      "width": width,
      "height": height,
      "data": groundData,
      "visible": true,
      "opacity": 1
    },
    {
      "name": "Collisions",
      "type": "tilelayer",
      "width": width,
      "height": height,
      "data": buildingData,
      "visible": true,
      "opacity": 1
    }
  ],
  "tilesets": [
    {
      "name": "tileset",
      "image": "tileset.png",
      "firstgid": 1,
      "tilewidth": 32,
      "tileheight": 32,
      "imagewidth": 96,
      "imageheight": 32,
      "tilecount": 3,
      "columns": 3,
      "tiles": [
        { "id": 2, "properties": [{ "name": "collides", "type": "bool", "value": true }] }
      ]
    }
  ],
  "type": "map",
  "version": "1.9"
};

fs.writeFileSync(path.join(assetsDir, 'town.json'), JSON.stringify(townJSON, null, 2));

// 2. Generate 1x1 transparent PNGs so Phaser has something to load, 
// we will programmatically draw over them or replace them with base64 later 
// if needed, but it's better to just provide base64 strings directly in the JS.
// Actually, I can just create base64 pngs here.

// 32x96 Tileset (Green, Brown, Gray blocks)
const tilesetBase64 = "iVBORw0KGgoAAAANSUhEUgAAAGAAAAAgCAYAAADa15zZAAAAa0lEQVRo3u3QMQEAAADCoPVPbQw+cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4G6h+AAEqE3/5AAAAAElFTkSuQmCC";
fs.writeFileSync(path.join(assetsDir, 'tileset.png'), Buffer.from(tilesetBase64, 'base64'));

// 32x32 Player (Red block)
const playerBase64 = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAKklEQVRYR+3QQREAAAzCwL/pX8QoXkQ62A+rVatWrVq1atWqVatWrVo9X3XfAAErT3f9AAAAAElFTkSuQmCC";
fs.writeFileSync(path.join(assetsDir, 'player.png'), Buffer.from(playerBase64, 'base64'));

console.log("Assets generated in public/assets");
