import express from "express";
import { productSchema } from "./product.validation.js";
import ProductTable from "./product.model.js";
import { isSeller, isUser } from "../middleware/authentication.middleware.js";
import { validateMongoIdFromReqParams } from "../middleware/validate.mongo.id.js";

const router = express.Router();

router.post(
  "/product/add",
  isSeller,
  async (req, res, next) => {
    try {
      //? validate data => req.body using yup system
      const validateData = await productSchema.validate(req.body);

      req.body = validateData;
      //? call next function
      next();
    } catch (error) {
      //? if validation fails send error message
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    try {
      //? extract new product from req.body
      const newProduct = req.body;
      //? create product
      await ProductTable.create(newProduct);
      //? send response
      return res.status(201).send({ message: "Product add successfully" });
    } catch (error) {
      //? if it fails to create a product then send error message
      return res.status(401).send({ message: error.message });
    }
  }
);

router.get(
  "/product/detail/:id",
  isUser,
  validateMongoIdFromReqParams,
  async (req, res) => {
    return res.status(200).send({ message: "Product Detail...." });
  }
);

router.delete("/product/delete/:id",isSeller,validateMongoIdFromReqParams, async (req,res)=>{
  return res.status(200).send({message:"product deleted"})
})

export { router as productController };
