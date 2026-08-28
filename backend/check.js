const mongoose = require("mongoose");
const Competition = require("./models/Competition");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const comps = await Competition.find({});
  console.log("Total comps:", comps.length);
  comps.forEach(c => console.log(c.title, c.type, c.status));
  process.exit(0);
}).catch(console.error);
