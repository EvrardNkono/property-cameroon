import mongoose from 'mongoose';

const roleRequestSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  requestedRoles: [{ 
    type: String, 
    enum: ['BUYER', 'OWNER', 'INVESTOR', 'AGRICULTURE', 'LIVESTOCK', 'AGRICULTURE_OWNER', 'LIVESTOCK_OWNER'] 
  }],
  currentRoles: [{ type: String }],
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  reason: { type: String }, // Raison donnée par l'utilisateur (optionnel)
  adminNote: { type: String }, // Note de l'admin lors du refus
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('RoleRequest', roleRequestSchema);