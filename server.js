require("dotenv").config();
const express = require("express");
const mongo = require("mongodb");
const cors = require("cors");
const mongoose = require("mongoose");
const shortId = require("shortid");
const bodyParser = require("body-parser");
const path = require("path");

const URL = require("./model");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

//body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json);

//Mongoose client setup
const uri = process.env.DB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database is connected");
});
app.use('/public', express.static(process.cwd() + '/public'));

app.get("/", (req, res) => {
  //res.sendFile(process.cwd+'./views/index.html')
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl/new", async (req, res) => {
  const url = req.protocol + "://" + req.get("host") + req.originalUrl;
  const urlCode = shortId.generate();
  const regEx = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
  if (regEx.test(url)) {
    try {
      let findOne = await URL.findOne({ original_url: url });
      if (findOne) {
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url,
        });
      } else {
        findOne = new URL({
          original_url: url,
          short_url: urlCode,
        });
        await findOne.save();
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(`Server erorr…`);
    }
  } else {
    res.json({ error: "invalid URL" });
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  try {
    const urlParams = await URL.findOne({
      short_url: req.params.short_url,
    });
    if (urlParams) {
      return res.redirect(urlParams.original_url);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(`Server error`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});