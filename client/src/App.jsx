import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORTS DES PAGES PUBLIQUES ---
import Home from './pages/Home';
import RealEstatePage from './pages/RealEstate';
import PropertyDetailsPage from './pages/PropertyDetailsPage'; // AJOUTÉ ICI
import AgriculturePage from './pages/AgriculturePage'; 
import ExpertisePage from './pages/Expertise'; 
import MarketplacePage from './pages/MarketplacePage';
import AppointmentPage from './pages/Appointment';
import SourcingPage from './pages/Sourcing'; 

// --- PAGES INSTITUTIONNELLES (DISTINCTES) ---
// 1. L'ancienne page centrée sur le profil de la CAPEF
import InstitutionalPage from './pages/InstitutionalProfil'; 
// 2. La nouvelle page "Massive" sur les garanties et la légalité
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
import LivestockCategoryPage from './pages/LivestockCategoryPage'; // NOUVEL IMPORT AJOUTÉ

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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- ROUTES PUBLIQUES PRINCIPALES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/real-estate" element={<RealEstatePage />} />
          
          {/* ROUTE DÉTAILS AJOUTÉE ICI */}
          <Route path="/real-estate/:id" element={<PropertyDetailsPage />} />
          
          <Route path="/global-sourcing" element={<SourcingPage />} />
          <Route path="/book-appointment" element={<AppointmentPage />} />

          {/* --- ÉCOSYSTÈME AGRICULTURE --- */}
          <Route path="/agriculture" element={<AgriculturePage />} />
          <Route path="/agriculture/marketplace" element={<MarketplacePage />} />
          <Route path="/agriculture/expertise" element={<ExpertisePage />} />
          <Route path="/agriculture/livestock" element={<LivestockPage />} />
          
          {/* NOUVELLE ROUTE DYNAMIQUE POUR LES CATÉGORIES */}
          <Route path="/agriculture/livestock/:category" element={<LivestockCategoryPage />} />
          
          {/* ROUTES EXISTANTES CONSERVÉES */}
          <Route path="/agriculture/livestock/aquaculture" element={<div>Page Aquaculture en cours...</div>} />

          {/* SEPARATION DES DEUX PAGES INSTITUTIONNELLES */}
          {/* A. Le profil officiel CAPEF */}
          <Route path="/agriculture/institutional-framework" element={<InstitutionalPage />} />
          
          {/* B. La nouvelle page sur la sécurité juridique et conformité */}
          <Route path="/agriculture/legal-safety" element={<LegalCompliancePage />} />

          {/* --- BLOG --- */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />

          {/* --- ROUTES DASHBOARD (PRIVÉES / NESTED) --- */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            
            {/* Sous-section Admin */}
            <Route path="admin" element={<AdminOverview />} />
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/inventory" element={<GlobalInventory />} />
            <Route path="admin/finances" element={<FinancialControl />} />

            {/* Sous-section Utilisateur */}
            <Route path="profile" element={<UserProfile />} />
            <Route path="properties" element={<MyLands />} />
            <Route path="titles" element={<TitleDocuments />} />
            <Route path="invest" element={<Portfolio />} />
            <Route path="yields" element={<YieldReports />} />
            <Route path="purchases" element={<MyPurchases />} />
            <Route path="sourcing" element={<SourcingTracker />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;