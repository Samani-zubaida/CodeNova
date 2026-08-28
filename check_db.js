const mongoose = require("mongoose");
const Competition = require("./backend/models/Competition");
require("dotenv").config();
mongoose.connect("mongodb://localhost:27017/algoverse").then(async () => {
  const comps = await Competition.find({});
  console.log("Total comps:", comps.length);
  comps.forEach(c => console.log(c.title, c.type, c.status));
  process.exit(0);
});
