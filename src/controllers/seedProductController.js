
const data = require("../data");
const Product = require("../models/productModel");

const seedProduct = async (req, res, next) => {
  try {
    await Product.deleteMany({});


    const products = await Product.insertMany(data.products);


    return res.status(201).json(products);
  } catch (error) {
    next(error);
  }
};


module.exports = {seedProduct};
