//Form Model
const mongoose = require("mongoose");
mongoose.model("Board", {
  boardLabel: {
    type: String,
    required: true,
  },
  boardID: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  dateModified: {
    type: Date,
    required: true,
  },
});
