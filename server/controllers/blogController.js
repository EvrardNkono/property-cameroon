import BlogPost from '../models/BlogPost.js';

const makeSlug = (title) =>
  title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

// ========== GET ALL POSTS (ADMIN) ==========
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

// ========== GET SINGLE POST (ADMIN) ==========
export const getAdminPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ success: false, message: 'Article non trouvé' });
    res.json({ success: true, data: { ...post.toObject(), id: post._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========== GET PUBLIC POSTS ==========
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

    const formatted = posts.map(post => {
      const tr = post.translations?.[lang];
      return {
        id:         post._id,
        title:      tr?.title      || post.title,
        excerpt:    tr?.excerpt    || post.excerpt,
        content:    tr?.content    || post.content,
        category:   post.category,
        image:      post.featuredImage,
        date:       post.publishedAt || post.createdAt,
        author:     post.authorName,
        slug:       post.slug,
        isFeatured: post.isFeatured,
        tags:       post.tags,
        views:      post.views,
      };
    });

    res.json({
      success: true,
      data: formatted,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========== GET FEATURED POSTS ==========
export const getFeaturedPosts = async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    const posts = await BlogPost.find({ status: 'published', isFeatured: true })
      .sort({ publishedAt: -1 }).limit(3);

    const formatted = posts.map(post => {
      const tr = post.translations?.[lang];
      return {
        id: post._id, 
        title: tr?.title || post.title,
        excerpt: tr?.excerpt || post.excerpt,
        category: post.category, 
        image: post.featuredImage,
        date: post.publishedAt || post.createdAt,
        author: post.authorName, 
        slug: post.slug
      };
    }); 
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========== GET SINGLE POST (PUBLIC) ==========
export const getPost = async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name email avatar bio');

    if (!post) return res.status(404).json({ success: false, message: 'Article non trouvé' });

    // ✅ Par :
await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    const tr = post.translations?.[lang];
    res.json({
      success: true,
      data: {
        id:         post._id,
        title:      tr?.title      || post.title,
        excerpt:    tr?.excerpt    || post.excerpt,
        content:    tr?.content    || post.content,
        category:   post.category,
        image:      post.featuredImage,
        date:       post.publishedAt || post.createdAt,
        updatedAt:  post.updatedAt,
        author:     { name: post.authorName, bio: post.author?.bio },
        tags:       post.tags,
        views:      post.views,
        seoTitle:       tr?.seoTitle       || post.seoTitle,
        seoDescription: tr?.seoDescription || post.seoDescription,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========== CREATE POST ==========
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

// ========== UPDATE POST ==========
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
    if (translations)   post.translations   = JSON.parse(translations);

    // Nouvelle image uploadée → nouvelle URL Cloudinary
    if (req.file) post.featuredImage = req.file.path;

    await post.save();
    res.json({ success: true, data: { ...post.toObject(), id: post._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========== DELETE POST ==========
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