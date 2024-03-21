const { body } = require("express-validator");

// Registration Validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is Required. Enter your full Name.")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be at least 3-31 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required. Enter your email.")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Required. Enter your password.")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .matches(/^(?=.*[a-z])/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/^(?=.*\d)/)
    .withMessage("Password should contain at least one number")
    .matches(/^(?=.*[@$!%*?&])/)
    .withMessage("Password should contain at least one special character"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is Required. Enter your address.")
    .isLength({ min: 3 })
    .withMessage("Address should be at least 3 characters long"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is Required. Enter your Phone Number."),
  // body("image")
  // .custom((value, {req}) =>{
  //   if(!req.file || !req.file.buffer){
  //       throw new Error("User image is required")
  //   }

  //   return true;
  // })
  // .withMessage("User Image is required")
  // body("image").optional().isString().withMessage("User image is optional"),
  body("image").optional()
];

// Sign in Validation
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required.")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Required.")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
];

// validateUpdateNewPassword
const validateNewPassword = [
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is Required. Enter your password.")
    .isLength({ min: 6 })
    .withMessage("New password should be at least 6 characters long")
    .matches(/^(?=.*[a-z])/)
    .withMessage("New password should contain at least one lowercase letter")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("New password should contain at least one uppercase letter")
    .matches(/^(?=.*\d)/)
    .withMessage("New password should contain at least one number")
    .matches(/^(?=.*[@$!%*?&])/)
    .withMessage("New password should contain at least one special character")
];

// validateUserForgetPassword
const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required for forgetting password. Please enter your correct email.")
    .isEmail()
    .withMessage("Invalid email address"),
];


// validateUserForgetPassword
const validateUserResetPassword = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Token is missing for resetting password."),
    body("password")
    .trim()
    .notEmpty()
    .withMessage("password is Required. Enter your password.")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 characters long")
    .matches(/^(?=.*[a-z])/)
    .withMessage("password should contain at least one lowercase letter")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("password should contain at least one uppercase letter")
    .matches(/^(?=.*\d)/)
    .withMessage("password should contain at least one number")
    .matches(/^(?=.*[@$!%*?&])/)
    .withMessage("password should contain at least one special character")
];


// validateRefreshToken
// const validateRefreshToken = [
//   body("token")
//     .trim()
//     .notEmpty()
//     .withMessage("Token is missing."),
// ]


module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateNewPassword,
  validateUserForgetPassword,
  validateUserResetPassword,
  // validateRefreshToken
};
