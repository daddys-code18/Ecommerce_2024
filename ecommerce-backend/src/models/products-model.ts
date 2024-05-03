import mongoose, { Schema } from "mongoose";

const productShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please  enter your name"],
    },
    photo: {
      type: String,
      required: [true, "Please  provide photo"],
    },
    price: {
      type: Number,
      required: [true, "Please  enter  price"],
    },
    stock: {
      type: Number,
      required: [true, "Please  enter your Stock"],
    },
    category: {
      type: String,
      required: [true, "Please  enter  product Category"],
      trim: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productShema);
