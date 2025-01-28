import mongoose from "mongoose";

//? set rule/Schema

const cartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.ObjectId,
    required: true,
    ref: "User",
  },
  productId: {
    type: mongoose.ObjectId,
    required: true,
    ref: "Product",
  },
  orderedQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

//? create table/model

const cartTable = mongoose.model("Cart", cartSchema);

export default cartTable;
