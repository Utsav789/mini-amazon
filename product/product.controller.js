import express from 'express';

const router = express.Router();

router.post(
  '/product/add',
  (req, res, next) => {
    next();
  },
  (req, res) => {
    return res.status(201).send({ message: 'Product add...' });
  }
);

export { router as productController };