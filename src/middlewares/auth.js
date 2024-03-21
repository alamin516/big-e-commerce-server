const { successResponse } = require("../controllers/responseController");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw createError(401, "Access token not found, Please login, Again!");
    }

    const decoded = jwt.verify(token, jwtAccessKey);

    if (!decoded)
      throw createError(401, "Authorization failed to access data.");

    req.user = decoded.user;

    next();
  } catch (error) {
    return next(error);
  }
};

const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if (decoded) {
          throw createError(401, "User is already logged in");
        }
      } catch (error) {
        throw error;
      }
    }

    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    console.log(req.user.isAdmin)

    if(req.user.isAdmin  === false){
        throw createError(403, 'Forbidden. You must be an admin to access this resource.');
    }

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };
