import express from "express";
import DUMMY_PRODUCTS from "../dummyData/products.js";

const usersRouter = express.Router();

usersRouter.get("/:userId/products", (req, res) => {
  const userId = req.params.userId;

  if (!userId) return res.status(404).send("User not found.");

  const userProducts = DUMMY_PRODUCTS.filter(
    (product) => product.ownerId == userId
  );

  res.send(userProducts);
});

export default usersRouter;
