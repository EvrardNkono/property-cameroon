// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Loader2, CheckCircle2, Building2, TrendingUp, Home, 
  Sprout, Beef, ArrowRight, ShieldCheck, Mail, Lock, User, Phone,
  Upload, FileText, X
} from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [kycDocument, setKycDocument] = useState(null);
  const [kycPreview, setKycPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    roles: []
  });

  const roleOptions = [
    { id: 'INVESTOR', label: 'Investor', icon: <TrendingUp size={18} />, description: 'Access financial portfolios, ROI tracking, and investment opportunities.' },
    { id: 'OWNER', label: 'Property Owner', icon: <Home size={18} />, description: 'List properties, manage land titles, and handle real estate assets.' },
    { id: 'BUYER', label: 'Buyer', icon: <Building2 size={18} />, description: 'Browse and purchase properties across Cameroon.' },
    { id: 'AGRICULTURE', label: 'Agriculture Owner', icon: <Sprout size={18} />, description: 'Manage agricultural lands and farming operations.' },
    { id: 'LIVESTOCK', label: 'Livestock Owner', icon: <Beef size={18} />, description: 'Manage livestock production units.' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(r => r !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKycDocument(file);
      setKycPreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setKycDocument(null);
    setKycPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (formData.roles.length === 0) {
      setError('Please select at least one role');
      return;
    }
    
    if (!kycDocument) {
      setError('Please upload an identity document to register');
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('roles', JSON.stringify(formData.roles));
      formDataToSend.append('kycDocument', kycDocument);
      
      await api.register(formDataToSend);
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <Navbar />
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-20 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-serif text-emerald-900 mb-3">Registration Submitted!</h2>
            <p className="text-emerald-600 text-sm mb-6">
              Your account request has been sent to the administration for review.
              You will receive a confirmation email once your account is approved.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-900 transition-all"
            >
              Go to Login <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-emerald-900 px-8 py-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-400 rounded-2xl mb-3">
                <Building2 size={28} className="text-emerald-900" />
              </div>
              <h1 className="text-2xl font-serif text-white">Create an Account</h1>
              <p className="text-emerald-300 text-sm">Join Property Cameroon's investment ecosystem</p>
            </div>

            <div className="p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-emerald-600 mb-1">Full Name *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-emerald-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase text-emerald-600 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-emerald-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-emerald-600 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-emerald-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-emerald-600 mb-1">Password *</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-emerald-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase text-emerald-600 mb-1">Confirm Password *</label>
                    <div className="relative">
                      <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-emerald-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Roles Selection */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-emerald-600 mb-3">
                    Select your profile type(s) * (You can select multiple)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roleOptions.map((role) => (
                      <div
                        key={role.id}
                        onClick={() => handleRoleToggle(role.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.roles.includes(role.id)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-emerald-100 hover:border-emerald-200'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          formData.roles.includes(role.id)
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.roles.includes(role.id) && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-emerald-600">{role.icon}</span>
                            <span className="font-bold text-emerald-900 text-sm">{role.label}</span>
                          </div>
                          <p className="text-[10px] text-emerald-600/70">{role.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KYC Document Upload */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase text-emerald-600 mb-1">
                    Identity Document (ID Card or Passport) *
                  </label>
                  {!kycDocument ? (
                    <div className="border-2 border-dashed border-emerald-200 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                      <input
                        type="file"
                        id="kyc-document"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="kyc-document" className="cursor-pointer">
                        <Upload size={32} className="mx-auto text-emerald-400 mb-2" />
                        <p className="text-xs text-emerald-600">Click to upload your ID document</p>
                        <p className="text-[9px] text-emerald-400 mt-1">PDF, JPG, PNG (Max. 10MB)</p>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText size={24} className="text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium text-emerald-900">{kycDocument.name}</p>
                          <p className="text-[9px] text-emerald-500">{(kycDocument.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
                      >
                        <X size={18} className="text-emerald-600" />
                      </button>
                    </div>
                  )}
                  <p className="text-[9px] text-amber-600 flex items-center gap-1">
                    <ShieldCheck size={12} /> Required for account verification
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-emerald-800 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Register & Submit for Approval
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>{/* ✅ form se ferme ici, après le bouton submit */}

              {/* ✅ Ce div est en dehors du form */}
              <div className="mt-6 pt-4 border-t border-emerald-100 text-center">
                <p className="text-[10px] text-emerald-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-900 underline">
                    Sign In
                  </Link>
                </p>
              </div>

            </div>{/* fin p-8 */}
          </div>{/* fin rounded-3xl */}
        </div>{/* fin max-w-4xl */}
      </div>{/* fin py-12 */}

      <Footer />
    </div>
  );
};

export default Register;