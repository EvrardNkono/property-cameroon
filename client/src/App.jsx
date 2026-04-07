import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RealEstatePage from './pages/RealEstate';
import AgriculturePage from './pages/AgriculturePage'; 
import ExpertisePage from './pages/Expertise'; 
import InstitutionalPage from './pages/InstitutionalPage'; // Import de la page CAPEF

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Home />} />
          
          {/* Page de l'immobilier classique */}
          <Route path="/real-estate" element={<RealEstatePage />} />
          
          {/* Page de l'agriculture (Vue d'ensemble) */}
          <Route path="/agriculture" element={<AgriculturePage />} />
          
          {/* Page de l'expertise technique (Audit & Simulateur) */}
          <Route path="/agriculture/expertise" element={<ExpertisePage />} />

          {/* Page du cadre Institutionnel (CAPEF & Lois) */}
          <Route path="/agriculture/institutional-framework" element={<InstitutionalPage />} />
          
          {/* Dashboard et autres routes à venir */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;