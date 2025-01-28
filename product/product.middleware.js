import ProductTable from "./product.model.js";

export const isOwnerOfProduct = async (req, res, next) => {
  // extract id from params
  const productId = req.params.id;

  // find product through id
  const product = await ProductTable.findOne({ _id: productId });

  if (!product) {
    return res.status(400).send({ message: "Product does not exists" });
  }

  // console.log(product);
  //check if the seller deleting the id is the same seller who added it or not
  const isOwnerOfProduct = product.sellerId.equals(req.loggedInId);
  //? alternative code
  //? const isOwnerOfProduct = product.sellerId.toString() === req.loggedInId.toString();

  if (!isOwnerOfProduct) {
    return res
      .status(409)
      .send({ message: "You are not authorized to delete this product" });
  }
  next();
};
