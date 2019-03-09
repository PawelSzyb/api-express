const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mongoURI = require("./config/keys").mongoURI
const mongoose = require("mongoose")

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const feedRoutes = require("./routes/feed");

app.use("/feed", feedRoutes);

mongoose.connect(mongoURI, {
    useNewUrlParser: true
  })
  .then((res) => console.log("MongoDB connected"))
  .then((err) => console.log(err))

app.listen(8080, console.log("Server started at port 8080"));