// backend/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    console.log(`✅ User authenticated: ${req.user.email}, Roles: ${req.user.roles.join(', ')}`);
    
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// ✅ Version CORRIGÉE - Insensible à la casse
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    // 🔥 CORRECTION : Convertir les deux côtés en minuscules pour comparaison
    const userRoles = req.user.roles.map(role => role.toLowerCase());
    const requiredRoles = roles.map(role => role.toLowerCase());
    
    const hasRole = userRoles.some(role => requiredRoles.includes(role));
    
    console.log(`🔒 Authorization check: User: ${userRoles}, Required: ${requiredRoles}, HasRole: ${hasRole}`);
    
    if (!hasRole) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required roles: ${roles.join(', ')}. Your roles: ${req.user.roles.join(', ')}`
      });
    }
    
    next();
  };
};