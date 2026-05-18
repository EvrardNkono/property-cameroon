import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: String, enum: ['Kribi Marina', 'Douala Lendi Extension', 'Yaoundé Mvan', 'CAPEF Fund'], required: true },
  type: { type: String, enum: ['Copropriété', 'Achat-Revente', 'SCPI'], required: true },
  amount: { type: Number, required: true },
  currentValue: Number,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, enum: ['ACTIVE', 'MATURED', 'EXITED'], default: 'ACTIVE' },
  performance: {
    realizedGain: Number,
    realizedGainPercentage: Number,
    lastValuation: Date
  },
  dividends: [{
    amount: Number,
    date: Date,
    transactionRef: String
  }]
}, { timestamps: true });

export default mongoose.model('Investment', investmentSchema);
