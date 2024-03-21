const createError = require("http-errors");
const Product = require("../models/productModel");
const { successResponse } = require("./responseController");

const getAllProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || "";

    const filter = {};

    if (search) {
      const searchRegExp = new RegExp(".*" + search + ".*", "i");

      filter.$or = [{ title: { $regex: searchRegExp } }];
    }

    if (req.query.priceMin !== undefined && req.query.priceMax !== undefined) {
      filter["prices.original"] = {
        $gte: req.query.priceMin,
        $lte: req.query.priceMax,
      };
    }

    if (req.query.color) {
      filter.colors = req.query.color;
    }

    if (req.query.size) {
      filter.sizes = req.query.size;
    }

    if (
      req.query.ratingMin !== undefined &&
      req.query.ratingMax !== undefined
    ) {
      filter["ratings.average"] = {
        $gte: req.query.ratingMin,
        $lte: req.query.ratingMax,
      };
    }

    let sortOptions = {};
    if (req.query.sort === "ascending") {
      sortOptions["prices.original"] = 1;
    } else if (req.query.sort === "descending") {
      sortOptions["prices.original"] = -1;
    } else if (req.query.sort === "latest") {
      sortOptions["createdAt"] = 1;
    } else if (req.query.sort === "old") {
      sortOptions["createdAt"] = -1;
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(filter);

    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    const pagination = {
      totalPages: totalPages,
      currentPage: page,
      nextPage: nextPage,
      previousPage: previousPage,
    };

    return successResponse(res, {
      statusCode: 200,
      message: "Products fetched successfully",
      payload: {
        products: products,
        pagination: pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new product instance
const createProduct = async (req, res, next) => {
  try {
    const {} = req.body;

    // let slugWithIndex = slugify(name);
    // let index = 1;

    // while (true) {
    //   const isExistSlug = await Product.findOne({ slug: slugWithIndex });

    //   if (isExistSlug.length === 0) {
    //     break;
    //   }
    //   slugWithIndex = `${slugify(name)}-${index}`;
    //   index++;
    // }

    const productData = {};

    const newProduct = await Product.create(productData);

    return successResponse(res, {
      statusCode: 200,
      message: "Product was created successfully.",
      payload: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProducts, createProduct };
