const express = require("express");

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const { validateCategory } = require("../validators/category");
const { handleCreateCategory, getCategories, handleUpdateCategory, handleDeleteCategory, handleGetCategory } = require("../controllers/categoryController");
const categoryRouter = express.Router();

categoryRouter.post("/", validateCategory, runValidation, isLoggedIn, isAdmin, handleCreateCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", handleGetCategory);
categoryRouter.put("/:slug", isLoggedIn, isAdmin, handleUpdateCategory);
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategory);


module.exports = categoryRouter;
