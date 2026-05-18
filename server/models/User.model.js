import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  roles: [{ 
    type: String, 
    enum: ['ADMIN', 'OWNER', 'INVESTOR', 'BUYER', 'AGRICULTURE', 'LIVESTOCK'], 
    default: ['BUYER'] 
  }],
  status: { type: String, enum: ['Pending', 'Verified', 'Suspended', 'Banned'], default: 'Pending' },
  kycStatus: { type: String, enum: ['Not Submitted', 'Pending', 'Verified', 'Rejected'], default: 'Not Submitted' },
  kycDocuments: [{
    type: { type: String, enum: ['ID_CARD', 'PASSPORT', 'PROOF_OF_ADDRESS', 'TAX_ID'] },
    url: String,
    verifiedAt: Date
  }],
  profilePicture: String,
  lastLogin: Date,
  banReason: String,
  bannedAt: Date
}, { timestamps: true });

// ✅ async/await — plus de confusion avec next()
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);