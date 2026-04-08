import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
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
  Bell, 
  Zap,
  ShieldAlert 
} from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 1. ÉTAT INITIAL : On met 'BUYER' par défaut pour vérifier que l'admin est masqué
  const [activeRoles, setActiveRoles] = useState(['BUYER']); 

  const menuConfig = [
    { 
      label: 'Vue Générale', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} />, 
      roles: ['BUYER', 'OWNER', 'INVESTOR', 'ADMIN'] 
    },
    { 
      label: 'Gestion Plateforme', 
      path: '/dashboard/admin', 
      icon: <ShieldAlert size={20} />, 
      roles: ['ADMIN'] // STRICTEMENT réservé à l'admin
    },
    { 
      label: 'Mes Biens', 
      path: '/dashboard/properties', 
      icon: <Home size={20} />, 
      roles: ['OWNER', 'ADMIN'] 
    },
    { 
      label: 'Titres Fonciers', 
      path: '/dashboard/titles', 
      icon: <FileCheck size={20} />, 
      roles: ['OWNER', 'ADMIN'] 
    },
    { 
      label: 'Investissements', 
      path: '/dashboard/invest', 
      icon: <TrendingUp size={20} />, 
      roles: ['INVESTOR', 'ADMIN'] 
    },
    { 
      label: 'Sourcing Chine', 
      path: '/dashboard/sourcing', 
      icon: <Truck size={20} />, 
      roles: ['BUYER', 'ADMIN'] 
    },
    { 
      label: 'Mon Profil', 
      path: '/dashboard/profile', 
      icon: <UserCircle size={20} />, 
      roles: ['BUYER', 'OWNER', 'INVESTOR', 'ADMIN'] 
    },
  ];

  // 2. FILTRAGE STRICT : 
  // On vérifie si AU MOINS UN des rôles requis pour l'item est présent dans activeRoles
  const filteredMenu = menuConfig.filter(item => 
    item.roles.some(role => activeRoles.includes(role))
  );

  const toggleRole = (role) => {
    setActiveRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#0a2619] text-white flex flex-col z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tighter italic">PROPERTY <span className="text-[#c5a059]">CAMEROON</span></h1>
          <button className="lg:hidden text-white/50" onClick={() => setIsSidebarOpen(false)}><X /></button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {filteredMenu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 p-3.5 rounded-xl transition-all ${
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

        <div className="p-6 border-t border-white/5">
          <button className="flex items-center gap-3 text-white/30 hover:text-red-400 text-xs uppercase font-black tracking-widest transition-colors w-full">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="h-auto md:h-24 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-4 md:px-10 sticky top-0 z-30 py-4 md:py-0 gap-4">
          
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
              <h2 className="hidden md:block font-serif text-[#0a2619] text-lg italic">
                {activeRoles.includes('ADMIN') ? "Console d'Administration" : "Espace de Gestion"}
              </h2>
            </div>
          </div>

          {/* SIMULATEUR DE RÔLES (DEBUG) */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto max-w-full no-scrollbar">
            <div className="flex gap-1">
              {[
                { id: 'ADMIN', label: 'ADMIN', color: 'bg-red-600' },
                { id: 'OWNER', label: 'Proprio', color: 'bg-orange-500' },
                { id: 'INVESTOR', label: 'Invest', color: 'bg-[#0a2619]' },
                { id: 'BUYER', label: 'Acheteur', color: 'bg-blue-600' }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => toggleRole(role.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all duration-300 ${
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
          <div className="flex items-center gap-3 md:gap-6 ml-auto md:ml-0">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-[#0a2619] uppercase tracking-tighter">Evrard</p>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${activeRoles.includes('ADMIN') ? 'text-red-600' : 'text-[#c5a059]'}`}>
                   {activeRoles.includes('ADMIN') ? 'Accès Total' : 'Membre Premium'}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold shadow-sm transition-colors duration-500 ${
                activeRoles.includes('ADMIN') 
                ? 'bg-red-50 border-red-600 text-red-600' 
                : 'bg-[#c5a059] border-[#0a2619]/10 text-[#0a2619]'
              }`}>
                E
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 p-4 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ activeRoles, setActiveRoles }} />
          </div>
        </section>

      </main>
    </div>
  );
};

export default DashboardLayout;