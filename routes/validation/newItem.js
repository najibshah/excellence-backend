const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateNewItemInput(data) {
  let errors = {};

  data.content = !isEmpty(data.content) ? data.content : "";

  if (!Validator.isLength(data.content, { min: 2, max: 60 })) {
    errors.content = "Item content must be between 2 and 20 characters";
  }
  if (Validator.isEmpty(data.content)) {
    errors.content = "Item content field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
