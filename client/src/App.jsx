import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// --- IMPORTS DES PAGES PUBLIQUES ---
import Home from './pages/Home';
import RealEstatePage from './pages/RealEstate';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AgriculturePage from './pages/AgriculturePage'; 
import ExpertisePage from './pages/Expertise'; 
import ExpertHubPage from './pages/ExpertHubPage';
import MarketplacePage from './pages/MarketplacePage';
import AppointmentPage from './pages/Appointment';
import SourcingPage from './pages/Sourcing'; 

// --- PAGES INSTITUTIONNELLES ---
import InstitutionalPage from './pages/InstitutionalProfil'; 
import LegalCompliancePage from './pages/LegalCompliance'; 

// --- IMPORTS BLOG ---
import BlogPage from './pages/Blog';
const BlogPostDetail = () => (
  <div className="pt-40 text-center font-serif italic text-slate-500">
    Lecture de l'article en cours de développement...
  </div>
);

// --- IMPORT LIVESTOCK ---
import LivestockPage from './pages/LivestockIntroduction'; 
import LivestockCategoryPage from './pages/LivestockCategoryPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';

// --- IMPORT CHATBOT ---
import ChatAssistant from './components/ChatAssistant';

// --- IMPORTS DASHBOARD (STRUCTURE & UTILISATEURS) ---
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import UserProfile from './pages/dashboard/UserProfile';
import MyLands from './pages/dashboard/lands/MyLands';
import TitleDocuments from './pages/dashboard/lands/TitleDocuments';
import Portfolio from './pages/dashboard/invest/Portfolio';
import YieldReports from './pages/dashboard/invest/YieldReports';
import MyPurchases from './pages/dashboard/market/MyPurchases';
import SourcingTracker from './pages/dashboard/market/SourcingTracker';

// --- IMPORTS DASHBOARD (ADMINISTRATION) ---
import AdminOverview from './pages/dashboard/admin/AdminOverview';
import UserManagement from './pages/dashboard/admin/UserManagement';
import GlobalInventory from './pages/dashboard/admin/GlobalInventory';
import FinancialControl from './pages/dashboard/admin/FinancialControl';
import AgriculturalInventory from './pages/dashboard/admin/AgriculturalInventory';
import LivestockCategoriesManager from './pages/dashboard/admin/LivestockCategoriesManager';
import LivestockAssetsManager from './pages/dashboard/admin/LivestockAssetsManager';

// --- IMPORTS PROPERTY FORM ---
import PropertyForm from './pages/dashboard/properties/PropertyForm';

// ✅ IMPORT LIVESTOCK MANAGEMENT
import LivestockManagement from './pages/dashboard/livestock/LivestockManagement';

// ✅ IMPORT AGRICULTURAL MANAGEMENT (PRODUITS)
import AgriculturalManagement from './pages/dashboard/agricultural/AgriculturalManagement';

// ✅ IMPORT MY AGRICULTURAL LANDS (TERRES)
import MyAgriculturalLands from './pages/dashboard/agricultural/MyAgriculturalLands';

// ✅ IMPORT PAGE PUBLIQUE DES PRODUITS AGRICOLES
import AgriculturalProducts from './pages/AgriculturalProducts';

// ✅ IMPORT PAGE DETAIL DES TERRES AGRICOLES
import LandDetailPage from './pages/LandDetailPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* --- ROUTES PUBLIQUES PRINCIPALES --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/real-estate" element={<RealEstatePage />} />
            <Route path="/real-estate/:id" element={<PropertyDetailsPage />} />
            
            <Route path="/experts" element={<ExpertHubPage />} />
            <Route path="/global-sourcing" element={<SourcingPage />} />
            <Route path="/book-appointment" element={<AppointmentPage />} />

            {/* --- ÉCOSYSTÈME AGRICULTURE --- */}
            <Route path="/agriculture" element={<AgriculturePage />} />
            <Route path="/agriculture/products" element={<AgriculturalProducts />} />
            <Route path="/agriculture/land/:id" element={<LandDetailPage />} />
            <Route path="/agriculture/marketplace" element={<MarketplacePage />} />
            <Route path="/agriculture/expertise" element={<ExpertisePage />} />
            
            {/* Section Livestock */}
            <Route path="/agriculture/livestock" element={<LivestockPage />} />
            <Route path="/agriculture/livestock/:category" element={<LivestockCategoryPage />} />
            <Route path="/agriculture/livestock/:category/:id" element={<ProjectDetailsPage />} />

            {/* --- CADRE LÉGAL & INSTITUTIONNEL --- */}
            <Route path="/agriculture/institutional-framework" element={<InstitutionalPage />} />
            <Route path="/agriculture/legal-safety" element={<LegalCompliancePage />} />

            {/* --- BLOG --- */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />

            {/* --- ROUTES DASHBOARD --- */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              
              {/* Admin - Gestion principale */}
              <Route path="admin" element={<AdminOverview />} />
              <Route path="admin/users" element={<UserManagement />} />
              <Route path="admin/inventory" element={<GlobalInventory />} />
              <Route path="admin/finances" element={<FinancialControl />} />
              
              {/* ✅ AJOUT : Admin - Gestion des biens immobiliers */}
              <Route path="admin/properties/new" element={<PropertyForm />} />
              <Route path="admin/properties/edit/:id" element={<PropertyForm />} />
              
              {/* Admin - Agriculture */}
              <Route path="admin/agriculture" element={<AgriculturalInventory />} />
              <Route path="admin/agricultural-products" element={<AgriculturalManagement />} />
              
              {/* Admin - Livestock */}
              <Route path="admin/livestock-categories" element={<LivestockCategoriesManager />} />
              <Route path="admin/livestock" element={<LivestockAssetsManager />} />

              {/* User - Section propriétaire (Real Estate) */}
              <Route path="profile" element={<UserProfile />} />
              <Route path="properties" element={<MyLands />} />
              <Route path="properties/new" element={<PropertyForm />} />
              <Route path="properties/edit/:id" element={<PropertyForm />} />
              <Route path="titles" element={<TitleDocuments />} />
              
              {/* User - Section Livestock Owner */}
              <Route path="livestock" element={<LivestockManagement />} />
              
              {/* User - Section Agriculture Owner - PRODUITS */}
              <Route path="agriculture" element={<AgriculturalManagement />} />
              
              {/* User - Section Agriculture Owner - TERRES */}
              <Route path="my-agricultural-lands" element={<MyAgriculturalLands />} />
              
              {/* User - Section investisseur */}
              <Route path="invest" element={<Portfolio />} />
              <Route path="yields" element={<YieldReports />} />
              
              {/* User - Section acheteur */}
              <Route path="purchases" element={<MyPurchases />} />
              <Route path="sourcing" element={<SourcingTracker />} />
            </Route>
          </Routes>
          
          <ChatAssistant />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;