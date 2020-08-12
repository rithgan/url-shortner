const express = require("express");
const mongo = require("mongodb");
const cors = require("cors");
const mongoose = require("mongoose");
const shortId = require("shortid");

const app = express();

app.set("view engine", "ejs");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is listening");
});
