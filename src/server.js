const express = require("express");
const bodyParser = require("body-parser");
const bot = require("./bot/bot");
const _crawler = require("./crawler/crawler");
const { default: mongoose } = require("mongoose");
const app = express();
const studRoute = require('./resources/stud/stud.router');
app.disable("x-powered-by");

app.use(bodyParser.json());
app.use(studRoute);
const start = () => {
  try {
    app.listen(5000, () => {
      console.log(`REST API on http://localhost:${5000}`);
      //connect to db
      mongoose
        .connect("mongodb://localhost:27017/PnuNumberDb", {
          useNewUrlParser: true,
        })
        .then(() => console.log("connected to db"))
        .catch((err) => console.log(err));
      //_crawler();
    });
  } catch (e) {
    console.error(e);
  }

  bot();
};
start();
