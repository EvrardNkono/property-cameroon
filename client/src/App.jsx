// frontend/src/App.jsx

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// --- PAGES PUBLIQUES ---
const Home                = lazy(() => import('./pages/Home'));
const Login               = lazy(() => import('./pages/Login'));
const Register            = lazy(() => import('./pages/Register'));
const RealEstatePage      = lazy(() => import('./pages/RealEstate'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage'));
const AgriculturePage     = lazy(() => import('./pages/AgriculturePage'));
const ExpertisePage       = lazy(() => import('./pages/Expertise'));
const ExpertHubPage       = lazy(() => import('./pages/ExpertHubPage'));
const MarketplacePage     = lazy(() => import('./pages/MarketplacePage'));
const AppointmentPage     = lazy(() => import('./pages/Appointment'));
const SourcingPage        = lazy(() => import('./pages/Sourcing'));

// --- PAGES INSTITUTIONNELLES ---
const InstitutionalPage   = lazy(() => import('./pages/InstitutionalProfil'));
const LegalCompliancePage = lazy(() => import('./pages/LegalCompliance'));

// --- BLOG ---
const BlogPage            = lazy(() => import('./pages/Blog'));
const BlogPostDetail = () => (
  <div className="pt-40 text-center font-serif italic text-slate-500">
    Lecture de l'article en cours de développement...
  </div>
);

// --- LIVESTOCK ---
const LivestockPage         = lazy(() => import('./pages/LivestockIntroduction'));
const LivestockCategoryPage = lazy(() => import('./pages/LivestockCategoryPage'));
const ProjectDetailsPage    = lazy(() => import('./pages/ProjectDetailsPage'));

// --- CHATBOT ---
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));

// --- DASHBOARD (STRUCTURE & UTILISATEURS) ---
const DashboardLayout    = lazy(() => import('./pages/dashboard/DashboardLayout'));
const Overview           = lazy(() => import('./pages/dashboard/Overview'));
const UserProfile        = lazy(() => import('./pages/dashboard/UserProfile'));
const MyLands            = lazy(() => import('./pages/dashboard/lands/MyLands'));
const TitleDocuments     = lazy(() => import('./pages/dashboard/lands/TitleDocuments'));
const Portfolio          = lazy(() => import('./pages/dashboard/invest/Portfolio'));
const YieldReports       = lazy(() => import('./pages/dashboard/invest/YieldReports'));
const MyPurchases        = lazy(() => import('./pages/dashboard/market/MyPurchases'));
const SourcingTracker    = lazy(() => import('./pages/dashboard/market/SourcingTracker'));

// --- DASHBOARD (ADMINISTRATION) ---
const AdminOverview              = lazy(() => import('./pages/dashboard/admin/AdminOverview'));
const UserManagement             = lazy(() => import('./pages/dashboard/admin/UserManagement'));
const GlobalInventory            = lazy(() => import('./pages/dashboard/admin/GlobalInventory'));
const FinancialControl           = lazy(() => import('./pages/dashboard/admin/FinancialControl'));
const AgriculturalInventory      = lazy(() => import('./pages/dashboard/admin/AgriculturalInventory'));
const LivestockCategoriesManager = lazy(() => import('./pages/dashboard/admin/LivestockCategoriesManager'));
const LivestockAssetsManager     = lazy(() => import('./pages/dashboard/admin/LivestockAssetsManager'));

// --- PROPERTY FORM ---
const PropertyForm = lazy(() => import('./pages/dashboard/properties/PropertyForm'));

// --- LIVESTOCK MANAGEMENT ---
const LivestockManagement = lazy(() => import('./pages/dashboard/livestock/LivestockManagement'));

// --- AGRICULTURAL MANAGEMENT ---
const AgriculturalManagement = lazy(() => import('./pages/dashboard/agricultural/AgriculturalManagement'));
const MyAgriculturalLands    = lazy(() => import('./pages/dashboard/agricultural/MyAgriculturalLands'));

// --- PAGE PUBLIQUE PRODUITS AGRICOLES ---
const AgriculturalProducts = lazy(() => import('./pages/AgriculturalProducts'));

// --- PAGE DETAIL TERRES AGRICOLES ---
const LandDetailPage = lazy(() => import('./pages/LandDetailPage'));

// Spinner de chargement léger
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
  </div>
);

// Wrapper avec key pour forcer le rechargement
const PropertyDetailsWrapper = () => {
  const { id } = useParams();
  return <PropertyDetailsPage key={id} />;
};

// ============================================================
// COMPOSANT DE TRADUCTION LUXE - CHARTER VERT & OR
// ============================================================
const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'fr';
  });
  const [isOpen, setIsOpen] = useState(false);

  // Charge Google Translate et le cache complètement
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: 'fr,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element_hidden');
        
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang === 'en') {
          setTimeout(() => {
            const select = document.querySelector('.goog-te-combo');
            if (select) {
              select.value = 'en';
              select.dispatchEvent(new Event('change'));
            }
          }, 500);
        }
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* BOUTON PRINCIPAL - DESIGN LUXE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-5 py-2.5 rounded-full font-medium transition-all duration-300 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a4d2c 0%, #2d6a3b 100%)',
          boxShadow: '0 8px 20px -4px rgba(0,0,0,0.15), 0 0 0 1px rgba(212, 175, 55, 0.3) inset'
        }}
      >
        {/* Effet de brillance au hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {/* Drapeau avec effet 3D */}
        <span className="text-xl drop-shadow-md">
          {currentLang === 'fr' ? '🇫🇷' : '🇬🇧'}
        </span>
        
        {/* Texte avec couleur OR */}
        <span className="font-semibold tracking-wide text-amber-400">
          {currentLang === 'fr' ? 'FRANÇAIS' : 'ENGLISH'}
        </span>
        
        {/* Icône flèche dorée */}
        <svg 
          className={`w-4 h-4 text-amber-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* MENU DÉROULANT - DESIGN PREMIUM */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div 
            className="absolute right-0 mt-3 w-64 rounded-2xl overflow-hidden z-50 animate-fadeInUp"
            style={{
              background: '#ffffff',
              boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2), 0 0 0 1px rgba(212, 175, 55, 0.2)'
            }}
          >
            {/* Option FRANÇAIS */}
            <button
              onClick={() => changeLanguage('fr')}
              className={`w-full px-5 py-4 flex items-center gap-4 transition-all duration-200 ${
                currentLang === 'fr' 
                  ? 'bg-gradient-to-r from-emerald-50 to-transparent' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                currentLang === 'fr' ? 'bg-emerald-100 shadow-inner' : 'bg-gray-100'
              }`}>
                🇫🇷
              </div>
              <div className="flex-1 text-left">
                <div className={`font-semibold ${currentLang === 'fr' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  Français
                </div>
                <div className="text-xs text-gray-400">Langue principale</div>
              </div>
              {currentLang === 'fr' && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow" />
              )}
            </button>

            {/* Séparateur OR */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-4" />

            {/* Option ENGLISH */}
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full px-5 py-4 flex items-center gap-4 transition-all duration-200 ${
                currentLang === 'en' 
                  ? 'bg-gradient-to-r from-amber-50 to-transparent' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                currentLang === 'en' ? 'bg-amber-100 shadow-inner' : 'bg-gray-100'
              }`}>
                🇬🇧
              </div>
              <div className="flex-1 text-left">
                <div className={`font-semibold ${currentLang === 'en' ? 'text-amber-600' : 'text-gray-700'}`}>
                  English
                </div>
                <div className="text-xs text-gray-400">International</div>
              </div>
              {currentLang === 'en' && (
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-glow" />
              )}
            </button>
          </div>
        </>
      )}

      {/* Google Translate caché */}
      <div id="google_translate_element_hidden" style={{ display: 'none' }} />
    </div>
  );
};

// Styles pour masquer Google Translate proprement
const globalStyles = `
  .goog-te-banner-frame.skiptranslate, .goog-te-gadget, iframe.skiptranslate {
    display: none !important;
  }
  body { top: 0px !important; }
  .goog-te-combo { display: none !important; }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeInUp { animation: fadeInUp 0.2s ease-out; }
  
  .shadow-glow { box-shadow: 0 0 6px currentColor; }
`;

function App() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"                    element={<Home />} />
              <Route path="/login"               element={<Login />} />
              <Route path="/register"            element={<Register />} />
              <Route path="/real-estate"         element={<RealEstatePage />} />
              <Route path="/real-estate/:id"     element={<PropertyDetailsWrapper />} />
              <Route path="/experts"             element={<ExpertHubPage />} />
              <Route path="/global-sourcing"     element={<SourcingPage />} />
              <Route path="/book-appointment"    element={<AppointmentPage />} />
              <Route path="/agriculture"                          element={<AgriculturePage />} />
              <Route path="/agriculture/products"                 element={<AgriculturalProducts />} />
              <Route path="/agriculture/land/:id"                 element={<LandDetailPage />} />
              <Route path="/agriculture/marketplace"              element={<MarketplacePage />} />
              <Route path="/agriculture/expertise"                element={<ExpertisePage />} />
              <Route path="/agriculture/livestock"                element={<LivestockPage />} />
              <Route path="/agriculture/livestock/:category"      element={<LivestockCategoryPage />} />
              <Route path="/agriculture/livestock/:category/:id"  element={<ProjectDetailsPage />} />
              <Route path="/agriculture/institutional-framework" element={<InstitutionalPage />} />
              <Route path="/agriculture/legal-safety"            element={<LegalCompliancePage />} />
              <Route path="/blog"     element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="admin"                      element={<AdminOverview />} />
                <Route path="admin/users"                element={<UserManagement />} />
                <Route path="admin/inventory"            element={<GlobalInventory />} />
                <Route path="admin/finances"             element={<FinancialControl />} />
                <Route path="admin/properties/new"       element={<PropertyForm />} />
                <Route path="admin/properties/edit/:id"  element={<PropertyForm />} />
                <Route path="admin/agriculture"          element={<AgriculturalInventory />} />
                <Route path="admin/agricultural-products" element={<AgriculturalManagement />} />
                <Route path="admin/livestock-categories" element={<LivestockCategoriesManager />} />
                <Route path="admin/livestock"            element={<LivestockAssetsManager />} />
                <Route path="profile"              element={<UserProfile />} />
                <Route path="properties"           element={<MyLands />} />
                <Route path="properties/new"       element={<PropertyForm />} />
                <Route path="properties/edit/:id"  element={<PropertyForm />} />
                <Route path="titles"               element={<TitleDocuments />} />
                <Route path="livestock" element={<LivestockManagement />} />
                <Route path="agriculture"           element={<AgriculturalManagement />} />
                <Route path="my-agricultural-lands" element={<MyAgriculturalLands />} />
                <Route path="invest"  element={<Portfolio />} />
                <Route path="yields"  element={<YieldReports />} />
                <Route path="purchases" element={<MyPurchases />} />
                <Route path="sourcing"  element={<SourcingTracker />} />
              </Route>
            </Routes>
          </Suspense>

          {/* BOUTON DE TRADUCTION LUXE */}
          <div className="fixed top-6 right-6 z-50">
            <LanguageSwitcher />
          </div>

          <Suspense fallback={null}>
            <ChatAssistant />
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;