const mongoose = require("mongoose");
const path = require("path");
const Competition = require("../models/Competition");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
mongoose.connect("mongodb://localhost:27017/algoverse").then(async () => {
  const comps = await Competition.find({});
  console.log("Total comps:", comps.length);
  comps.forEach(c => console.log(c.title, c.type, c.status));
  process.exit(0);
});
