// backend/controllers/auth.controller.js
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      roles: user.roles
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const register = async (req, res) => {
  try {
    console.log('📝 Registration request received');
    console.log('Body:', { ...req.body, password: '[HIDDEN]' });
    console.log('File:', req.file ? {
      originalname: req.file.originalname,
      size: req.file.size,
      filename: req.file.filename,
      mimetype: req.file.mimetype
    } : 'No file uploaded');
    
    const { name, email, password, phone, roles } = req.body;
    const parsedRoles = typeof roles === 'string' ? JSON.parse(roles) : roles || ['BUYER'];
    
    // Validation des champs requis
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email and password' 
      });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const userData = {
      name,
      email,
      password,
      phone: phone || '',
      roles: parsedRoles,
      status: 'PENDING',
      kycStatus: 'NOT_SUBMITTED'
    };
    
    // Gérer l'upload du document KYC
    if (req.file && req.file.filename) {
      // Construire l'URL complète du document KYC
      let kycDocumentUrl = req.file.filename;
      
      // Si ce n'est pas déjà une URL complète (pour Vercel Blob)
      if (!kycDocumentUrl.startsWith('http')) {
        // En local, construire l'URL relative
        const isDevelopment = process.env.NODE_ENV !== 'production';
        const baseUrl = isDevelopment ? 'http://localhost:5000' : 'https://property-cameroon-backend.vercel.app';
        kycDocumentUrl = `${baseUrl}/uploads/kyc/${req.file.filename}`;
      }
      
      userData.kycDocuments = [{
        type: 'ID_CARD',
        url: kycDocumentUrl,
        uploadedAt: new Date(),
        verifiedAt: null
      }];
      userData.kycStatus = 'PENDING';
      
      console.log('📄 KYC Document URL:', kycDocumentUrl);
    }
    
    const user = await User.create(userData);
    console.log('✅ User created:', user._id);
    
    res.status(201).json({
      success: true,
      message: 'Registration submitted. Awaiting admin approval.',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        roles: user.roles, 
        status: user.status,
        kycStatus: user.kycStatus
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (user.status === 'PENDING') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending admin approval.' 
      });
    }
    
    if (user.status === 'BANNED') {
      return res.status(403).json({ success: false, message: 'Account is banned' });
    }
    
    if (user.status === 'REJECTED') {
      return res.status(403).json({ success: false, message: 'Your registration was rejected.' });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user);
    
    console.log('✅ User logged in:', user._id);
    
    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        roles: user.roles, 
        status: user.status, 
        kycStatus: user.kycStatus,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('❌ GetMe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};