import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner', // ربط مباشر بجدول الملاك اللي عملناه
    required: true
  },
  gateName: { type: String, required: true },     // البوابة (Main Entrance / Garage)
  activityType: { type: String, required: true }, // (Entry / Exit)
  status: { type: String, required: true },       // (Allowed / Denied)
  timestamp: { type: Date, default: Date.now }    // وقت الحركة بالثانية
});

export const Logs=mongoose.model('logs',LogSchema)