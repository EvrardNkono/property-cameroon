// frontend/src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import PropertyTicker from './components/real-estate/PropertyTicker';
import api from './services/api';

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

// 🔥 Composant pour gérer le scroll et forcer les re-rendus
const RouteChangeHandler = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return <>{children}</>;
};

// Styles globaux
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
  const [allProperties, setAllProperties] = useState([]);
  const [propertiesLoaded, setPropertiesLoaded] = useState(false);

  // Récupérer les propriétés pour le ticker
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.getProperties({ status: 'PUBLISHED', limit: 20 });
        const properties = response.properties || response.data?.properties || [];
        setAllProperties(properties);
      } catch (error) {
        console.error('Error fetching properties for ticker:', error);
      } finally {
        setPropertiesLoaded(true);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        
        <div className="pt-32">
          <RouteChangeHandler>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/real-estate" element={<RealEstatePage />} />
                <Route path="/real-estate/:id" element={<PropertyDetailsWrapper />} />
                <Route path="/experts" element={<ExpertHubPage />} />
                <Route path="/global-sourcing" element={<SourcingPage />} />
                <Route path="/book-appointment" element={<AppointmentPage />} />
                <Route path="/agriculture" element={<AgriculturePage />} />
                <Route path="/agriculture/products" element={<AgriculturalProducts />} />
                <Route path="/agriculture/land/:id" element={<LandDetailPage />} />
                <Route path="/agriculture/marketplace" element={<MarketplacePage />} />
                <Route path="/agriculture/expertise" element={<ExpertisePage />} />
                <Route path="/agriculture/livestock" element={<LivestockPage />} />
                <Route path="/agriculture/livestock/:category" element={<LivestockCategoryPage />} />
                <Route path="/agriculture/livestock/:category/:id" element={<ProjectDetailsPage />} />
                <Route path="/agriculture/institutional-framework" element={<InstitutionalPage />} />
                <Route path="/agriculture/legal-safety" element={<LegalCompliancePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Overview />} />
                  <Route path="admin" element={<AdminOverview />} />
                  <Route path="admin/users" element={<UserManagement />} />
                  <Route path="admin/inventory" element={<GlobalInventory />} />
                  <Route path="admin/finances" element={<FinancialControl />} />
                  <Route path="admin/properties/new" element={<PropertyForm />} />
                  <Route path="admin/properties/edit/:id" element={<PropertyForm />} />
                  <Route path="admin/agriculture" element={<AgriculturalInventory />} />
                  <Route path="admin/agricultural-products" element={<AgriculturalManagement />} />
                  <Route path="admin/livestock-categories" element={<LivestockCategoriesManager />} />
                  <Route path="admin/livestock" element={<LivestockAssetsManager />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="properties" element={<MyLands />} />
                  <Route path="properties/new" element={<PropertyForm />} />
                  <Route path="properties/edit/:id" element={<PropertyForm />} />
                  <Route path="titles" element={<TitleDocuments />} />
                  <Route path="livestock" element={<LivestockManagement />} />
                  <Route path="agriculture" element={<AgriculturalManagement />} />
                  <Route path="my-agricultural-lands" element={<MyAgriculturalLands />} />
                  <Route path="invest" element={<Portfolio />} />
                  <Route path="yields" element={<YieldReports />} />
                  <Route path="purchases" element={<MyPurchases />} />
                  <Route path="sourcing" element={<SourcingTracker />} />
                </Route>
              </Routes>
            </Suspense>
          </RouteChangeHandler>
        </div>

        {/* Property Ticker - Visible sur toutes les pages (sauf dashboard peut-être) */}
        {propertiesLoaded && allProperties.length > 0 && (
          <PropertyTicker properties={allProperties} interval={120000} />
        )}

        {/* WhatsApp Button - Visible sur toutes les pages */}
        <WhatsAppButton />

        <Suspense fallback={null}>
          <ChatAssistant />
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;