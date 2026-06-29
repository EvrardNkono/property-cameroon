import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  slug:    { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['Real Estate', 'Agriculture', 'Sourcing', 'Lifestyle'],
    required: true
  },
  featuredImage: { type: String, default: null },
  tags:          { type: [String], default: [] },
  metaKeywords:  { type: [String], default: [] },
  isFeatured:    { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName:  { type: String, default: 'Property Cameroun' },
  views:       { type: Number, default: 0 },
  publishedAt: { type: Date },
  seoTitle:       { type: String },
  seoDescription: { type: String },
  translations: {
    fr: { title: String, excerpt: String, content: String, seoTitle: String, seoDescription: String },
    en: { title: String, excerpt: String, content: String, seoTitle: String, seoDescription: String }
  }
}, { timestamps: true });

// models/BlogPost.js - Version corrigée
blogPostSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ '$**': 'text' });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);