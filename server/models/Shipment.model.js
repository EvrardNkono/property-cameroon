import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  reference: { type: String, unique: true, required: true },
  product: {
    name: String,
    description: String,
    quantity: Number,
    unit: String
  },
  origin: { country: String, city: String, port: String },
  destination: { country: String, city: String, port: String },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cargoValue: Number,
  status: { type: String, enum: ['WAREHOUSE', 'AT_SEA', 'PORT_ARRIVAL', 'CUSTOMS', 'DELIVERED'], default: 'WAREHOUSE' },
  currentLocation: String,
  eta: Date,
  progress: { type: Number, min: 0, max: 100, default: 0 },
  tracking: [{
    status: String,
    location: String,
    date: Date,
    description: String
  }],
  documents: [String],
  containerNumber: String
}, { timestamps: true });

export default mongoose.model('Shipment', shipmentSchema);
