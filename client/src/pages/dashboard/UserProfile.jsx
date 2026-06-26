import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Mail, MapPin, Camera, Loader2, Phone, Edit2, Save, X, CheckCircle2, UploadCloud } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [kycDocument, setKycDocument] = useState(null);
  const [uploadingKYC, setUploadingKYC] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editRolesMode, setEditRolesMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  const [selectedRoles, setSelectedRoles] = useState([]);

  const roleOptions = [
    { id: 'BUYER', label: 'Buyer', description: 'Browse and purchase properties' },
    { id: 'OWNER', label: 'Property Owner', description: 'List and manage properties' },
    { id: 'INVESTOR', label: 'Investor', description: 'Access financial portfolios and ROI' },
    { id: 'AGRICULTURE', label: 'Agriculture Owner', description: 'Manage agricultural lands and farming operations' },
    { id: 'LIVESTOCK', label: 'Livestock Owner', description: 'Manage livestock production units' }
  ];

  const isAdmin = user?.roles?.includes('ADMIN');

  // ✅ Helper — résout _id ou id selon le format retourné par le contexte auth
  const getUserId = () => user?._id || user?.id;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || 'Douala, Cameroon'
      });
      setSelectedRoles(user.roles || []);
      setLoading(false);
    }
  }, [user]);

  // ✅ Update profile
  const handleUpdateProfile = async () => {
    const userId = getUserId();
    if (!userId) {
      setError('User ID not available. Please refresh the page.');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const response = await api.updateUser(userId, formData);
      if (updateUser) updateUser(response.user);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Update roles
  const handleUpdateRoles = async () => {
    const userId = getUserId();
    if (!userId) {
      setError('User ID not available. Please refresh the page.');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      let rolesToUpdate = [...selectedRoles];
      // Conserver ADMIN si déjà présent (le backend le protège aussi)
      if (isAdmin && !rolesToUpdate.includes('ADMIN')) {
        rolesToUpdate.push('ADMIN');
      }

      const response = await api.updateUserRoles(userId, rolesToUpdate);
      if (updateUser) updateUser(response.user);
      setSuccess('Roles updated successfully!');
      setEditRolesMode(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating roles:', err);
      setError(err.message || 'Error updating roles');
    } finally {
      setUpdating(false);
    }
  };

  const toggleRole = (roleId) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const userId = getUserId();
    if (!userId) { setError('User ID not available.'); return; }

    const data = new FormData();
    data.append('avatar', file);

    try {
      setUpdating(true);
      const response = await api.uploadAvatar(userId, data);
      if (updateUser) updateUser(response.user);
      setSuccess('Profile photo updated!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error uploading photo');
    } finally {
      setUpdating(false);
    }
  };

  const handleKYCSubmission = async () => {
    if (!kycDocument) { setError('Please select a document'); return; }

    const userId = getUserId();
    if (!userId) { setError('User ID not available.'); return; }

    const data = new FormData();
    data.append('document', kycDocument);
    data.append('type', 'ID_CARD');

    try {
      setUploadingKYC(true);
      const response = await api.uploadKYCDocument(userId, data);
      if (updateUser) updateUser(response.user);
      setSuccess('Documents submitted successfully! Pending verification.');
      setShowKYCModal(false);
      setKycDocument(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error submitting documents');
    } finally {
      setUploadingKYC(false);
    }
  };

  const isRoleActive = (roleId) => selectedRoles.includes(roleId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-medium">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* PROFILE HEADER */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 bg-[#c5a059] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-[#0a2619]">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              formData.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <label className="absolute bottom-1 right-1 p-2 bg-[#0a2619] text-white rounded-full border-2 border-white hover:bg-slate-800 transition-colors cursor-pointer">
            <Camera size={16} />
            <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageUpload} disabled={updating} />
          </label>
        </div>

        <div className="text-center md:text-left flex-1">
          {editMode ? (
            <div className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-3xl font-black text-[#0a2619] bg-slate-50 rounded-xl px-4 py-2 w-full"
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone number"
                className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-2 w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="px-4 py-2 bg-[#c5a059] text-[#0a2619] rounded-xl text-xs font-black uppercase flex items-center gap-2"
                >
                  {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={14} />} Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase flex items-center gap-2"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h2 className="text-3xl font-black text-[#0a2619] tracking-tighter uppercase">
                  {formData.name}
                </h2>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1"><Mail size={14} /> {formData.email}</span>
                <span className="flex items-center gap-1"><Phone size={14} /> {formData.phone || 'Not provided'}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {formData.location}</span>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 text-[10px] font-black text-[#c5a059] uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                <Edit2 size={12} /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* ROLE MANAGEMENT */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-[#0a2619] uppercase tracking-widest text-sm">My Roles</h3>
          {!editRolesMode && (
            <button
              onClick={() => setEditRolesMode(true)}
              className="text-[10px] font-black text-[#c5a059] hover:underline flex items-center gap-1"
            >
              <Edit2 size={12} /> Edit Roles
            </button>
          )}
        </div>

        {editRolesMode ? (
          <div className="space-y-4">
            {roleOptions.map((role) => {
              const isActive = isRoleActive(role.id);
              return (
                <div
                  key={role.id}
                  onClick={() => toggleRole(role.id)}
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isActive
                      ? 'border-[#c5a059] bg-[#c5a059]/5'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    isActive ? 'bg-[#c5a059] border-[#c5a059]' : 'border-slate-300'
                  }`}>
                    {isActive && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#0a2619] text-sm">{role.label}</span>
                      {isActive && (
                        <span className="text-[8px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">Active</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">{role.description}</p>
                  </div>
                </div>
              );
            })}

            {/* Rôle ADMIN non modifiable */}
            {isAdmin && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-70">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center mt-0.5">
                  <ShieldCheck size={12} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#0a2619] text-sm">Administrator</span>
                    <span className="text-[8px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase">System Role</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Full system access (cannot be changed by user)</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpdateRoles}
                disabled={updating}
                className="flex-1 py-3 bg-[#0a2619] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {updating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Roles
              </button>
              <button
                onClick={() => {
                  setEditRolesMode(false);
                  setSelectedRoles(user?.roles || []);
                }}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {roleOptions.map((role) => {
              const isActive = isRoleActive(role.id);
              return (
                <div
                  key={role.id}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    isActive ? 'bg-[#c5a059] text-[#0a2619]' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {role.label}
                </div>
              );
            })}
            {isAdmin && (
              <div className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700">
                Administrator
              </div>
            )}
          </div>
        )}
      </div>

      {/* KYC SECTION */}
      <div className="bg-[#0a2619] p-8 rounded-[2.5rem] text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-[#c5a059] mb-4 italic">
            {user?.kycStatus === 'Verified' ? '✅ KYC Verified' : 'Become an Investor'}
          </h3>
          {user?.kycStatus === 'Verified' ? (
            <div className="space-y-4">
              <p className="text-xs text-white/70 leading-relaxed">
                Congratulations! Your identity has been verified. You now have access to all CAPEF investment projects.
              </p>
              <button className="w-full py-3 bg-[#c5a059] text-[#0a2619] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-transform">
                View Opportunities
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-white/70 leading-relaxed mb-6">
                To unlock the Investor role and access co-ownership projects, you must provide a valid ID document.
              </p>
              {user?.kycStatus === 'Pending' && (
                <p className="text-xs text-[#c5a059]/80 mb-4 italic">
                  ⏳ Your documents are under review. You will be notified once verified.
                </p>
              )}
              <button
                onClick={() => setShowKYCModal(true)}
                disabled={user?.kycStatus === 'Pending'}
                className="w-full py-3 bg-[#c5a059] text-[#0a2619] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {user?.kycStatus === 'Pending' ? 'Documents Under Review' : 'Submit My Documents'}
              </button>
            </>
          )}
        </div>
        <User className="absolute -right-8 -bottom-8 text-white/5 w-40 h-40" />
      </div>

      {/* KYC MODAL */}
      {showKYCModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-[#0a2619]">Identity Verification</h3>
            <p className="text-sm text-slate-500">
              Please upload a valid ID document (National ID Card, Passport, or Driver's License)
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
              <input
                type="file"
                id="kyc-doc"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setKycDocument(e.target.files[0])}
              />
              <label htmlFor="kyc-doc" className="cursor-pointer">
                <UploadCloud size={48} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">
                  {kycDocument ? kycDocument.name : 'Click to select a file'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG (Max. 5MB)</p>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleKYCSubmission}
                disabled={!kycDocument || uploadingKYC}
                className="flex-1 py-3 bg-[#0a2619] text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 flex items-center justify-center"
              >
                {uploadingKYC ? <Loader2 size={16} className="animate-spin" /> : 'Submit'}
              </button>
              <button
                onClick={() => { setShowKYCModal(false); setKycDocument(null); }}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;