import express from "express";
import DUMMY_PRODUCTS from "../dummyData/products.js";
import DUMMY_USERS from "../dummyData/users.js";
import userValidator from "../validators/userValidator.js";
import { USER_NOT_FOUND_MESSAGE } from "../constants/errorMessages.js";

const usersRouter = express.Router();

usersRouter.get("/:userId/products", (req, res) => {
  const userId = req.params.userId;

  if (!userId) return res.status(404).send(USER_NOT_FOUND_MESSAGE);

  const userProducts = DUMMY_PRODUCTS.filter(
    (product) => product.ownerId == userId
  );

  res.send(userProducts);
});

usersRouter.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  const user = DUMMY_USERS.find((user) => user.id == userId);

  if (!user) res.status(404).send(USER_NOT_FOUND_MESSAGE);

  res.send({ id: user.id, email: user.email });
});

usersRouter.post("/", (req, res) => {
  const newUser = req.body;
  const validationErrors = userValidator(newUser);

  if (validationErrors.length > 0) {
    res.status(400).send(validationErrors.join(", "));
    return;
  }

  if (newUser.password !== newUser.repeatPassword) {
    res.status(400).send("Passwords don't match.");
    return;
  }

  if (DUMMY_USERS.find((user) => user.email == newUser.email)) {
    res.status(400).send("An user with the provided email already exists.");
    return;
  }

  newUser.id = DUMMY_USERS.length + 1;

  DUMMY_USERS.push(newUser);

  res.status(201).send({ ...newUser, password: null, repeatPassword: null });
});

export default usersRouter;
