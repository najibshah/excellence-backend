const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEditBoardInput(data) {
  let errors = {};
  data.boardLabel = !isEmpty(data.boardLabel) ? data.boardLabel : "";

  if (!Validator.isLength(data.boardLabel, { min: 2, max: 60 })) {
    errors.boardLabel = "Board Label must be between 2 and 20 characters";
  }
  if (Validator.isEmpty(data.boardLabel)) {
    errors.boardLabel = "Board Label field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
