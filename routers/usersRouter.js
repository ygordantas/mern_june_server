import express from "express";
import userValidator from "../validators/userValidator.js";
import { USER_NOT_FOUND_MESSAGE } from "../constants/errorMessages.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import bcrypt from "bcryptjs";

const usersRouter = express.Router();

usersRouter.get("/:userId/products", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userProducts = await Product.find({
      ownerId: userId,
    });
    return res.send(userProducts);
  } catch (error) {
    return res.status(500).send(error);
  }
});

usersRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) res.status(404).send(USER_NOT_FOUND_MESSAGE);

    return res.send({ id: user.id, email: user.email });
  } catch (error) {
    return res.status(500).send(error);
  }
});

usersRouter.post("/", async (req, res) => {
  const validationErrors = userValidator(req.body);

  if (validationErrors.length > 0) {
    res.status(400).send(validationErrors.join(", "));
    return;
  }

  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    password,
    repeatPassword,
    address,
  } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  if (password !== repeatPassword) {
    res.status(400).send("Passwords don't match.");
    return;
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      res.status(400).send("An user with the provided email already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      dateOfBirth,
      password: hashedPassword,
      address,
    });

    await newUser.save();

    return res.status(201).send({ id: newUser.id });
  } catch (error) {
    res.status(500).send(error);
    return;
  }
});

usersRouter.post("/login", async (req, res) => {
  const normalizedEmail = req.body.email.trim().toLowerCase();
  const password = req.body.password;

  try {
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).send(USER_NOT_FOUND_MESSAGE);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).send("Invalid credentials");
    }

    return res.send({ id: user.id });
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default usersRouter;
