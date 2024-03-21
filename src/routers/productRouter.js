const express = require("express");

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const { validateProduct } = require("../validators/product");
const { getAllProducts, createProduct } = require("../controllers/productController");
const productRouter = express.Router();

productRouter.post("/", validateProduct, runValidation, isLoggedIn, isAdmin, createProduct)
productRouter.get("/", getAllProducts);


module.exports = productRouter;