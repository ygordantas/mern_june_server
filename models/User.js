import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  address: {
    type: {
      street: { type: String, required: true },
      number: { type: Number, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      unit: { type: String },
    },
    required: true,
  },
  products: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
});

const User = mongoose.model("User", userSchema);

export default User;
