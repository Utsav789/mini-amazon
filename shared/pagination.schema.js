import yup from "yup";

export const paginationSchema = yup.object({
  
  page: yup.number().default(1).integer().min(1),
  limit: yup.number().default(1).integer().min(1),
});

