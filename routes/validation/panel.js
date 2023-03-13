const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePanelInput(data) {
  let errors = {};

  data.panelLabel = !isEmpty(data.panelLabel) ? data.panelLabel : "";

  if (!Validator.isLength(data.panelLabel, { min: 2, max: 60 })) {
    errors.panelLabel = "Panel Label must be between 2 and 20 characters";
  }
  if (Validator.isEmpty(data.panelLabel)) {
    errors.panelLabel = "Panel Label field is required";
  }
  data.boardID = !isEmpty(data.boardID) ? data.boardID : "";

  if (!Validator.isLength(data.boardID, { min: 2, max: 60 })) {
    errors.boardID = "Board Label must be between 2 and 20 characters";
  }
  if (Validator.isEmpty(data.boardID)) {
    errors.boardID = "Board Label field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
