//Form Model
const mongoose = require("mongoose");
mongoose.model("Panel", {
  panelLabel: {
    type: String,
    required: true,
  },
  panelID: {
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
