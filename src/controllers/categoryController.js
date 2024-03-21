const createError = require("http-errors");

const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const { default: slugify } = require("slugify");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name, description, image, meta } = req.body;

    const isExistCategory = await Category.findOne({ name });

    if (isExistCategory) {
      throw createError(409, "The category already exists.");
    }

    const data = {
      name,
      slug: slugify(name),
      description,
      meta: {
        ...meta,
        title: name,
        description: description,
      },
      image,
    };

    const category = await Category.create(data);

    return successResponse(res, {
      statusCode: 200,
      message: "Category was created successfully.",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = req.query.page || 1;
    const limit = req.query.limit || 15;

    const filter = {};

    if (search) {
      const searchRegExp = new RegExp(".*" + search + ".*", "i");
      filter.$or = [{ name: { $regex: searchRegExp } }];
    }

    let sortOptions = {};
    if (req.query.sort === "ascending") {
      sortOptions["createdAt"] = 1;
    } else if (req.query.sort === "descending") {
      sortOptions["createdAt"] = -1;
    }

    const categories = await Category.find(filter).select("name slug").lean()
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Category.countDocuments(filter);

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
      message: "Categories were fetched successfully.",
      payload: {
        categories: categories,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetCategory = async (req, res, next) => {
  try {
    const {slug}= req.params;
    const category = await Category.find({slug}).select("name slug").lean();

    return successResponse(res, {
      statusCode: 200,
      message: "Category was fetched successfully.",
      payload: category
    });
  } catch (error) {
    next(error);
  }
};
const handleUpdateCategory = async (req, res, next) => {
  try {
    const {slug}= req.params;
    const category = await Category.find({slug}).select("name slug").lean();

    return successResponse(res, {
      statusCode: 200,
      message: "Category was fetched successfully.",
      payload: category
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteCategory = async (req, res, next) => {
  try {
    const {slug} = req.params;
    const isExist = await Category.findOne({slug});

    if (!isExist) {
      throw createError(404, "Category does not exist");
    }

    await Category.deleteOne({slug});

    return successResponse(res, {
      statusCode: 200,
      message: "Category was deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateCategory, getCategories, handleGetCategory, handleUpdateCategory, handleDeleteCategory };
