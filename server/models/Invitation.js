import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident', // ربط الدعوة بالساكن اللي عملها
    required: true
  },
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'used', 'expired'],
    default: 'pending' // بتبدأ معلقة، ولما فرد الأمن يعمل سكان تتحول لـ used
  },
  isUsed: {
    type: Boolean,
    default: false // أول ما فرد الأمن يعمل سكان بتتحول لـ true عشان نضمن إنها Single Use
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // التوكن ده يتمسح أوتوماتيك من الداتا بيز بعد 24 ساعة (صلاحية الزيارة)
  }
}, { timestamps: true });

export default mongoose.model('Invitation', invitationSchema);