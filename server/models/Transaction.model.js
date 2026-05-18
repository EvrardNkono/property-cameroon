import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  type: { type: String, enum: ['INVESTMENT', 'PROPERTY_PURCHASE', 'DIVIDEND', 'FEE', 'SOURCE_PAYMENT'], required: true },
  amount: { value: Number, currency: { type: String, default: 'FCFA' } },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'], default: 'PENDING' },
  paymentMethod: { type: String, enum: ['BANK_TRANSFER', 'MOBILE_MONEY', 'CASH', 'CARD'] },
  metadata: mongoose.Schema.Types.Mixed,
  completedAt: Date
}, { timestamps: true });

transactionSchema.pre('save', async function(next) {
  if (!this.reference) {
    const date = new Date();
    const random = Math.floor(Math.random() * 10000);
    this.reference = `TXN-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${random}`;
  }
  next();
});

export default mongoose.model('Transaction', transactionSchema);
