import mongoose from 'mongoose';

const blogCategorySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String },
  icon:        { type: String, default: '🏷️' },
  color:       { type: String, default: '#c5a059' },
  isActive:    { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  metaTitle:       { type: String },
  metaDescription: { type: String },
}, { timestamps: true });

export default mongoose.models.BlogCategory || mongoose.model('BlogCategory', blogCategorySchema);