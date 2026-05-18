import User from '../models/User.model.js';

export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let filter = {};
    if (role && role !== 'ALL') filter.roles = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(filter).select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, roles } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, roles },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRoles = async (req, res) => {
  try {
    const { roles } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const banUser = async (req, res) => {
  try {
    const { banReason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'Banned', banReason, bannedAt: new Date() },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyKYC = async (req, res) => {
  try {
    console.log('📝 verifyKYC called for user:', req.params.id);
    console.log('📝 Request body:', req.body);
    
    const { kycStatus } = req.body;
    
    // Validation des valeurs acceptées
    const validStatuses = ['Verified', 'Rejected', 'Pending', 'Not Submitted'];
    if (!validStatuses.includes(kycStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid KYC status' });
    }
    
    // 🔧 CORRECTION : Si KYC est approuvé, on approuve aussi le compte
    const updateData = { kycStatus: kycStatus };
    if (kycStatus === 'Verified') {
      updateData.status = 'Verified';
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    console.log(`✅ User updated: status=${user.status}, kycStatus=${user.kycStatus}`);
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('❌ Error in verifyKYC:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== REGISTER (INSCRIPTION) ==========
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, roles } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Créer l'utilisateur avec statut "Pending"
    const user = await User.create({
      name,
      email,
      password,
      phone,
      roles: roles || ['BUYER'],
      status: 'Pending',  // En attente de validation admin
      kycStatus: 'Not Submitted'
    });
    
    // TODO: Envoyer une notification à l'admin (email)
    // await sendAdminNotification(user);
    
    res.status(201).json({
      success: true,
      message: 'Registration submitted. Awaiting admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== APPROUVER UN UTILISATEUR (ADMIN) ==========
export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'Verified' },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // TODO: Envoyer un email de confirmation à l'utilisateur
    // await sendApprovalEmail(user.email);
    
    res.json({ 
      success: true, 
      message: 'User approved successfully',
      user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== REJETER UN UTILISATEUR (ADMIN) ==========
export const rejectUser = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected', rejectionReason },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'User rejected',
      user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== OBTENIR LES UTILISATEURS EN ATTENTE ==========
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'Pending' })
      .select('-password')
      .sort('-createdAt');
    
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== NOUVELLES FONCTIONS ==========

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profilePicture: avatarUrl },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, user, avatarUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadKYCDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document provided' });
    }
    
    const { type } = req.body;
    const documentUrl = `/uploads/kyc/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          kycDocuments: {
            type: type || 'ID_CARD',
            url: documentUrl,
            verifiedAt: null
          }
        },
        kycStatus: 'Pending'
      },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};