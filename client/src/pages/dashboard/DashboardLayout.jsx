import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  FileCheck, 
  TrendingUp, 
  Truck, 
  UserCircle, 
  LogOut, 
  Menu, 
  X, 
  Users,
  Database,
  BarChart3,
  Loader2,
  Sprout,
  Beef,
  Leaf
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoles, setActiveRoles] = useState([]);
  const [isUpdatingRoles, setIsUpdatingRoles] = useState(false);

  // Initialiser les rôles actifs depuis l'utilisateur connecté
  useEffect(() => {
    if (user && user.roles) {
      setActiveRoles(user.roles);
    }
  }, [user]);

  const isAdminMode = activeRoles.includes('ADMIN');

  // Déconnexion
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Changer les rôles actifs (mode simulation)
  const toggleRole = async (role) => {
    // Ne pas permettre de désactiver ADMIN si c'est le seul rôle ?
    if (role === 'ADMIN' && activeRoles.length === 1 && activeRoles.includes('ADMIN')) {
      return;
    }
    
    setActiveRoles(prev => {
      const newRoles = prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role];
      
      // Si on active ADMIN, on navigue vers le dashboard admin
      if (role === 'ADMIN' && !prev.includes(role)) {
        navigate('/dashboard/admin/users');
      }
      // Si on désactive ADMIN, on navigue vers le dashboard utilisateur
      if (role === 'ADMIN' && prev.includes(role) && newRoles.length === 0) {
        navigate('/dashboard');
      }
      
      return newRoles;
    });
  };

  // Configuration du menu
  const menuConfig = [
    { 
      label: 'Overview', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} />, 
      roles: ['BUYER', 'OWNER', 'INVESTOR', 'ADMIN'],
      alwaysShow: true 
    },
    // --- ADMIN SECTION ---
    { 
      label: 'User Management', 
      path: '/dashboard/admin/users', 
      icon: <Users size={20} />, 
      roles: ['ADMIN'] 
    },
    { 
      label: 'Global Inventory', 
      path: '/dashboard/admin/inventory', 
      icon: <Database size={20} />, 
      roles: ['ADMIN'] 
    },
    { 
      label: 'Financial Control', 
      path: '/dashboard/admin/finances', 
      icon: <BarChart3 size={20} />, 
      roles: ['ADMIN'] 
    },
    { 
      label: 'Agricultural Lands', 
      path: '/dashboard/admin/agriculture', 
      icon: <Sprout size={20} />, 
      roles: ['ADMIN'] 
    },
    { 
      label: 'Livestock Categories', 
      path: '/dashboard/admin/livestock-categories', 
      icon: <Beef size={20} />, 
      roles: ['ADMIN'] 
    },
    { 
      label: 'Livestock Assets', 
      path: '/dashboard/admin/livestock', 
      icon: <Leaf size={20} />, 
      roles: ['ADMIN'] 
    },
    // --- USER SECTION ---
    { 
      label: 'My Properties', 
      path: '/dashboard/properties', 
      icon: <Home size={20} />, 
      roles: ['OWNER'],
      isPersonal: true 
    },
    { 
      label: 'Land Titles', 
      path: '/dashboard/titles', 
      icon: <FileCheck size={20} />, 
      roles: ['OWNER'],
      isPersonal: true 
    },
    { 
      label: 'Investments', 
      path: '/dashboard/invest', 
      icon: <TrendingUp size={20} />, 
      roles: ['INVESTOR'],
      isPersonal: true 
    },
    { 
      label: 'China Sourcing', 
      path: '/dashboard/sourcing', 
      icon: <Truck size={20} />, 
      roles: ['BUYER'],
      isPersonal: true 
    },
    { 
      label: 'My Profile', 
      path: '/dashboard/profile', 
      icon: <UserCircle size={20} />, 
      roles: ['BUYER', 'OWNER', 'INVESTOR', 'ADMIN'],
      alwaysShow: true
    },
  ];

  // Filtrage du menu selon les rôles actifs
  const filteredMenu = menuConfig.filter(item => {
    if (isAdminMode) {
      // En mode admin, on cache les sections personnelles
      if (item.isPersonal) return false;
      return item.roles.includes('ADMIN');
    }
    // En mode utilisateur, on cache les sections admin
    const isStrictAdmin = item.roles.includes('ADMIN') && item.roles.length === 1;
    if (isStrictAdmin) return false;
    return item.roles.some(role => activeRoles.includes(role));
  });

  // Récupérer le nom d'utilisateur
  const getUserName = () => {
    if (!user) return 'Invité';
    return user.name || user.email?.split('@')[0] || 'Utilisateur';
  };

  // Récupérer la lettre pour l'avatar
  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  // Récupérer le rôle principal pour l'affichage
  const getPrimaryRoleLabel = () => {
    if (isAdminMode) return 'Super Admin';
    if (activeRoles.includes('OWNER')) return 'Propriétaire';
    if (activeRoles.includes('INVESTOR')) return 'Investisseur';
    if (activeRoles.includes('BUYER')) return 'Acheteur';
    return 'Membre';
  };

  // Chargement
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
      </div>
    );
  }

  // Redirection si non connecté
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#0a2619] text-white flex flex-col z-50 transition-all duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isAdminMode ? 'border-r-4 border-red-600/20' : ''} h-full`}>
        
        {/* LOGO */}
        <div className="p-8 flex-shrink-0">
          <h1 className="text-xl font-bold tracking-tighter italic uppercase">
            Property <span className="text-[#c5a059]">Cameroon</span>
          </h1>
          {isAdminMode && (
            <div className="mt-2 inline-block px-2 py-0.5 bg-red-600 text-[8px] font-black uppercase tracking-[0.2em] rounded animate-pulse">
              Administration Mode
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide hover:scrollbar-default">
          {filteredMenu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 ${
                location.pathname === item.path 
                  ? 'bg-[#c5a059] text-[#0a2619] font-bold shadow-lg scale-[1.02]' 
                  : 'hover:bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-sm tracking-wide">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-6 border-t border-white/5 flex-shrink-0 bg-[#0a2619]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-white/30 hover:text-red-400 text-xs uppercase font-black tracking-widest transition-colors w-full group"
          >
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="h-auto md:h-24 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-4 md:px-10 shrink-0 py-4 md:py-0 gap-4">
          
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}>
              <Menu />
            </button>
            <h2 className="font-serif text-[#0a2619] text-lg italic transition-all">
              {isAdminMode ? "Master Console" : "Member Area"}
            </h2>
          </div>

          {/* ROLE SELECTOR */}
          <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <div className="flex gap-1">
              {[
                { id: 'ADMIN', label: 'ADMIN', color: 'bg-red-600' },
                { id: 'OWNER', label: 'Owner', color: 'bg-orange-500' },
                { id: 'INVESTOR', label: 'Investor', color: 'bg-[#0a2619]' },
                { id: 'BUYER', label: 'Buyer', color: 'bg-blue-600' }
              ].map((role) => {
                // Vérifier si l'utilisateur a réellement ce rôle dans son compte
                const hasRole = user?.roles?.includes(role.id);
                if (!hasRole && role.id !== 'BUYER') return null;
                
                return (
                  <button
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    disabled={!hasRole && role.id !== 'BUYER'}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                      activeRoles.includes(role.id)
                        ? `${role.color} text-white shadow-md scale-105`
                        : 'bg-white text-slate-400 hover:bg-slate-50'
                    } ${!hasRole && role.id !== 'BUYER' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PROFILE INDICATOR */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-[#0a2619] uppercase">{getUserName()}</p>
              <p className={`text-[8px] font-bold uppercase tracking-[0.1em] ${isAdminMode ? 'text-red-600' : 'text-[#c5a059]'}`}>
                {getPrimaryRoleLabel()}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-500 ${
              isAdminMode ? 'bg-red-50 border-red-600 text-red-600 rotate-[360deg]' : 'bg-[#c5a059] border-[#0a2619]/10 text-[#0a2619]'
            }`}>
              {getUserInitial()}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="flex-1 p-4 md:p-10 overflow-y-auto bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto">
            <Outlet key={activeRoles.join(',')} context={{ activeRoles, setActiveRoles }} />
          </div>
        </section>

      </main>
    </div>
  );
};

export default DashboardLayout;