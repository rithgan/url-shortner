require("dotenv").config();
const express = require("express");
const mongo = require("mongodb");
const cors = require("cors");
const mongoose = require("mongoose");
const shortId = require("shortid");
const bodyParser = require("body-parser");

const URL = require("./model");

const app = express();

//template engine setup
app.set("view engine", "ejs");

const PORT = process.env.PORT || 5000;

//body parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json);
app.use(cors());

app.use("/public", express.static(process.cwd() + "/public"));

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

app.get("/", (req, res) => {
  res.render(process.cwd() + "/views/index.ejs");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl/new", async (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
