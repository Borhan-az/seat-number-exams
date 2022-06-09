const express = require("express");
const bodyParser = require("body-parser");
const bot = require('./bot/bot')
require("dotenv").config();

 const app = express();

app.disable("x-powered-by");

app.use(bodyParser.json());


 const start = () => {
  try {
    app.listen(5000, () => {
      console.log(`REST API on http://localhost:${5000}/api`);
    });
  } catch (e) {
    console.error(e);
  }
  bot();

};
start();
