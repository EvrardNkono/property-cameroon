import express from 'express';
import BlogPost from '../models/BlogPost.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = './uploads/blog/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

// ========== ROUTES PUBLIQUES ==========

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search, lang = 'fr' } = req.query;
    
    let query = { status: 'published' };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    const posts = await BlogPost.find(query)
      .sort({ isFeatured: -1, publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name email avatar');
    
    const total = await BlogPost.countDocuments(query);
    
    const formattedPosts = posts.map(post => {
      const translation = post.translations?.[lang];
      return {
        id: post._id,
        title: translation?.title || post.title,
        excerpt: translation?.excerpt || post.excerpt,
        content: translation?.content || post.content,
        category: post.category,
        image: post.featuredImage,
        date: post.publishedAt,
        author: post.authorName,
        slug: post.slug,
        isFeatured: post.isFeatured,
        tags: post.tags,
        views: post.views
      };
    });
    
    res.json({
      success: true,
      data: formattedPosts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    
    const posts = await BlogPost.find({ status: 'published', isFeatured: true })
      .sort({ publishedAt: -1 })
      .limit(3)
      .populate('author', 'name email');
    
    const formattedPosts = posts.map(post => {
      const translation = post.translations?.[lang];
      return {
        id: post._id,
        title: translation?.title || post.title,
        excerpt: translation?.excerpt || post.excerpt,
        category: post.category,
        image: post.featuredImage,
        date: post.publishedAt,
        author: post.authorName,
        slug: post.slug
      };
    });
    
    res.json({ success: true, data: formattedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name email avatar bio');
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    
    post.views += 1;
    await post.save();
    
    const translation = post.translations?.[lang];
    
    res.json({
      success: true,
      data: {
        id: post._id,
        title: translation?.title || post.title,
        excerpt: translation?.excerpt || post.excerpt,
        content: translation?.content || post.content,
        category: post.category,
        image: post.featuredImage,
        galleryImages: post.galleryImages,
        date: post.publishedAt,
        updatedAt: post.updatedAt,
        author: {
          name: post.authorName,
          bio: post.author?.bio
        },
        tags: post.tags,
        views: post.views,
        seoTitle: translation?.seoTitle || post.seoTitle,
        seoDescription: translation?.seoDescription || post.seoDescription
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ========== ROUTES ADMIN (protégées) ==========

router.get('/admin/all', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name');
    
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.get('/admin/post/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.post('/', protect, authorize('admin', 'editor'), upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, isFeatured, status, translations } = req.body;
    
    let featuredImage = null;
    if (req.file) {
      featuredImage = `/uploads/blog/${req.file.filename}`;
    }
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    
    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tags ? JSON.parse(tags) : [],
      isFeatured: isFeatured === 'true',
      featuredImage,
      author: req.user.id,
      authorName: req.user.name,
      status: status || 'draft',
      translations: translations ? JSON.parse(translations) : {}
    });
    
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'editor'), upload.single('featuredImage'), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    
    const { title, excerpt, content, category, tags, isFeatured, status, translations } = req.body;
    
    if (title) {
      post.title = title;
      post.slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
    }
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = JSON.parse(tags);
    if (isFeatured !== undefined) post.isFeatured = isFeatured === 'true';
    if (status) post.status = status;
    if (translations) post.translations = JSON.parse(translations);
    
    if (req.file) {
      if (post.featuredImage && fs.existsSync(`.${post.featuredImage}`)) {
        fs.unlinkSync(`.${post.featuredImage}`);
      }
      post.featuredImage = `/uploads/blog/${req.file.filename}`;
    }
    
    await post.save();
    
    res.json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    
    if (post.featuredImage && fs.existsSync(`.${post.featuredImage}`)) {
      fs.unlinkSync(`.${post.featuredImage}`);
    }
    
    await post.deleteOne();
    
    res.json({ success: true, message: 'Article supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;