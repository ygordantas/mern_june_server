import express from "express";
import {
  USER_NOT_FOUND_MESSAGE,
  PRODUCT_NOT_FOUND_MESSAGE,
} from "../constants/errorMessages.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import imageUpload from "../middlewares/imageUpload.js";
import fs from "fs";
import checkAuth from "../middlewares/auth.js";

const productsRouter = express.Router();

productsRouter.use(checkAuth);

productsRouter.get("/", async (_, res) => {
  try {
    const products = await Product.find();
    return res.send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
});

productsRouter.get("/users/:userId", async (req, res) => {
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

productsRouter.post("/", imageUpload.array("images"), async (req, res) => {
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
      images: req.files.map((file) => `/uploads/images/${file.filename}`),
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

productsRouter.put(
  "/:productId",
  imageUpload.array("images"),
  async (req, res) => {
    try {
      const productId = req.params.productId;

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).send(PRODUCT_NOT_FOUND_MESSAGE);
      }

      if (product.ownerId.toString() !== req.userData.id) {
        return res
          .status(401)
          .send("Request user id is not the owner of the product");
      }

      product.name = req.body.name;
      product.price = req.body.price;
      product.description = req.body.description;
      product.lastUpdatedAt = new Date();
      product.name = req.body.name;
      product.images = [
        ...product.images,
        ...req.files.map((file) => `/uploads/images/${file.filename}`),
      ];

      await product.save();

      return res.send(product);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
);

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

    if (product.ownerId.toString() !== req.userData.id) {
      return res
        .status(401)
        .send("Request user id is not the owner of the product");
    }

    const user = await User.findById(product.ownerId);

    if (!user) {
      return res.status(404).send(USER_NOT_FOUND_MESSAGE);
    }

    user.products.pull(product);

    await user.save({ session });
    await session.commitTransaction();

    if (product.images.length > 0) {
      product.images.forEach((imagePath) =>
        fs.unlinkSync(`${process.cwd()}${imagePath}`)
      );
    }

    return res.send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
});

productsRouter.delete("/:productId/images/:imageName", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).send(PRODUCT_NOT_FOUND_MESSAGE);
    }

    if (product.ownerId.toString() !== req.userData.id) {
      return res
        .status(401)
        .send("Request user id is not the owner of the product");
    }

    const imageToDeleteIndex = product.images.findIndex((imagePath) => {
      const splitted = imagePath.split("/");
      const fileName = splitted.pop();

      return fileName === req.params.imageName;
    });

    if (imageToDeleteIndex === -1) {
      return res
        .status(404)
        .send("Image with the provided name was not found.");
    }

    const copy = [...product.images];
    fs.unlinkSync(`${process.cwd()}${copy[imageToDeleteIndex]}`);

    copy.splice(imageToDeleteIndex, 1);
    product.images = copy;

    await product.save();

    return res.send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default productsRouter;
