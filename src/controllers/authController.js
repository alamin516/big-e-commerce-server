const User = require("../models/userModel");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, jwtRefreshTokenKey } = require("../secret");
const { verify } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { setAccessTokenCookie, setRefreshTokenCookie } = require("../helper/cookie");


const handleLogin = async (req, res, next) => {
  try {
    // email, password req.body
    const { email, password } = req.body;

    // isExist
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User does not exist. Please register.");
    }

    // compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw createError(401, "Password does not incorrect");
    }

    // isBanned
    if (user.isBanned) {
      throw createError(
        403,
        "Your account is banned. Please contact with authority"
      );
    }

    // token, cookie
    const accessToken = createJSONWebToken({ user }, jwtAccessKey, "1d");
    setAccessTokenCookie(res, accessToken)
    

    const refreshToken = createJSONWebToken({ user }, jwtAccessKey, "7d");

    setRefreshTokenCookie(res, refreshToken)

    // Way - 1
    // const userWithoutPassword = await User.findOne({ email }).select(
    //   "-password"
    // );

    // Way - 2
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Success Response
    return successResponse(res, {
      statusCode: 200,
      message: "User was logged in successfully",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    // Clear Login access token
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // Success Response
    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    //verify the old refresh token
    const decodedToken = jwt.verify(accessToken, jwtAccessKey);

    if (!decodedToken) {
      throw createError(401, "Invalid access token. Please login again");
    }

    // Success Response
    return successResponse(res, {
      statusCode: 200,
      message: "Protected resources access successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleProtectedRoute = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    //verify the old refresh token
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshTokenKey);

    if (!decodedToken) {
      throw createError(401, "Invalid refresh token. Please login again");
    }

    const accessToken = createJSONWebToken(decodedToken.user, jwtAccessKey, "1d");
    setAccessTokenCookie(accessToken)

    // Success Response
    return successResponse(res, {
      statusCode: 200,
      message: "New access token generated successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin, handleLogout, handleRefreshToken, handleProtectedRoute };
