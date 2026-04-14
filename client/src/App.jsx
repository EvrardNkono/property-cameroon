import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RealEstatePage from './pages/RealEstate';
import AgriculturePage from './pages/AgriculturePage'; 
import ExpertisePage from './pages/Expertise'; 
import InstitutionalPage from './pages/InstitutionalProfil'; 
import MarketplacePage from './pages/MarketplacePage';
import AppointmentPage from './pages/Appointment';
import SourcingPage from './pages/Sourcing'; 

// --- NOUVEL IMPORT LIVESTOCK ---
import LivestockPage from './pages/LivestockIntroduction'; // La page Vert & Or qu'on a fait

// --- IMPORTS DASHBOARD (UTILISATEURS) ---
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
          {/* --- ROUTES PUBLIQUES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/real-estate" element={<RealEstatePage />} />
          <Route path="/agriculture" element={<AgriculturePage />} />
          
          {/* NOUVELLES ROUTES LIVESTOCK */}
          <Route path="/agriculture/livestock" element={<LivestockPage />} />
          {/* On prépare déjà la route pour les poissons/aquaculture */}
          <Route path="/agriculture/livestock/aquaculture" element={<div>Page Aquaculture en cours...</div>} />

          <Route path="/agriculture/marketplace" element={<MarketplacePage />} />
          <Route path="/agriculture/expertise" element={<ExpertisePage />} />
          <Route path="/agriculture/institutional-framework" element={<InstitutionalPage />} />
          <Route path="/global-sourcing" element={<SourcingPage />} />
          <Route path="/book-appointment" element={<AppointmentPage />} />

          {/* --- ROUTES DASHBOARD (PRIVÉES/ADAPTATIVES) --- */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            
            <Route path="admin" element={<AdminOverview />} />
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/inventory" element={<GlobalInventory />} />
            <Route path="admin/finances" element={<FinancialControl />} />

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