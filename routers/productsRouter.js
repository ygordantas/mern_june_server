import express from "express";
import DUMMY_PRODUCTS from "../dummyData/products.js";
import { PRODUCT_NOT_FOUND_MESSAGE } from "../constants/errorMessages.js";
import fileUpload from "../middlewares/fileUpload.js";
import fs from "fs";

const productsRouter = express.Router();

productsRouter.get("/", (_, res) => {
  res.send(DUMMY_PRODUCTS);
});

productsRouter.post("/", fileUpload.array("images"), (req, res) => {
  const newProduct = {
    ...req.body,
    postedAt: new Date(),
    id: DUMMY_PRODUCTS.length + 1,
    images: req.files.map((file) => "/uploads/images/" + file.filename),
  };

  DUMMY_PRODUCTS.push(newProduct);

  res.status(201).send(newProduct);
});

productsRouter.get("/:productId", (req, res) => {
  const productId = req.params.productId;

  const product = DUMMY_PRODUCTS.find((product) => product.id == productId);

  if (!product) res.status(404).send(PRODUCT_NOT_FOUND_MESSAGE);

  res.send(product);
});

productsRouter.put("/:productId", (req, res) => {
  const productId = req.params.productId;
  const productToUpdate = DUMMY_PRODUCTS.find(
    (product) => product.id == productId
  );

  if (!productToUpdate) return res.status(404).send(PRODUCT_NOT_FOUND_MESSAGE);

  productToUpdate.name = req.body.name;
  productToUpdate.images = req.body.images;
  productToUpdate.price = req.body.price;

  res.send(productToUpdate);
});

productsRouter.delete("/:productId", (req, res) => {
  const productId = req.params.productId;
  const productToDeleteIndex = DUMMY_PRODUCTS.findIndex(
    (product) => product.id == productId
  );

  if (productToDeleteIndex === -1)
    return res.status(404).send(PRODUCT_NOT_FOUND_MESSAGE);

  const productToDelete = DUMMY_PRODUCTS[productToDeleteIndex];

  if (productToDelete.images.length > 0) {
    productToDelete.images.forEach((imagePath) =>
      fs.unlinkSync(`${process.cwd()}/uploads/images/${imagePath}`)
    );
  }

  const deletedProduct = DUMMY_PRODUCTS.splice(productToDeleteIndex, 1);

  res.send(deletedProduct[0]);
});

export default productsRouter;
