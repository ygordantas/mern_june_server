import express from "express";
import dummyProducts from "../dummyData/products.js";

const productsRouter = express.Router();

productsRouter.get("/", (_, res) => {
  res.send(dummyProducts);
});

productsRouter.post("/", (req, res) => {
  const newProduct = {
    ...req.body,
    postedAt: new Date(),
    id: dummyProducts.length + 1,
  };

  dummyProducts.push(newProduct);

  res.status(201).send(newProduct);
});

productsRouter.put("/:productId", (req, res) => {
  const productId = req.params.productId;
  const productToUpdate = dummyProducts.find(
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
  const productToDeleteIndex = dummyProducts.findIndex(
    (product) => product.id == productId
  );

  if (productToDeleteIndex === -1)
    return res.status(404).send("Product not found.");

  const deletedProduct = dummyProducts.splice(productToDeleteIndex, 1);

  res.send(deletedProduct[0]);
});

export default productsRouter;
