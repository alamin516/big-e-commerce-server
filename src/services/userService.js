const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const { deleteImage } = require("../helper/deleteImage");
const User = require("../models/userModel");
const { jwtResetPasswordKey, clientUrl } = require("../secret");
const emailSendWithNodeMailer = require("../helper/email");
const { createJSONWebToken } = require("../helper/jsonwebtoken");

// These functions used in Controller ==> userController.js

const findUsers = async (search, limit, page) => {
  try {
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users || users.length === 0) throw createError(404, "No users found");

    return {
      users,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    throw error;
  }
};

const findUserById = async (id, options = {}) => {
  try {
    const user = await User.findById(id, options);
    if (!user) throw createError(404, "User not found.");
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid User Id");
    }
    throw error;
  }
};

const handleDeleteUserById = async (id, options = {}) => {
  try {
    const user = await User.findByIdAndDelete({ _id: id, isAdmin: false });

    if (user && user.image !== "public/images/users/default.jpg") {
      await deleteImage(user.image);
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid User Id");
    }
    throw error;
  }
};

const handleUpdateUserById = async (userId, req) => {
  try {
    const options = { password: 0 };
    const user = await findUserById(userId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    const allowedFields = ["name", "password", "phone", "address"];
    for (let key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw new Error("Email can't be updated");
      }
    }

    if (req.file) {
      const image = req.file.path;
      if (req.file.size > 1024 * 1024 * 2) {
        throw createError("File too large. It must be less than 2 MB");
      }
      updates.image = image;

      if (user.image !== "public/images/users/default.jpg") {
        await deleteImage(user.image);
      }
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updateUser) {
      throw createError(404, "User with this Id does not exist.");
    }

    return updateUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid User Id");
    }
    throw error;
  }
};

const handleUpdateUserPasswordById = async (
  userId,
  email,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw createError(404, "User did not find with this email.");
    }

    if (newPassword !== confirmPassword) {
      throw createError(
        400,
        "New password and Confirm Password did not match."
      );
    }

    // compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      throw createError(400, "Old password is incorrect.");
    }

    const updates = { $set: { password: newPassword } };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updateUser) {
      throw createError(404, "User with this Id does not exist.");
    }

    return updateUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid User Id");
    }
    throw error;
  }
};

const handleUserAction = async (userId, action) => {
  try {
    let update;
    let message;

    if (action === "banned") {
      update = { isBanned: true };
      message = "User was banned successfully";
    } else if (action === "unbanned") {
      update = { isBanned: false };
      message = "User was unbanned successfully";
    } else {
      throw createError(400, "Invalid Action, Use 'Banned' or 'Unbanned'");
    }

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("-password");

    if (!updateUser) {
      throw createError(404, "User was not banned successfully.");
    }

    return message;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid User Id");
    }
    throw error;
  }
};

const handleForgetPasswordByEmail = async (email) => {
  try {
    const userData = await User.findOne({ email: email });

    if (!userData) {
      throw createError(404, "Email is incorrect. Please register first.");
    }

    const token = createJSONWebToken({ email }, jwtResetPasswordKey, "10m");

    // Prepare email
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
          <h2>Hello ${userData.name}, </h2>
          <p>Please click here to <a href="${clientUrl}/api/v1/users/reset-password/${token}">Reset Your Password</a></p>
        `,
    };

    // Send email with nodemailer
    try {
      await emailSendWithNodeMailer(emailData);
    } catch (error) {
      throw createError(500, "Failed to send reset password email");
    }

    return token;
  } catch (error) {
    throw error;
  }
};

const handleResetPasswordByToken = async (token, password) => {
  try {
    const decoded = jwt.verify(token, jwtResetPasswordKey);

    const userData = await User.findOne({ email: decoded.email });


    const updates = { $set: { password: password } };

    const updateOptions = {
      new: true,
      runValidators: true,
      context: "query",
    };

    await User.findByIdAndUpdate(
      userData._id,
      updates,
      updateOptions
    ).select("-password");
    
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findUsers,
  findUserById,
  handleDeleteUserById,
  handleUpdateUserById,
  handleUpdateUserPasswordById,
  handleUserAction,
  handleForgetPasswordByEmail,
  handleResetPasswordByToken
};
