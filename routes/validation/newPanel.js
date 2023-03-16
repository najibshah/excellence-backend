const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateNewPanelInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";

  if (!Validator.isLength(data.name, { min: 2, max: 60 })) {
    errors.name = "Panel Name must be between 2 and 20 characters";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Panel Name field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
