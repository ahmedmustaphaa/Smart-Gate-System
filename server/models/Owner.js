import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  unitNumber: { type: String, required: true }, // رقم الشقة
  carNumber: { type: String }, // اختياري
  status: { type: String, default: "Active" }, // Active أو Inactive
}, { timestamps: true });

export const Owner = mongoose.model("Owner", ownerSchema);