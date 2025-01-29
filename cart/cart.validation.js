import yup from "yup";

export const addItemToCartSchema = yup.object({
  productId: yup.string().required().trim(),
  orderedQuantity: yup.number().min(1).required(),
});
