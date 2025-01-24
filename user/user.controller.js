import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import {
  loginCredentialSchema,
  registerUserSchema,
} from './user.validation.js';
import UserTable from './user.model.js';

const router = express.Router();

// point to remember
// check if user with provided email already exits
// hash password, do not store plain password

router.post(
  '/user/register',
  async (req, res, next) => {
    try {
      const validatedData = await registerUserSchema.validate(req.body);

      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract new user from req.body
    const newUser = req.body;

    //   find user with email
    const user = await UserTable.findOne({ email: newUser.email });

    // if user, throw error
    if (user) {
      return res.status(409).send({ message: 'User already exists.' });
    }

    // hash password
    // requirement:plain password, saltRound
    const plainPassword = newUser.password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    //   replace plain password with hashed password
    newUser.password = hashedPassword;

    //   create user
    await UserTable.create(newUser);

    return res
      .status(201)
      .send({ message: 'User is registered successfully.' });
  }
);

router.post(
  '/user/login',
  async (req, res, next) => {
    try {
      const validatedData = await loginCredentialSchema.validate(req.body);

      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract loginCredentials from req.body
    const loginCredentials = req.body;

    // find user with provided email
    const user = await UserTable.findOne({ email: loginCredentials.email });

    // if not user,throw error
    if (!user) {
      return res.status(404).send({ message: 'Invalid credentials.' });
    }

    // check for password match
    // requirement: plain password, hashed password
    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;
    const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

    if (!isPasswordMatch) {
      return res.status(404).send({ message: 'Invalid credentials.' });
    }

    // generate token
    // payload => object inside token
    const payload = { email: user.email };
    const secretKey = 'ajfdkadjak8329jkdakdj';

    const token = jwt.sign(payload, secretKey, {
      expiresIn: '7d',
    });

    // remove password before sending to user
    user.password = undefined;

    return res
      .status(200)
      .send({ message: 'success', accessToken: token, userDetails: user });
  }
);

export { router as userController };