import express from "express";
import DUMMY_PRODUCTS from "../dummyData/products.js";

const productsRouter = express.Router();

productsRouter.get("/", (_, res) => {
  res.send(DUMMY_PRODUCTS);
});

productsRouter.post("/", (req, res) => {
  const newProduct = {
    ...req.body,
    postedAt: new Date(),
    id: DUMMY_PRODUCTS.length + 1,
  };

  DUMMY_PRODUCTS.push(newProduct);

  res.status(201).send(newProduct);
});

productsRouter.get("/:productId", (req, res) => {
  const productId = req.params.productId;

  const product = DUMMY_PRODUCTS.find((product) => product.id == productId);

  if (!product) res.status(404).send("Product not found");

  res.send(product);
});

productsRouter.put("/:productId", (req, res) => {
  const productId = req.params.productId;
  const productToUpdate = DUMMY_PRODUCTS.find(
    (product) => product.id == productId
  );

  if (!productToUpdate) return res.status(404).send("Product not found.");

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
    return res.status(404).send("Product not found.");

  const deletedProduct = DUMMY_PRODUCTS.splice(productToDeleteIndex, 1);

  res.send(deletedProduct[0]);
});

export default productsRouter;
