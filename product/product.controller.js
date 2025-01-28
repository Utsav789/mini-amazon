import express from "express";
import { productSchema } from "./product.validation.js";
import ProductTable from "./product.model.js";
import {
  isBuyer,
  isSeller,
  isUser,
} from "../middleware/authentication.middleware.js";
import { validateMongoIdFromReqParams } from "../middleware/validate.mongo.id.js";
import { validateReqBody } from "../middleware/validate.req.body.middleware.js";
import { paginationSchema } from "../shared/pagination.schema.js";
import { isOwnerOfProduct } from "./product.middleware.js";

const router = express.Router();

// add product for user
router.post(
  "/product/add",
  isSeller,
  validateReqBody(productSchema),
  async (req, res) => {
    try {
      //? extract new product from req.body
      const newProduct = req.body;
      const sellerId = req.loggedInId;
      //? create product
      await ProductTable.create({ ...newProduct, sellerId });

      //? send response
      return res.status(201).send({ message: "Product add successfully" });
    } catch (error) {
      //? if it fails to create a product then send error message
      return res.status(401).send({ message: error.message });
    }
  }
);

// get product for any user
router.get(
  "/product/detail/:id",
  isUser,
  validateMongoIdFromReqParams,
  async (req, res) => {
    // extract product id from params
    const productId = req.params.id;

    // find product by product id
    const product = await ProductTable.findOne({ _id: productId });

    //if no product throw error
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    return res.status(200).send({ message: "success", productDetail: product });
  }
);

// list products by buyerList
router.post(
  "/product/buyer/list",
  isBuyer,
  validateReqBody(paginationSchema),
  async (req, res) => {
    //? extract pagination data from req.body
    const paginationData = req.body;

    const limit = paginationData.limit;
    const page = paginationData.page;

    const skip = (page - 1) * limit;

    const products = await ProductTable.aggregate([
      {
        $match: {},
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    //? calculate page Number required
    const totalItems = await ProductTable.find().countDocuments();

    const totalPage = Math.ceil(totalItems / limit);

    return res.status(200).send({
      message: "Success",
      productList: products,
      totalPage,
    });
  }
);

// list product by seller
router.post(
  "/product/seller/list",
  isSeller,
  validateReqBody(paginationSchema),
  async (req, res) => {
    //? extract pagination data from req.body
    const paginationData = req.body;

    const limit = paginationData.limit;
    const page = paginationData.page;

    const skip = (page - 1) * limit;
    const sellerId = req.loggedInId;

    const products = await ProductTable.aggregate([
      {
        $match: { sellerId },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          sellerId: 0,
        },
      },
    ]);

    const totalItems = await ProductTable.find().countDocuments();

    const totalPage = Math.ceil(totalItems / limit);

    return res
      .status(200)
      .send({ message: "Success", productList: products, totalPage });
  }
);

// delete product by id
router.delete(
  "/product/delete/:id",
  isSeller,
  validateMongoIdFromReqParams,
  isOwnerOfProduct,
  async (req, res) => {
    const productId = req.params.id;

    //? deleting product
    await ProductTable.deleteOne({ _id: productId });

    return res.status(200).send({ message: "product is deleted Successfully" });
  }
);

// edit product
router.put(
  "/product/edit/:id",
  isSeller,
  validateMongoIdFromReqParams,
  isOwnerOfProduct,
  validateReqBody(productSchema),
  async (req, res) => {
    //extract product id from req.params
    const productId = req.params.id;
    console.log("hi");
    const product = await ProductTable.findOne({ _id: productId });
    // extract new values from req body

    const newValues = req.body;

    await ProductTable.updateOne(
      { _id: productId },
      {
        $set: {
          ...newValues,
        },
      }
    );
    return res.status(200).send({ message: "product is updated Successfully" });
  }
);
export { router as productController };
