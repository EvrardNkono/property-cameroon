import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Role State (Simulator)
  const [activeRoles, setActiveRoles] = useState(['BUYER']); 

  const isAdminMode = activeRoles.includes('ADMIN');

  // --- LOGIQUE: LOGOUT & REDIRECT ---
  const handleLogout = () => {
    // Nettoyage éventuel (localStorage.clear(), etc.)
    navigate('/');
  };

  // MENU CONFIGURATION
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

  // MENU FILTERING LOGIC
  const filteredMenu = menuConfig.filter(item => {
    if (isAdminMode) {
      if (item.isPersonal) return false;
      return item.roles.includes('ADMIN');
    }
    const isStrictAdmin = item.roles.includes('ADMIN') && item.roles.length === 1;
    if (isStrictAdmin) return false;
    return item.roles.some(role => activeRoles.includes(role));
  });

  // ROLE TOGGLE
  const toggleRole = (role) => {
    setActiveRoles(prev => {
      const newRoles = prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role];
      navigate('/dashboard'); 
      return newRoles;
    });
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#0a2619] text-white flex flex-col z-50 transition-all duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isAdminMode ? 'border-r-4 border-red-600/20' : ''} h-full`}>
        
        {/* LOGO (Fixe) */}
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

        {/* NAVIGATION (Scrollable) */}
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

        {/* LOGOUT BUTTON (Toujours visible en bas) */}
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
            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
            <h2 className="font-serif text-[#0a2619] text-lg italic transition-all">
              {isAdminMode ? "Master Console" : "Member Area"}
            </h2>
          </div>

          {/* ROLE SIMULATOR */}
          <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <div className="flex gap-1">
              {[
                { id: 'ADMIN', label: 'ADMIN', color: 'bg-red-600' },
                { id: 'OWNER', label: 'Owner', color: 'bg-orange-500' },
                { id: 'INVESTOR', label: 'Investor', color: 'bg-[#0a2619]' },
                { id: 'BUYER', label: 'Buyer', color: 'bg-blue-600' }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => toggleRole(role.id)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeRoles.includes(role.id)
                      ? `${role.color} text-white shadow-md scale-105`
                      : 'bg-white text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* PROFILE INDICATOR */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-[#0a2619] uppercase">Evrard</p>
              <p className={`text-[8px] font-bold uppercase tracking-[0.1em] ${isAdminMode ? 'text-red-600' : 'text-[#c5a059]'}`}>
                 {isAdminMode ? 'Super Admin' : 'Premium Member'}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-500 ${
              isAdminMode ? 'bg-red-50 border-red-600 text-red-600 rotate-[360deg]' : 'bg-[#c5a059] border-[#0a2619]/10 text-[#0a2619]'
            }`}>
              E
            </div>
          </div>
        </header>

        {/* ZONE DE CONTENU SCROLLABLE */}
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