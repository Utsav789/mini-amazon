import express from "express";
import connectDB from "./db.connection.js";
import { userController } from "./user/user.controller.js";
import { productController } from "./product/product.controller.js";
import { cartController } from "./cart/cart.controller.js";

// backend app
const app = express();

// to make app understand json
app.use(express.json());

// connect database
await connectDB();

// TODO: rate limiting

// register routes/controller
app.use(userController);
app.use(productController);
app.use(cartController);

// network port
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
