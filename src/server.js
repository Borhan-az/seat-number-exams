const express = require("express");
const bodyParser = require("body-parser");
const bot = require("./bot/bot");
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const app = express();
const studRoute = require('./resources/stud/stud.router');

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://borhan:borhan1379@cluster0.scd5zxs.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


app.disable("x-powered-by");

app.use(bodyParser.json());
app.use(studRoute);

const start = () => {
  try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`run in port: ${PORT}`);
      console.log(`base url: `,process.env.URL );
      console.log(`mongodb addr:`,process.env.MONGODB_URI);
      //connect to db
      mongoose
        .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/PnuNumberDb", {
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
