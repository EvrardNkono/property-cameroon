import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['TITLE_DEED', 'SURVEY', 'BUILDING_PERMIT', 'ID_CARD', 'CONTRACT', 'RECEIPT'], required: true },
  fileUrl: { type: String, required: true },
  fileType: String,
  fileSize: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  rejectionReason: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
