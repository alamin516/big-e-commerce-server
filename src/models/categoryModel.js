const { Schema, model } = require("mongoose");
const { defaultImagePath } = require("../secret");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      unique: true,
      trim: true,
      minlength: [3, "The length of Category name can be minimum 3 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug name is required."],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    meta: {
      title: {
        type: String,
        default: () => this.name,
      },
      description: {
        type: String,
        default: () => this.description,
      },
      keywords: [String],
    },
    image: {
      type: String,
      default: defaultImagePath,
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);

module.exports = Category;
