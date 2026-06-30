// backend/controllers/blog.controller.js

import BlogPost from '../models/BlogPost.js';
import translate from 'google-translate-api-x';

// ===== CACHE MÉMOIRE =====
const memCache = new Map();

async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return text;
  if (targetLang === 'en') return text;

  const key = `${text}_${targetLang}`;
  if (memCache.has(key)) return memCache.get(key);

  try {
    const result = await translate(text, { to: targetLang });
    memCache.set(key, result.text);
    return result.text;
  } catch {
    return text;
  }
}

// ===== APPLIQUER LA TRADUCTION AVEC CACHE =====
async function applyTranslation(post, targetLang) {
  if (!targetLang || targetLang === 'en') return post;

  const doc = post.toObject ? post.toObject() : { ...post };
  const translations = doc.translations || {};
  const cached = translations[targetLang];

  // Cache présent
  if (cached && cached.title) {
    return {
      ...doc,
      title: cached.title,
      excerpt: cached.excerpt || doc.excerpt,
      content: cached.content || doc.content,
      seoTitle: cached.seoTitle || doc.seoTitle,
      seoDescription: cached.seoDescription || doc.seoDescription,
    };
  }

  // Pas de cache → traduire
  try {
    console.log(`[blog] Translating post ${doc._id} to ${targetLang}...`);

    const [title, excerpt, content, seoTitle, seoDescription] = await Promise.all([
      translateText(doc.title, targetLang),
      translateText(doc.excerpt || '', targetLang),
      translateText(doc.content || '', targetLang),
      translateText(doc.seoTitle || doc.title, targetLang),
      translateText(doc.seoDescription || doc.excerpt || '', targetLang),
    ]);

    const cacheEntry = { title, excerpt, content, seoTitle, seoDescription };

    // Sauvegarder en base
    await BlogPost.findByIdAndUpdate(
      doc._id,
      { $set: { [`translations.${targetLang}`]: cacheEntry } }
    ).catch(err =>
      console.error(`[blog] Cache write failed:`, err.message)
    );

    console.log(`[blog] ✅ Successfully translated post ${doc._id} to ${targetLang}`);

    return {
      ...doc,
      title,
      excerpt,
      content,
      seoTitle,
      seoDescription,
    };

  } catch (err) {
    console.error(`[blog] Translation failed:`, err.message);
    return doc;
  }
}

// ===== GET PUBLIC POSTS (avec traduction auto) =====
export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search, lang = 'fr' } = req.query;

    const query = { status: 'published' };
    if (category && category !== 'all') query.category = category;
    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const posts = await BlogPost.find(query)
      .sort({ isFeatured: -1, publishedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('author', 'name email avatar');

    const total = await BlogPost.countDocuments(query);

    // ✅ Appliquer la traduction automatique
    const formatted = await Promise.all(posts.map(async post => {
      const translated = await applyTranslation(post, lang);
      return {
        id:         translated._id,
        title:      translated.title,
        excerpt:    translated.excerpt,
        content:    translated.content,
        category:   translated.category,
        image:      translated.featuredImage,
        date:       translated.publishedAt || translated.createdAt,
        author:     translated.authorName,
        slug:       translated.slug,
        isFeatured: translated.isFeatured,
        tags:       translated.tags,
        views:      translated.views,
      };
    }));

    res.json({
      success: true,
      data: formatted,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== GET FEATURED POSTS =====
export const getFeaturedPosts = async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    const posts = await BlogPost.find({ status: 'published', isFeatured: true })
      .sort({ publishedAt: -1 }).limit(3);

    const formatted = await Promise.all(posts.map(async post => {
      const translated = await applyTranslation(post, lang);
      return {
        id: translated._id,
        title: translated.title,
        excerpt: translated.excerpt,
        category: translated.category,
        image: translated.featuredImage,
        date: translated.publishedAt || translated.createdAt,
        author: translated.authorName,
        slug: translated.slug
      };
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== GET SINGLE POST =====
export const getPost = async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name email avatar bio');

    if (!post) return res.status(404).json({ success: false, message: 'Article non trouvé' });

    // Incrémenter les vues
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    // ✅ Appliquer la traduction
    const translated = await applyTranslation(post, lang);

    res.json({
      success: true,
      data: {
        id:         translated._id,
        title:      translated.title,
        excerpt:    translated.excerpt,
        content:    translated.content,
        category:   translated.category,
        image:      translated.featuredImage,
        date:       translated.publishedAt || translated.createdAt,
        updatedAt:  translated.updatedAt,
        author:     { name: translated.authorName, bio: translated.author?.bio },
        tags:       translated.tags,
        views:      translated.views,
        seoTitle:       translated.seoTitle,
        seoDescription: translated.seoDescription,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== GET ALL POSTS (ADMIN) - pas de traduction =====
export const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name');

    res.json({
      success: true,
      data: posts.map(p => ({ ...p.toObject(), id: p._id }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== GET SINGLE POST (ADMIN) - pas de traduction =====
export const getAdminPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ success: false, message: 'Article non trouvé' });
    res.json({ success: true, data: { ...post.toObject(), id: post._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== CREATE POST =====
export const createPost = async (req, res) => {
  try {
    const {
      title, excerpt, content, category,
      tags, metaKeywords, isFeatured, status,
      seoTitle, seoDescription, translations
    } = req.body;

    const featuredImage = req.file ? req.file.path : null;

    let slug = makeSlug(title);
    const existing = await BlogPost.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const post = await BlogPost.create({
      title, slug, excerpt, content, category,
      featuredImage,
      tags:           tags           ? JSON.parse(tags)           : [],
      metaKeywords:   metaKeywords   ? JSON.parse(metaKeywords)   : [],
      isFeatured:     isFeatured === 'true',
      status:         status || 'draft',
      seoTitle:       seoTitle       || title,
      seoDescription: seoDescription || excerpt,
      translations:   translations   ? JSON.parse(translations)   : {},
      author:     req.user.id,
      authorName: req.user.name,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    console.error('createPost error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== UPDATE POST =====
export const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Article non trouvé' });

    const {
      title, excerpt, content, category,
      tags, metaKeywords, isFeatured, status,
      seoTitle, seoDescription, translations
    } = req.body;

    if (title) { post.title = title; post.slug = makeSlug(title); }
    if (excerpt)        post.excerpt        = excerpt;
    if (content)        post.content        = content;
    if (category)       post.category       = category;
    if (tags)           post.tags           = JSON.parse(tags);
    if (metaKeywords)   post.metaKeywords   = JSON.parse(metaKeywords);
    if (isFeatured !== undefined) post.isFeatured = isFeatured === 'true';
    if (status)         post.status         = status;
    if (seoTitle)       post.seoTitle       = seoTitle;
    if (seoDescription) post.seoDescription = seoDescription;
    
    // ✅ Mise à jour des traductions
    if (translations) {
      const parsedTranslations = JSON.parse(translations);
      post.translations = parsedTranslations;
    }

    if (req.file) post.featuredImage = req.file.path;

    await post.save();
    res.json({ success: true, data: { ...post.toObject(), id: post._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== DELETE POST =====
export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Article non trouvé' });
    await post.deleteOne();
    res.json({ success: true, message: 'Article supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};