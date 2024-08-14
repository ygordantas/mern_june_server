import bodyParser from "body-parser";
import express from "express";
import dummyProducts from "./dummyData/products.js";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.send(dummyProducts);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
