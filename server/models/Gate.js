import mongoose from "mongoose";

const gateSchema = new mongoose.Schema({
    gateName: { type: String, required: true },
    type: { type: String, enum: ['Vehicle', 'Pedestrian'], default: 'Vehicle' }, // عربيات أو مشاة
    ipAddress: { type: String, required: true },
    apiKey: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'closed' }
});

export const Gates = mongoose.model("Gates", gateSchema);