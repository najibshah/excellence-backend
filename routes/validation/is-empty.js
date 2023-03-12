/*is-empty comes as a method with validator but it only check on STRING type object
so
is-empty.js is created to check for undefined, null, empty object, and empty strings */

const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;
