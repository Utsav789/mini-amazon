import express from "express";
import { isBuyer } from "../middleware/authentication.middleware.js";
import { addItemToCartSchema } from "./cart.validation.js";
import ProductTable from "../product/product.model.js";
import cartTable from "./cart.model.js";
import mongoose from "mongoose";
import { validateMongoIdFromReqParams } from "../middleware/validate.mongo.id.js";
import { isOwnerOfCart } from "./cart.middleware.js";

const router = express.Router();

router.post(
  "/cart/item/add",
  isBuyer,
  async (req, res, next) => {
    try {
      const validateData = await addItemToCartSchema.validate(req.body);
      req.body = validateData;
      next();
    } catch (error) {
      return res.status(409).send({ message: "error during validation." });
    }
  },
  (req, res, next) => {
    // extract productId from req.body
    const productId = req.body.productId;

    // check if it is valid mongoId or not
    const isValid = mongoose.isValidObjectId(productId);

    if (!isValid) {
      return res.status(409).send({ message: "Invalid mongoId" });
    }
    next();
  },
  async (req, res) => {
    // extract productId from req.body
    const productId = req.body.productId;

    // find product

    const product = await ProductTable.findOne({ _id: productId });

    if (!product) {
      return res.status(409).send({ message: "Product does not exist" });
    }

    //extract orderedQuantity
    const orderedQuantity = req.body.orderedQuantity;

    // check if order is greater than the stock
    if (orderedQuantity > product.quantity) {
      return res
        .status(409)
        .send({ message: "The required number of order is not available" });
    }

    const cart = await cartTable.create({
      buyerId: req.loggedInId,
      productId,
      orderedQuantity,
    });

    return res.status(200).send({ message: "added to cart", cart: cart });
  }
);
//! here the assumptions is that a single cart is created for a buyer
//! and we add and delete product in the same cart

//? if no cart then only create a cart otherwise add in the same cart
//? productId of cart schema must be an array for this

//? now to delete all in this condition we should
//? 1.we should check isBuyer
//? 2.validMongoId =>cartId in params
//? 3.isOwnerOfCart
//? 4. the delete all query should run

//? to delete a single item
//? 1.we should check isBuyer
//? 2.validMongoId =>cartId in params
//? 3.isOwnerOfCart
//? 4.check product id and search that in cart
//? 5.run update query for that => cartTable.updateOne({_id:cartId},{$pull:{productId:productId}});

//! for this case where in each time a new cartId is generated when we add a product
//! to delete all
//? cartTable.deleteMany({buyerId:buyerId})

//delete one item using cartId
router.delete(
  "/cart/delete/item/:id",
  isBuyer,
  validateMongoIdFromReqParams,
  isOwnerOfCart,
  async (req, res) => {
    const cartId = req.params.id;
    // delete all from cart

    await cartTable.deleteMany({ _id: cartId });

    return res.status(200).send({ message: "The cart is flushed" });
  }
);

// to delete all items added by that buyer
router.delete(
  "/cart/item/flush",
  isBuyer,

  async (req, res) => {
    // delete all from cart

    await cartTable.deleteMany({ buyerId: req.loggedInId });

    return res.status(200).send({ message: "The cart is flushed" });
  }
);

//list carts
router.post("/cart/getList", isBuyer, async (req, res) => {
  const cart = await cartTable.aggregate([
    {
      $match: { buyerId: req.loggedInId },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $project: {
        orderedQuantity: 1,
        productName: "$productDetail.name",
        productPrice: "$productDetail.price",
        productQuantity: "$productDetail.quantity",
        productImage: "$productDetail.image",
        productCategory: "$productDetail.category",
        productBrand: "$productDetail.brand",
      },
    },
  ]);
  console.log(cart[0].productId);
  return res.status(200).send({ message: "cart of that buyer" });
});
export { router as cartController };
