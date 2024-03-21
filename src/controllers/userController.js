const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const {
  jwtActivationKey,
  clientUrl,
} = require("../secret");
const emailSendWithNodeMailer = require("../helper/email");
const {
  handleUserAction,
  findUsers,
  findUserById,
  handleDeleteUserById,
  handleUpdateUserById,
  handleUpdateUserPasswordById,
  handleForgetPasswordByEmail,
  handleResetPasswordByToken,
} = require("../services/userService");
const fs = require("fs").promises;

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;

    // This function came from Services ==> UserService.js
    const { users, pagination } = await findUsers(search, limit, page);

    return successResponse(res, {
      statusCode: 200,
      message: "Users were returned successfully",
      payload: {
        users: users,
        pagination: pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };

    // This function came from Services ==> UserService.js
    const user = await findUserById(id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "User was returned successfully",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };

    // This function came from Services ==> UserService.js
    await handleDeleteUserById(id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "User was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    console.log(name, email, password, phone, address);

    let image;
    if (req.file) {
      image = req.file.path;
      if (req.file.size > 1024 * 1024 * 2) {
        throw createError("File too large. It must be less than 2 MB");
      }
    }

    // Check if user with the provided email already exists
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        409,
        "User with this email already exists. Please login"
      );
    }

    // Create a JSON Web Token (JWT)
    const tokenPayload = {
      name,
      email,
      phone,
      password,
      address,
    };

    if (image) {
      tokenPayload.image = image;
    }

    const token = createJSONWebToken(tokenPayload, jwtActivationKey, "10m");

    // Prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
        <h2>Hello ${name}, </h2>
        <p>Please click here to <a href="${clientUrl}/api/v1/users/activate/${token}">Activate Your Account</a></p>
      `,
    };

    // Send email with nodemailer
    try {
      await emailSendWithNodeMailer(emailData);
    } catch (error) {
      throw createError(500, "Failed to send verification email");
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing your registration process`,
    });
  } catch (error) {
    next(error);
  }
};

const processActivateUser = async (req, res, next) => {
  try {
    const token = req.body.token;

    if (!token) throw createError(404, "Token Not Found!");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);

      if (!decoded) throw createError(401, "Unable to verify User");

      // Assuming User is a model that has a create method

      const userExist = await User.exists({ email: decoded.email });
      if (userExist) {
        throw createError(
          409,
          "User with this email already exist. Please login"
        );
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: `User Was Registered Successfully.`,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error; // Re-throw the error if it's not one of the expected JWT errors
      }
    }
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // This function came from Services ==> UserService.js
    const updateUser = await handleUpdateUserById(userId, req);

    return successResponse(res, {
      statusCode: 200,
      message: "User was updated successfully",
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

const handleManageUserStatusById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.body.action;

    // This function came from Services ==> UserService.js
    const message = await handleUserAction(userId, action);

    return successResponse(res, {
      statusCode: 200,
      message: message,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdatePassword = async (req, res, next) => {
  try {
    // email, oldPassword, newPassword, confirmPassword
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id;

    // handleUpdateUserPasswordById function came from Services ==> UserService.js
    const updateUser = await handleUpdateUserPasswordById(
      userId,
      email,
      oldPassword,
      newPassword,
      confirmPassword
    );

    return successResponse(res, {
      statusCode: 200,
      message: "User password was updated successfully",
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // This function came from Services ==> UserService.js
    const token = await handleForgetPasswordByEmail(email);

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for resetting your password`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token) throw createError(404, "Token Not Found!");

    try {
      await handleResetPasswordByToken(token, password)

      return successResponse(res, {
        statusCode: 201,
        message: `Reset password updated Successfully.`,
        payload: {},
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error; // Re-throw the error if it's not one of the expected JWT errors
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  processActivateUser,
  updateUserById,
  handleManageUserStatusById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
