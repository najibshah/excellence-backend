require("dotenv").config();

mongoURI = process.env.MONGODB_URI;
module.exports = {
  mogoUrl: `${mongoURI}`,
};

//To-Do Setup env vars
