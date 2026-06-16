// frontend/src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
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

// ─────────────────────────────────────────────────────────────
// Détection de langue — SYNCHRONE
// ─────────────────────────────────────────────────────────────
const detectLang = () => {
  if (typeof window === 'undefined') return 'en';
  const params     = new URLSearchParams(window.location.search);
  const urlLang    = params.get('lang');
  const storedLang = localStorage.getItem('preferredLanguage');
  const detected   = urlLang || storedLang || navigator.language.split('-')[0];
  return ['fr', 'en'].includes(detected) ? detected : 'en';
};

const useCurrentLang = () => {
  const [lang, setLang] = useState(detectLang);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'preferredLanguage') setLang(detectLang());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return lang;
};

// ─────────────────────────────────────────────────────────────
// TRADUCTIONS
// ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    title: 'Create an Account',
    subtitle: 'Fill in the form below to create your account',
    accountType: 'I am a *',
    investor: 'Investor',
    investorDesc: 'Looking for investment opportunities',
    owner: 'Owner',
    ownerDesc: 'I want to sell or rent my properties',
    buyer: 'Buyer',
    buyerDesc: 'Looking for a property to buy',
    other: 'Other',
    otherDesc: 'Service provider, expert, or other profile',
    fullName: 'Full Name *',
    fullNamePlaceholder: 'John Doe',
    email: 'Email *',
    emailPlaceholder: 'john@example.com',
    phone: 'Phone',
    phonePlaceholder: '+237 6XX XXX XXX',
    password: 'Password *',
    passwordPlaceholder: '••••••••',
    confirmPassword: 'Confirm Password *',
    confirmPasswordPlaceholder: '••••••••',
    company: 'Company / Organization',
    companyPlaceholder: 'Your company',
    position: 'Position / Role',
    positionPlaceholder: 'Your position',
    city: 'City',
    cityPlaceholder: 'Douala, Yaoundé...',
    country: 'Country',
    countryPlaceholder: 'Cameroon',
    register: 'Create Account',
    registering: 'Creating account...',
    alreadyHaveAccount: 'Already have an account?',
    login: 'Log in',
    termsText: 'By creating an account, you agree to our',
    termsLink: 'Terms of Use',
    and: 'and',
    privacyLink: 'Privacy Policy',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    registrationSuccess: 'Registration successful! Redirecting to dashboard...',
    errorOccurred: 'An error occurred',
    joinTitle: 'Join Property Cameroon',
    joinDesc: 'Create an account to access the best real estate and agricultural opportunities in Cameroon, manage your investments and track your projects.',
    exclusiveAccess: 'Access to exclusive opportunities',
    easyManagement: 'Simplified investment management',
    support247: '24/7 personalized support',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required'
  },
  fr: {
    title: 'Créer un compte',
    subtitle: 'Remplissez le formulaire ci-dessous pour créer votre compte',
    accountType: 'Je suis *',
    investor: 'Investisseur',
    investorDesc: 'Recherche d\'opportunités d\'investissement',
    owner: 'Propriétaire',
    ownerDesc: 'Je souhaite vendre ou louer mes biens',
    buyer: 'Acheteur',
    buyerDesc: 'À la recherche d\'un bien immobilier',
    other: 'Autre',
    otherDesc: 'Prestataire, expert, ou autre profil',
    fullName: 'Nom complet *',
    fullNamePlaceholder: 'Jean Dupont',
    email: 'Email *',
    emailPlaceholder: 'jean@exemple.com',
    phone: 'Téléphone',
    phonePlaceholder: '+237 6XX XXX XXX',
    password: 'Mot de passe *',
    passwordPlaceholder: '••••••••',
    confirmPassword: 'Confirmer le mot de passe *',
    confirmPasswordPlaceholder: '••••••••',
    company: 'Société / Organisation',
    companyPlaceholder: 'Votre société',
    position: 'Poste / Fonction',
    positionPlaceholder: 'Votre poste',
    city: 'Ville',
    cityPlaceholder: 'Douala, Yaoundé...',
    country: 'Pays',
    countryPlaceholder: 'Cameroun',
    register: 'Créer mon compte',
    registering: 'Inscription en cours...',
    alreadyHaveAccount: 'Déjà un compte ?',
    login: 'Se connecter',
    termsText: 'En créant un compte, vous acceptez nos',
    termsLink: 'Conditions d\'utilisation',
    and: 'et notre',
    privacyLink: 'Politique de confidentialité',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
    registrationSuccess: 'Inscription réussie ! Redirection vers le tableau de bord...',
    errorOccurred: 'Une erreur est survenue',
    joinTitle: 'Rejoignez Property Cameroon',
    joinDesc: 'Créez un compte pour accéder aux meilleures opportunités immobilières et agricoles au Cameroun, gérer vos investissements et suivre vos projets.',
    exclusiveAccess: 'Accès aux opportunités exclusives',
    easyManagement: 'Gestion simplifiée de vos investissements',
    support247: 'Support personnalisé 7j/7',
    emailRequired: 'L\'email est requis',
    passwordRequired: 'Le mot de passe est requis'
  }
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const currentLang = useCurrentLang();
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }
    
    if (formData.password.length < 6) {
      setError(t.passwordTooShort);
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
        setSuccess(t.registrationSuccess);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.message || t.errorOccurred);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const accountTypes = [
    { value: 'investor', label: t.investor, icon: <Briefcase size={18} />, description: t.investorDesc },
    { value: 'owner', label: t.owner, icon: <Building2 size={18} />, description: t.ownerDesc },
    { value: 'buyer', label: t.buyer, icon: <Building2 size={18} />, description: t.buyerDesc },
    { value: 'other', label: t.other, icon: <User size={18} />, description: t.otherDesc }
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
                  <h2 className="text-2xl font-serif mb-4">{t.joinTitle}</h2>
                  <p className="text-slate-300 text-sm leading-relaxed mb-8">
                    {t.joinDesc}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-300">{t.exclusiveAccess}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-300">{t.easyManagement}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-300">{t.support247}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-slate-400">
                    {t.termsText}{' '}
                    <Link to="/terms" className="text-emerald-400 hover:underline">
                      {t.termsLink}
                    </Link>{' '}
                    {t.and}{' '}
                    <Link to="/privacy" className="text-emerald-400 hover:underline">
                      {t.privacyLink}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Form */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-serif text-slate-800">{t.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{t.subtitle}</p>
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
                {/* Account Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.accountType}
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
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.fullName}
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
                      placeholder={t.fullNamePlaceholder}
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.email}
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
                      placeholder={t.emailPlaceholder}
                    />
                  </div>
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.phone}
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder={t.phonePlaceholder}
                    />
                  </div>
                </div>
                
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.password}
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
                      placeholder={t.passwordPlaceholder}
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
                
                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.confirmPassword}
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
                      placeholder={t.confirmPasswordPlaceholder}
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
                
                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.company}
                  </label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder={t.companyPlaceholder}
                    />
                  </div>
                </div>
                
                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.position}
                  </label>
                  <div className="relative">
                    <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder={t.positionPlaceholder}
                    />
                  </div>
                </div>
                
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.city}
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder={t.cityPlaceholder}
                    />
                  </div>
                </div>
                
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.country}
                  </label>
                  <div className="relative">
                    <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder={t.countryPlaceholder}
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <User size={20} />}
                  {loading ? t.registering : t.register}
                </button>
                
                <p className="text-center text-sm text-slate-500">
                  {t.alreadyHaveAccount}{' '}
                  <Link to="/login" className="text-emerald-600 hover:underline font-medium">
                    {t.login}
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