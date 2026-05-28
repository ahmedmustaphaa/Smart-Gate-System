import mongoose from 'mongoose';

const residentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  propertyId: { type: String, required: true }, // رقم الفيلا أو الشقة
  role: { type: String, default: 'resident' }
}, { timestamps: true });

export default mongoose.model('Resident', residentSchema);