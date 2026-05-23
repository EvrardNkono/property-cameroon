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
    const { name, email, password, phone, roles } = req.body;
    const parsedRoles = typeof roles === 'string' ? JSON.parse(roles) : roles || ['BUYER'];
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const userData = {
      name,
      email,
      password,
      phone,
      roles: parsedRoles,
      status: 'PENDING',
      kycStatus: 'NOT_SUBMITTED'
    };
    
    // Gérer l'upload du document KYC
    if (req.file) {
      userData.kycDocuments = [{
        type: 'ID_CARD',
        url: req.file.filename, // ← Contient soit l'URL Blob soit le chemin local
        uploadedAt: new Date(),
        verifiedAt: null
      }];
      userData.kycStatus = 'PENDING';
    }
    
    const user = await User.create(userData);
    
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
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
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
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};