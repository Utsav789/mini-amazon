import cartTable from "./cart.model.js";

export const isOwnerOfCart = async (req, res, next) => {
  //extract cart id from req params
  const cartId = req.params.id;
  //search for cart using cart id
  const cart = await cartTable.findOne({ _id: cartId });

  //! alternative code => this will return cart if the logged in user is the owner of the cart

  // const cart = await cartTable.findOne({
  //   _id: cartId,
  //   buyerId: req.loggedInId,
  // });

  if (!cart) {
    return res.status(409).send({ message: "The cart is not available" });
  }
  //check if the buyer id in the cart is same as that in token or not
  const isOwner = cart.buyerId.equals(req.loggedInId);
  if (!isOwner) {
    return req.status(409).send({ message: "You are not the owner" });
  }

  next();
};
