// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  Briefcase, 
  MapPin, 
  Globe, 
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  X,
  Loader2
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    position: '',
    city: '',
    country: 'Cameroon',
    accountType: 'investor'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        company: formData.company,
        position: formData.position,
        city: formData.city,
        country: formData.country,
        accountType: formData.accountType,
        roles: [formData.accountType === 'investor' ? 'INVESTOR' : 
                formData.accountType === 'owner' ? 'OWNER' : 
                formData.accountType === 'buyer' ? 'BUYER' : 'USER']
      };
      
      const response = await register(userData);
      
      if (response.success) {
        setSuccess('Inscription réussie ! Redirection vers le tableau de bord...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Types de compte
  const accountTypes = [
    { value: 'investor', label: 'Investisseur', icon: <Briefcase size={18} />, description: 'Recherche d\'opportunités d\'investissement' },
    { value: 'owner', label: 'Propriétaire', icon: <Building2 size={18} />, description: 'Je souhaite vendre ou louer mes biens' },
    { value: 'buyer', label: 'Acheteur', icon: <Building2 size={18} />, description: 'À la recherche d\'un bien immobilier' },
    { value: 'other', label: 'Autre', icon: <User size={18} />, description: 'Prestataire, expert, ou autre profil' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Info */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 p-8 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-serif mb-4">Rejoignez Property Cameroon</h2>
                  <p className="text-slate-300 text-sm leading-relaxed mb-8">
                    Créez un compte pour accéder aux meilleures opportunités immobilières et 
                    agricoles au Cameroun, gérer vos investissements et suivre vos projets.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-300">Accès aux opportunités exclusives</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-300">Gestion simplifiée de vos investissements</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-300">Support personnalisé 7j/7</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-slate-400">
                    En créant un compte, vous acceptez nos{' '}
                    <Link to="/terms" className="text-emerald-400 hover:underline">
                      Conditions d'utilisation
                    </Link>{' '}
                    et notre{' '}
                    <Link to="/privacy" className="text-emerald-400 hover:underline">
                      Politique de confidentialité
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Form */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-serif text-slate-800">Inscription</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Remplissez le formulaire ci-dessous pour créer votre compte
                </p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type de compte */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Je suis *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {accountTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.accountType === type.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="accountType"
                          value={type.value}
                          checked={formData.accountType === type.value}
                          onChange={handleChange}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">{type.label}</p>
                          <p className="text-[10px] text-slate-400">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Nom complet */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nom complet *
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Jean Dupont"
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="jean@exemple.com"
                    />
                  </div>
                </div>
                
                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                </div>
                
                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {/* Confirmer mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {/* Société (optionnel) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Société / Organisation
                  </label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Votre société"
                    />
                  </div>
                </div>
                
                {/* Poste */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Poste / Fonction
                  </label>
                  <div className="relative">
                    <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Votre poste"
                    />
                  </div>
                </div>
                
                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ville
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Douala, Yaoundé..."
                    />
                  </div>
                </div>
                
                {/* Pays */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Pays
                  </label>
                  <div className="relative">
                    <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Cameroun"
                    />
                  </div>
                </div>
                
                {/* Bouton d'inscription */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <User size={20} />}
                  {loading ? 'Inscription en cours...' : 'Créer mon compte'}
                </button>
                
                <p className="text-center text-sm text-slate-500">
                  Déjà un compte ?{' '}
                  <Link to="/login" className="text-emerald-600 hover:underline font-medium">
                    Se connecter
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;