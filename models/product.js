const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32
    },
    description: {
      type: String,
      required: true,
      maxLength: 2000
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxLength: 32
    },
    category: {
      type: ObjectId,
      required: true,
      ref: "Category"
    },
    quantity: {
      type: Number
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    shipping: {
      required: false,
      type: Boolean
    },
    sold: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
