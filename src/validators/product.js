const { body } = require("express-validator");

const validateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("The title is Required.")
    .isLength({ min: 3})
    .withMessage("The title should be at least 3 characters.")
];



module.exports = {validateProduct}