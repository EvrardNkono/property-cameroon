// backend/models/User.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Fonctions de normalisation
const normalizeRole = (role) => {
  if (!role) return role;
  
  const roleMap = {
    'agriculture': 'AGRICULTURE_OWNER',
    'agriculture_owner': 'AGRICULTURE_OWNER',
    'livestock': 'LIVESTOCK_OWNER',
    'livestock_owner': 'LIVESTOCK_OWNER',
    'investor': 'INVESTOR',
    'owner': 'OWNER',
    'buyer': 'BUYER',
    'admin': 'ADMIN'
  };
  
  const lowerRole = role.toLowerCase();
  return roleMap[lowerRole] || role;
};

const normalizeStatus = (status) => {
  if (!status) return 'PENDING';
  
  const validStatuses = ['PENDING', 'VERIFIED', 'SUSPENDED', 'BANNED', 'REJECTED'];
  if (validStatuses.includes(status)) return status;
  
  const statusMap = {
    'pending': 'PENDING',
    'verified': 'VERIFIED',
    'suspended': 'SUSPENDED',
    'banned': 'BANNED',
    'rejected': 'REJECTED'
  };
  
  const lowerStatus = status.toLowerCase();
  return statusMap[lowerStatus] || 'PENDING';
};

const normalizeKycStatus = (status) => {
  if (!status) return 'NOT_SUBMITTED';
  
  const validKycStatuses = ['NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED'];
  if (validKycStatuses.includes(status)) return status;
  
  const kycStatusMap = {
    'not submitted': 'NOT_SUBMITTED',
    'not_submitted': 'NOT_SUBMITTED',
    'pending': 'PENDING',
    'verified': 'VERIFIED',
    'rejected': 'REJECTED'
  };
  
  const lowerStatus = status.toLowerCase();
  return kycStatusMap[lowerStatus] || 'NOT_SUBMITTED';
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  
  roles: [{ 
    type: String, 
    enum: ['ADMIN', 'OWNER', 'INVESTOR', 'BUYER', 'AGRICULTURE', 'LIVESTOCK', 'AGRICULTURE_OWNER', 'LIVESTOCK_OWNER'], 
    default: ['BUYER'],
    set: function(value) {
      if (Array.isArray(value)) {
        return value.map(v => normalizeRole(v));
      }
      return normalizeRole(value);
    }
  }],
  
  status: { 
    type: String, 
    enum: ['PENDING', 'VERIFIED', 'SUSPENDED', 'BANNED', 'REJECTED', 'Pending', 'Verified', 'Suspended', 'Banned', 'Rejected'], 
    default: 'PENDING',
    set: normalizeStatus
  },
  
  kycStatus: { 
    type: String, 
    enum: ['NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED', 'Not Submitted', 'Pending', 'Verified', 'Rejected'], 
    default: 'NOT_SUBMITTED',
    set: normalizeKycStatus
  },
  
  kycDocuments: [{
    type: { type: String, enum: ['ID_CARD', 'PASSPORT', 'PROOF_OF_ADDRESS', 'TAX_ID'] },
    url: String,
    originalName: String,
    uploadedAt: { type: Date, default: Date.now },
    verifiedAt: Date,
    rejectedReason: String
  }],
  
  kycDocument: { type: String },
  kycSubmittedAt: { type: Date },
  kycVerifiedAt: { type: Date },
  kycRejectionReason: { type: String },
  
  profilePicture: { type: String },
  
  lastLogin: { type: Date },
  emailVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: Date },
  
  banReason: { type: String },
  bannedAt: { type: Date },
  isBanned: { type: Boolean, default: false },
  
  isActive: { type: Boolean, default: false },
  activatedAt: { type: Date },
  activatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date
  
}, { timestamps: true });

// ✅ CORRECTION FINALE - Version sans next() qui cause l'erreur
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasRole = function(role) {
  const normalizedRole = normalizeRole(role);
  return this.roles.includes(normalizedRole) || this.roles.includes(role);
};

userSchema.methods.hasAnyRole = function(roles) {
  return roles.some(role => this.hasRole(role));
};

userSchema.methods.isAccountActive = function() {
  const isActiveStatus = this.status === 'VERIFIED' || this.status === 'Verified';
  return this.isActive && isActiveStatus && !this.isBanned;
};

userSchema.methods.getFormattedRoles = function() {
  const roleLabels = {
    'ADMIN': 'Administrator',
    'OWNER': 'Property Owner',
    'INVESTOR': 'Investor',
    'BUYER': 'Buyer',
    'AGRICULTURE': 'Agriculture Owner',
    'LIVESTOCK': 'Livestock Owner',
    'AGRICULTURE_OWNER': 'Agriculture Owner',
    'LIVESTOCK_OWNER': 'Livestock Owner'
  };
  return this.roles.map(role => roleLabels[role] || role);
};

// Supprimer les index dupliqués
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ roles: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model('User', userSchema);