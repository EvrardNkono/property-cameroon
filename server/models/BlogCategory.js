import mongoose from 'mongoose';

const blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  icon: {
    type: String,
    default: '🏷️'
  },
  color: {
    type: String,
    default: '#c5a059'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    trim: true,
    default: ''
  },
  metaDescription: {
    type: String,
    maxLength: 160,
    default: ''
  }
}, {
  timestamps: true
});

blogCategorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  next();
});

export default mongoose.model('BlogCategory', blogCategorySchema);