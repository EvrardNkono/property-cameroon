import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORTS DES PAGES PUBLIQUES ---
import Home from './pages/Home';
import RealEstatePage from './pages/RealEstate';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AgriculturePage from './pages/AgriculturePage'; 
import ExpertisePage from './pages/Expertise'; 
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
import ProjectDetailsPage from './pages/ProjectDetailsPage'; // Import de la nouvelle page de détails

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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- ROUTES PUBLIQUES PRINCIPALES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/real-estate" element={<RealEstatePage />} />
          <Route path="/real-estate/:id" element={<PropertyDetailsPage />} />
          
          <Route path="/global-sourcing" element={<SourcingPage />} />
          <Route path="/book-appointment" element={<AppointmentPage />} />

          {/* --- ÉCOSYSTÈME AGRICULTURE --- */}
          <Route path="/agriculture" element={<AgriculturePage />} />
          <Route path="/agriculture/marketplace" element={<MarketplacePage />} />
          <Route path="/agriculture/expertise" element={<ExpertisePage />} />
          
          {/* Section Livestock */}
          <Route path="/agriculture/livestock" element={<LivestockPage />} />
          
          {/* 
              ROUTE DYNAMIQUE PAR CATÉGORIE : Gère aquaculture, poultry, cattle, pigs.
          */}
          <Route path="/agriculture/livestock/:category" element={<LivestockCategoryPage />} />

          {/* 
              NOUVELLE ROUTE DÉTAILS PROJET : Accès direct à une unité de production spécifique
          */}
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
            
            {/* Admin */}
            <Route path="admin" element={<AdminOverview />} />
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/inventory" element={<GlobalInventory />} />
            <Route path="admin/finances" element={<FinancialControl />} />

            {/* User */}
            <Route path="profile" element={<UserProfile />} />
            <Route path="properties" element={<MyLands />} />
            <Route path="titles" element={<TitleDocuments />} />
            <Route path="invest" element={<Portfolio />} />
            <Route path="yields" element={<YieldReports />} />
            <Route path="purchases" element={<MyPurchases />} />
            <Route path="sourcing" element={<SourcingTracker />} />
          </Route>
        </Routes>
        
        <ChatAssistant />
      </div>
    </Router>
  );
}

export default App;