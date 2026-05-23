// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ArrowRight, Building2, ShieldCheck, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 🔥 Détection automatique de l'environnement (AJOUTE CES 7 LIGNES)
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// URLs en dur selon l'environnement (AJOUTE CES 3 LIGNES)
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'           // URL locale
  : 'https://property-cameroon-backend.vercel.app';  // URL de production

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔥 Console.log pour debug (optionnel)
  if (typeof window !== 'undefined') {
    console.log(`🌍 Login page - Environnement: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
    console.log(`🔗 Login page - Backend URL: ${BACKEND_URL}`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-20 px-4">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-200 rounded-full opacity-20 blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-emerald-900 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  <Building2 size={40} className="text-amber-400" />
                </div>
                <h1 className="text-5xl font-serif text-emerald-900 mb-4">
                  Welcome Back
                </h1>
                <p className="text-emerald-700 text-lg mb-8">
                  Access your investment dashboard, track your portfolio, and manage your assets across Cameroon's premier real estate platform.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <span className="text-sm text-emerald-700">Certified legal titles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-emerald-600" />
                    <span className="text-sm text-emerald-700">Pan-African investment network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                <Building2 size={32} className="text-emerald-700" />
              </div>
              <h2 className="text-2xl font-serif text-emerald-900">Sign In</h2>
              <p className="text-emerald-600 text-sm mt-1">Access your private space</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-emerald-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase text-emerald-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-emerald-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-[10px] text-emerald-500 hover:text-emerald-700 transition-colors">
                  Forgot password?
                </Link>
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
                    Sign In
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-emerald-100 text-center">
              <p className="text-[10px] text-emerald-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-emerald-700 hover:text-emerald-900 underline transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;