const { body } = require("express-validator");

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category Name is Required.")
    .isLength({ min: 3})
    .withMessage("Category should be at least 3 characters."),
];



module.exports = {validateCategory}