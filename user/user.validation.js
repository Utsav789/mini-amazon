import yup from 'yup';
import dayjs from 'dayjs';

export const loginCredentialSchema = yup.object({
  email: yup.string().email().required().trim().lowercase(),
  password: yup.string().required().trim(),
});

export const registerUserSchema = yup.object({
  email: yup
    .string()
    .email('Must be a valid email address.')
    .required('Email is required.')
    .trim()
    .lowercase()
    .max(100),
  password: yup.string().required().trim().min(8).max(30),
  firstName: yup.string().required().trim().max(100),
  lastName: yup.string().required().trim().max(100),
  dob: yup.date().max(dayjs(), 'DOB cannot be future date.').notRequired(),
  gender: yup.string().required().trim().oneOf(['male', 'female', 'other']),
  role: yup.string().required().trim().oneOf(['seller', 'buyer']),
  address: yup.string().required().trim().max(255),
});