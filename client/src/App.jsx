import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RealEstatePage from './pages/RealEstate';
import AgriculturePage from './pages/AgriculturePage'; 
import ExpertisePage from './pages/Expertise'; 
import InstitutionalPage from './pages/InstitutionalPage'; 
import MarketplacePage from './pages/MarketplacePage'; // Nouvel import

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Accueil */}
          <Route path="/" element={<Home />} />
          
          {/* Immobilier */}
          <Route path="/real-estate" element={<RealEstatePage />} />
          
          {/* Agriculture - Écosystème complet */}
          <Route path="/agriculture" element={<AgriculturePage />} />
          
          {/* Vente de produits (Le "Shop") */}
          <Route path="/agriculture/marketplace" element={<MarketplacePage />} />
          
          {/* Expertise technique */}
          <Route path="/agriculture/expertise" element={<ExpertisePage />} />

          {/* Cadre Institutionnel */}
          <Route path="/agriculture/institutional-framework" element={<InstitutionalPage />} />
          
          {/* Dashboard (à décommenter quand tu seras prêt) */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;