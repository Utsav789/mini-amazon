export const validateReqBody = (validationSchema) => {
  return async (req, res, next) => {
    try {
      // console.log("hello");
      const validateData = await validationSchema.validate(req.body);
      // console.log("hello");

      req.body = validateData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  };
};
