const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  // Informations de base
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Le résumé est requis'],
    maxLength: 300
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis']
  },
  
  // Catégorie
  category: {
    type: String,
    required: true,
    enum: ['Real Estate', 'Agriculture', 'Sourcing', 'Lifestyle']
  },
  
  // Images
  featuredImage: {
    type: String,
    required: [true, 'L\'image principale est requise']
  },
  galleryImages: [{
    type: String
  }],
  
  // SEO
  seoTitle: {
    type: String,
    trim: true
  },
  seoDescription: {
    type: String,
    maxLength: 160
  },
  metaKeywords: [{
    type: String
  }],
  
  // Auteur
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  
  // Dates
  publishedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Statut
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  // Featured (à la une)
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Vues
  views: {
    type: Number,
    default: 0
  },
  
  // Tags
  tags: [{
    type: String,
    trim: true
  }],
  
  // Traductions
  translations: {
    en: {
      title: String,
      excerpt: String,
      content: String,
      seoTitle: String,
      seoDescription: String
    },
    fr: {
      title: String,
      excerpt: String,
      content: String,
      seoTitle: String,
      seoDescription: String
    }
  }
}, {
  timestamps: true
});

// Middleware pre-save pour générer le slug
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  this.updatedAt = Date.now();
  next();
});

// Index pour la recherche
blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);