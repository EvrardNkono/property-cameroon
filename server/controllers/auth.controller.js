import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, roles } = req.body;
    const parsedRoles = typeof roles === 'string' ? JSON.parse(roles) : roles || ['BUYER'];
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Créer l'utilisateur
    const userData = {
      name,
      email,
      password,
      phone,
      roles: parsedRoles,
      status: 'Pending',
      kycStatus: 'Not Submitted'
    };
    
    // Gérer l'upload du document KYC si INVESTOR
    if (req.file) {
  userData.kycDocuments = [{
    type: 'ID_CARD',
    url: `/uploads/kyc/${req.file.filename}`,
    verifiedAt: null
  }];
  userData.kycStatus = 'Pending';
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
    
    // Vérifier si le compte est en attente de validation
    if (user.status === 'Pending') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending admin approval. You will receive an email once approved.' 
      });
    }
    
    if (user.status === 'Banned') {
      return res.status(403).json({ success: false, message: 'Account is banned', banReason: user.banReason });
    }
    
    if (user.status === 'Rejected') {
      return res.status(403).json({ success: false, message: 'Your registration was rejected. Please contact support.' });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
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