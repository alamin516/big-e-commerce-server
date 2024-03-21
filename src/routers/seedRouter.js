const express = require("express");
const { seedUser } = require("../controllers/seedController");
const { seedProduct } = require("../controllers/seedProductController");
const seedRouter = express.Router();

seedRouter.get("/users", seedUser)
seedRouter.get("/products", seedProduct)


module.exports = {seedRouter};