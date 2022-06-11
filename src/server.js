const express = require("express");
const bodyParser = require("body-parser");
const bot = require("./bot/bot");
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const app = express();
const studRoute = require('./resources/stud/stud.router');
app.disable("x-powered-by");

app.use(bodyParser.json());
app.use(studRoute);
const start = () => {
  try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`run in port: ${PORT}`);
      //connect to db
      mongoose
        .connect(process.env.MONGODB_URI+'/PnuNumberDb' || "mongodb://localhost:27017/PnuNumberDb", {
          useNewUrlParser: true,
        })
        .then(() => console.log("connected to db: ",process.env.MONGODB_URI))
        .catch((err) => console.log(err));
      //_crawler();
    });
  } catch (e) {
    console.error(e);
  }

  bot();
};
start();
