import express from "express";
import {
  USER_NOT_FOUND_MESSAGE,
  PRODUCT_NOT_FOUND_MESSAGE,
} from "../constants/errorMessages.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const productsRouter = express.Router();

productsRouter.get("/", async (_, res) => {
  try {
    const products = await Product.find();
    return res.send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findById(req.body.ownerId);

    if (!user) {
      return res.status(404).send(USER_NOT_FOUND_MESSAGE);
    }
    const timestamp = new Date();

    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      ownerEmail: user.email,
      ownerId: req.body.ownerId,
      postedAt: timestamp,
      lastUpdatedAt: timestamp,
    });

    await newProduct.save({ session });

    user.products.push(newProduct);

    await user.save({ session });

    await session.commitTransaction();

    return res.status(201).send(newProduct);
  } catch (error) {
    return res.status(500).send(error);
  }
});

productsRouter.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).send(PRODUCT_NOT_FOUND_MESSAGE);
    }

    return res.send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
});

productsRouter.put("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        lastUpdatedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).send(PRODUCT_NOT_FOUND_MESSAGE);
    }
    return res.send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
});

productsRouter.delete("/:productId", async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const product = await Product.findByIdAndDelete(
      req.params.productId
    ).session(session);

    if (!product) {
      return res.status(404).send(PRODUCT_NOT_FOUND_MESSAGE);
    }

    const user = await User.findById(product.ownerId);

    if (!user) {
      return res.status(404).send(USER_NOT_FOUND_MESSAGE);
    }

    user.products.pull(product);

    await user.save({ session });
    await session.commitTransaction();

    return res.send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default productsRouter;
