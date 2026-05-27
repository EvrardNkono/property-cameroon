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

// --- COMPOSANT DE TRADUCTION MODERNE (VERT & OR) ---
const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'fr';
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Charge Google Translate une seule fois
  useEffect(() => {
    if (document.getElementById('google-translate-script')) {
      setIsScriptLoaded(true);
      return;
    }

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: 'fr,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element_hidden');
        
        setIsScriptLoaded(true);
        
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

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    if (isScriptLoaded) {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
      }
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bouton principal - VERT ET OR */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg rounded-full transition-all duration-300"
      >
        <span className="text-xl">
          {currentLang === 'fr' ? '🇫🇷' : '🇬🇧'}
        </span>
        <span className="font-semibold text-white tracking-wide">
          {currentLang === 'fr' ? 'FR' : 'EN'}
        </span>
        <svg 
          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu déroulant - VERT ET OR */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl overflow-hidden z-50 border border-amber-100">
            <button
              onClick={() => changeLanguage('fr')}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                currentLang === 'fr' 
                  ? 'bg-gradient-to-r from-green-50 to-amber-50 text-green-700 border-r-4 border-green-600' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-2xl">🇫🇷</span>
              <div className="text-left">
                <div className={`font-medium ${currentLang === 'fr' ? 'text-green-700' : 'text-gray-700'}`}>
                  Français
                </div>
                <div className="text-xs text-gray-400">Français</div>
              </div>
              {currentLang === 'fr' && (
                <svg className="w-4 h-4 ml-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                currentLang === 'en' 
                  ? 'bg-gradient-to-r from-green-50 to-amber-50 text-amber-700 border-r-4 border-amber-600' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-2xl">🇬🇧</span>
              <div className="text-left">
                <div className={`font-medium ${currentLang === 'en' ? 'text-amber-700' : 'text-gray-700'}`}>
                  English
                </div>
                <div className="text-xs text-gray-400">Anglais</div>
              </div>
              {currentLang === 'en' && (
                <svg className="w-4 h-4 ml-auto text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}

      {/* Conteneur caché pour Google Translate */}
      <div id="google_translate_element_hidden" style={{ display: 'none' }} />
    </div>
  );
};

// Styles pour masquer COMPLÈTEMENT le widget Google Translate
const hideGoogleTranslateStyles = `
  .goog-te-banner-frame.skiptranslate {
    display: none !important;
  }
  body {
    top: 0px !important;
  }
  .goog-te-gadget {
    font-size: 0 !important;
    height: 0 !important;
  }
  .goog-te-gadget .goog-te-combo {
    display: none !important;
  }
  .goog-te-menu-frame {
    max-width: 100% !important;
  }
  .goog-te-menu2 {
    max-width: 100% !important;
  }
  /* Supprime l'espace résiduel */
  iframe.skiptranslate {
    display: none !important;
  }
`;

function App() {
  // Injecte les styles de masquage
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = hideGoogleTranslateStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* --- ROUTES PUBLIQUES PRINCIPALES --- */}
              <Route path="/"                    element={<Home />} />
              <Route path="/login"               element={<Login />} />
              <Route path="/register"            element={<Register />} />
              <Route path="/real-estate"         element={<RealEstatePage />} />
              <Route path="/real-estate/:id"     element={<PropertyDetailsWrapper />} />
              <Route path="/experts"             element={<ExpertHubPage />} />
              <Route path="/global-sourcing"     element={<SourcingPage />} />
              <Route path="/book-appointment"    element={<AppointmentPage />} />

              {/* --- ÉCOSYSTÈME AGRICULTURE --- */}
              <Route path="/agriculture"                          element={<AgriculturePage />} />
              <Route path="/agriculture/products"                 element={<AgriculturalProducts />} />
              <Route path="/agriculture/land/:id"                 element={<LandDetailPage />} />
              <Route path="/agriculture/marketplace"              element={<MarketplacePage />} />
              <Route path="/agriculture/expertise"                element={<ExpertisePage />} />
              <Route path="/agriculture/livestock"                element={<LivestockPage />} />
              <Route path="/agriculture/livestock/:category"      element={<LivestockCategoryPage />} />
              <Route path="/agriculture/livestock/:category/:id"  element={<ProjectDetailsPage />} />

              {/* --- CADRE LÉGAL & INSTITUTIONNEL --- */}
              <Route path="/agriculture/institutional-framework" element={<InstitutionalPage />} />
              <Route path="/agriculture/legal-safety"            element={<LegalCompliancePage />} />

              {/* --- BLOG --- */}
              <Route path="/blog"     element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />

              {/* --- DASHBOARD --- */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Overview />} />

                {/* Admin */}
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

                {/* Utilisateur - Real Estate */}
                <Route path="profile"              element={<UserProfile />} />
                <Route path="properties"           element={<MyLands />} />
                <Route path="properties/new"       element={<PropertyForm />} />
                <Route path="properties/edit/:id"  element={<PropertyForm />} />
                <Route path="titles"               element={<TitleDocuments />} />

                {/* Utilisateur - Livestock */}
                <Route path="livestock" element={<LivestockManagement />} />

                {/* Utilisateur - Agriculture */}
                <Route path="agriculture"           element={<AgriculturalManagement />} />
                <Route path="my-agricultural-lands" element={<MyAgriculturalLands />} />

                {/* Utilisateur - Investisseur */}
                <Route path="invest"  element={<Portfolio />} />
                <Route path="yields"  element={<YieldReports />} />

                {/* Utilisateur - Acheteur */}
                <Route path="purchases" element={<MyPurchases />} />
                <Route path="sourcing"  element={<SourcingTracker />} />
              </Route>
            </Routes>
          </Suspense>

          {/* BOUTON DE TRADUCTION - VERT & OR - POSITION HAUT DROITE */}
          <div className="fixed top-4 right-4 z-50">
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