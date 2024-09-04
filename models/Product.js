import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  postedAt: { type: Date, required: true },
  lastUpdatedAt: { type: Date, required: true },
  description: { type: String },
  images: [{ type: String }],
  ownerId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  ownerEmail: { type: String, required: true },
});

productSchema.method("toJSON", function () {
  const { _id, __v, ...product } = this.toObject();
  product.id = _id;
  return product;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
