const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
const { mogoUrl } = require("./keys");

const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

//point towards the routes
const boards = require("./routes/api/Boards");
const panels = require("./routes/api/Panels");

mongoose.connect(mogoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//test main server route
app.get("/", (req, res) => {
  res.send("Hello, Best Regards MAIN server is UP!");
});

//use routes
app.use("/edc/boards", boards);
app.use("/edc/panels", panels);

mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB!");
});

mongoose.connection.on("error", (err) => {
  console.log("this is an error", err);
});

//TODO move port number to env vars
app.listen(PORT, () => {
  console.log(`EDC Web Server started ${PORT}`);
});
