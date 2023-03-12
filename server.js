const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
const { mogoUrl } = require("./keys");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

mongoose.connect(mogoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//test main server route
app.get("/", (req, res) => {
  res.send("Hello, Best Regards MAIN server is UP!");
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB!");
});

mongoose.connection.on("error", (err) => {
  console.log("this is an error", err);
});

//TODO move port number to env vars
app.listen(4000, () => {
  console.log(`Work Web Server started 4000`);
});
