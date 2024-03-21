const createError = require("http-errors");
const User = require("../models/userModel");
const data = require("../data");

const seedUser = async (req, res, next) => {
  try {
    // Delete All user
    await User.deleteMany({});

    // Create new user
    const users = await User.insertMany(data.users);

    // successful response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};


module.exports = {seedUser};
