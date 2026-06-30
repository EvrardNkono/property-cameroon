// backend/controllers/blog.controller.js

import BlogPost from '../models/BlogPost.js';
import translate from 'google-translate-api-x';

// ============================================
// 1. CACHE MÉMOIRE
// ============================================
const memCache = new Map();

// ============================================
// 2. FONCTION DE TRADUCTION AVEC CACHE
// ============================================
async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return text;
  if (targetLang === 'en') return text;

  const key = `${text}_${targetLang}`;
  if (memCache.has(key)) return memCache.get(key);

  try {
    const result = await translate(text, { to: targetLang });
    memCache.set(key, result.text);
    return result.text;
  } catch (err) {
    console.error(`[translate] Error:`, err.message);
    return text;
  }
}

// ============================================
// 3. APPLIQUER LA TRADUCTION AVEC CACHE BASE DE DONNÉES
// ============================================
async function applyTranslation(post, targetLang) {
  // Si pas de langue ou anglais → retourner l'original
  if (!targetLang || targetLang === 'en') {
    return post;
  }

  const doc = post.toObject ? post.toObject() : { ...post };
  
  // Vérifier si la traduction existe déjà en base
  const translations = doc.translations || {};
  const cached = translations[targetLang];

  // ✅ Cache présent et valide
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

  // ❌ Pas de cache → traduire
  try {
    console.log(`[blog] Translating post "${doc.title}" to ${targetLang}...`);

    const [title, excerpt, content, seoTitle, seoDescription] = await Promise.all([
      translateText(doc.title, targetLang),
      translateText(doc.excerpt || '', targetLang),
      translateText(doc.content || '', targetLang),
      translateText(doc.seoTitle || doc.title, targetLang),
      translateText(doc.seoDescription || doc.excerpt || '', targetLang),
    ]);

    // Construction de l'entrée de cache
    const cacheEntry = {
      title,
      excerpt: excerpt || doc.excerpt,
      content: content || doc.content,
      seoTitle: seoTitle || doc.seoTitle,
      seoDescription: seoDescription || doc.seoDescription,
    };

    // 🔥 Sauvegarde en base pour les prochaines requêtes
    // Utiliser $set pour ne pas écraser les autres langues
    await BlogPost.findByIdAndUpdate(
      doc._id,
      { $set: { [`translations.${targetLang}`]: cacheEntry } },
      { new: false }
    ).catch(err =>
      console.error(`[blog] Cache write failed for ${doc._id}:`, err.message)
    );

    console.log(`[blog] ✅ Successfully translated post "${doc.title}" to ${targetLang}`);

    return {
      ...doc,
      title,
      excerpt,
      content,
      seoTitle,
      seoDescription,
    };

  } catch (err) {
    console.error(`[blog] Translation failed for "${doc.title}":`, err.message);
    return doc; // Fallback sur l'original
  }
}

// ============================================
// 4. MAKE SLUG
// ============================================
const makeSlug = (title) =>
  title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

// ============================================
// 5. GET ALL POSTS (ADMIN)
// ============================================
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
    console.error('[getAllPostsAdmin]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// 6. GET SINGLE POST (ADMIN)
// ============================================
export const getAdminPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    res.json({ success: true, data: { ...post.toObject(), id: post._id } });
  } catch (err) {
    console.error('[getAdminPost]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// 7. GET PUBLIC POSTS (AVEC TRADUCTION AUTO)
// ============================================
export const getPosts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag, 
      search, 
      lang = 'fr' 
    } = req.query;

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
    const formatted = await Promise.all(posts.map(async (post) => {
      const translated = await applyTranslation(post, lang);
      return {
        id: translated._id,
        title: translated.title,
        excerpt: translated.excerpt,
        content: translated.content,
        category: translated.category,
        image: translated.featuredImage,
        date: translated.publishedAt || translated.createdAt,
        author: translated.authorName,
        slug: translated.slug,
        isFeatured: translated.isFeatured,
        tags: translated.tags,
        views: translated.views,
      };
    }));

    res.json({
      success: true,
      data: formatted,
      pagination: { 
        total, 
        page: Number(page), 
        pages: Math.ceil(total / Number(limit)) 
      }
    });
  } catch (err) {
    console.error('[getPosts]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// 8. GET FEATURED POSTS
// ============================================
export const getFeaturedPosts = async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    
    const posts = await BlogPost.find({ 
      status: 'published', 
      isFeatured: true 
    })
      .sort({ publishedAt: -1 })
      .limit(3);

    const formatted = await Promise.all(posts.map(async (post) => {
      const translated = await applyTranslation(post, lang);
      return {
        id: translated._id,
        title: translated.title,
        excerpt: translated.excerpt,
        category: translated.category,
        image: translated.featuredImage,
        date: translated.publishedAt || translated.createdAt,
        author: translated.authorName,
        slug: translated.slug,
      };
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('[getFeaturedPosts]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// 9. GET SINGLE POST (PUBLIC)
// ============================================
export const getPost = async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    
    const post = await BlogPost.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'name email avatar bio');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    // ✅ Incrémenter les vues (async, ne pas bloquer)
    BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } })
      .catch(err => console.error('[blog] View increment failed:', err.message));

    // ✅ Appliquer la traduction
    const translated = await applyTranslation(post, lang);

    res.json({
      success: true,
      data: {
        id: translated._id,
        title: translated.title,
        excerpt: translated.excerpt,
        content: translated.content,
        category: translated.category,
        image: translated.featuredImage,
        date: translated.publishedAt || translated.createdAt,
        updatedAt: translated.updatedAt,
        author: { 
          name: translated.authorName, 
          bio: translated.author?.bio 
        },
        tags: translated.tags,
        views: translated.views + 1, // +1 pour la vue actuelle
        seoTitle: translated.seoTitle,
        seoDescription: translated.seoDescription,
      }
    });
  } catch (err) {
    console.error('[getPost]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// 10. CREATE POST
// ============================================
export const createPost = async (req, res) => {
  try {
    const {
      title, excerpt, content, category,
      tags, metaKeywords, isFeatured, status,
      seoTitle, seoDescription, translations
    } = req.body;

    // URL Cloudinary injectée par uploadBlogImage.single()
    const featuredImage = req.file ? req.file.path : null;

    // Slug unique
    let slug = makeSlug(title);
    const existing = await BlogPost.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      category,
      featuredImage,
      tags: tags ? JSON.parse(tags) : [],
      metaKeywords: metaKeywords ? JSON.parse(metaKeywords) : [],
      isFeatured: isFeatured === 'true',
      status: status || 'draft',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      translations: translations ? JSON.parse(translations) : {},
      author: req.user.id,
      authorName: req.user.name,
    });

    // ✅ Si l'article est publié, définir publishedAt
    if (post.status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date();
      await post.save();
    }

    res.status(201).json({ 
      success: true, 
      data: { ...post.toObject(), id: post._id } 
    });
  } catch (err) {
    console.error('[createPost]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// 11. UPDATE POST
// ============================================
export const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    const {
      title, excerpt, content, category,
      tags, metaKeywords, isFeatured, status,
      seoTitle, seoDescription, translations
    } = req.body;

    // Mise à jour des champs
    if (title) {
      post.title = title;
      post.slug = makeSlug(title);
      // Vérifier l'unicité du slug
      const existing = await BlogPost.findOne({ 
        slug: post.slug, 
        _id: { $ne: post._id } 
      });
      if (existing) {
        post.slug = `${post.slug}-${Date.now()}`;
      }
    }
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = JSON.parse(tags);
    if (metaKeywords) post.metaKeywords = JSON.parse(metaKeywords);
    if (isFeatured !== undefined) post.isFeatured = isFeatured === 'true';
    if (status) {
      post.status = status;
      // Si publication, définir publishedAt
      if (status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }
    if (seoTitle) post.seoTitle = seoTitle;
    if (seoDescription) post.seoDescription = seoDescription;
    if (translations) {
      post.translations = JSON.parse(translations);
    }

    // Nouvelle image uploadée
    if (req.file) {
      post.featuredImage = req.file.path;
    }

    await post.save();
    
    res.json({ 
      success: true, 
      data: { ...post.toObject(), id: post._id } 
    });
  } catch (err) {
    console.error('[updatePost]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// 12. DELETE POST
// ============================================
export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    
    await post.deleteOne();
    res.json({ success: true, message: 'Article supprimé' });
  } catch (err) {
    console.error('[deletePost]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};