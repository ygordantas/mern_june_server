import bodyParser from "body-parser";
import express from "express";
import productsRouter from "./routers/productsRouter.js";
import usersRouter from "./routers/usersRouter.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(bodyParser.json());

app.use("/products", productsRouter);

app.use("/users", usersRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
