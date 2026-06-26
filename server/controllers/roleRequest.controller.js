import RoleRequest from '../models/RoleRequest.model.js';
import User from '../models/User.model.js';

// ========== UTILISATEUR ==========

// Soumettre une demande de changement de rôles
export const submitRoleRequest = async (req, res) => {
  try {
    const { requestedRoles, reason } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(requestedRoles) || requestedRoles.length === 0) {
      return res.status(400).json({ success: false, message: 'requestedRoles must be a non-empty array' });
    }

    // Bloquer si une demande PENDING existe déjà
    const existing = await RoleRequest.findOne({ user: userId, status: 'PENDING' });
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: 'You already have a pending role request. Please wait for admin review.' 
      });
    }

    const user = await User.findById(userId).select('roles');

    const roleRequest = await RoleRequest.create({
      user: userId,
      requestedRoles: requestedRoles.filter(r => r !== 'ADMIN'), // sécurité
      currentRoles: user.roles,
      reason: reason || ''
    });

    res.status(201).json({ success: true, roleRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Voir ses propres demandes
export const getMyRoleRequests = async (req, res) => {
  try {
    const requests = await RoleRequest.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(10);
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== ADMIN ==========

// Voir toutes les demandes en attente
export const getAllRoleRequests = async (req, res) => {
  try {
    const { status = 'PENDING' } = req.query;
    const requests = await RoleRequest.find({ status })
      .populate('user', 'name email roles profilePicture')
      .populate('reviewedBy', 'name email')
      .sort('-createdAt');
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approuver une demande
export const approveRoleRequest = async (req, res) => {
  try {
    const roleRequest = await RoleRequest.findById(req.params.id).populate('user');
    if (!roleRequest) return res.status(404).json({ success: false, message: 'Request not found' });
    if (roleRequest.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Request already reviewed' });
    }

    // Appliquer les rôles — conserver ADMIN si présent
    let newRoles = [...roleRequest.requestedRoles];
    if (roleRequest.user.roles?.includes('ADMIN') && !newRoles.includes('ADMIN')) {
      newRoles.push('ADMIN');
    }

    await User.findByIdAndUpdate(roleRequest.user._id, { roles: newRoles });

    roleRequest.status = 'APPROVED';
    roleRequest.reviewedBy = req.user._id;
    roleRequest.reviewedAt = new Date();
    await roleRequest.save();

    res.json({ success: true, message: 'Role request approved', roleRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Rejeter une demande
export const rejectRoleRequest = async (req, res) => {
  try {
    const { adminNote } = req.body;
    const roleRequest = await RoleRequest.findById(req.params.id);
    if (!roleRequest) return res.status(404).json({ success: false, message: 'Request not found' });
    if (roleRequest.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Request already reviewed' });
    }

    roleRequest.status = 'REJECTED';
    roleRequest.adminNote = adminNote || '';
    roleRequest.reviewedBy = req.user._id;
    roleRequest.reviewedAt = new Date();
    await roleRequest.save();

    res.json({ success: true, message: 'Role request rejected', roleRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};