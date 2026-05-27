// frontend/src/pages/AgriculturePage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, TrendingUp, Shield, Globe, Zap, Leaf, DollarSign, MapPin, ArrowRight, Factory, Droplets, Sprout, Tractor, Package, Truck, Users, Award, Clock, Star, ChevronRight, Flame } from 'lucide-react';

// 🎯 HARDCODED AGRICULTURAL PRODUCTS (Raw Materials)
const agriculturalProducts = [
  { 
    id: 'cocoa', 
    name: 'Cocoa', 
    icon: '/images/propertycacao.jfif', 
    description: 'Premium bean export', 
    marketPrice: '$2,850/Ton',
    globalDemand: '+12% YoY',
    return: '18-22%',
    color: '#8B4513'
  },
  { 
    id: 'coffee', 
    name: 'Coffee', 
    icon: '/images/propertyananas.jfif', 
    description: 'High altitude volcanic', 
    marketPrice: '$4,200/Ton',
    globalDemand: '+8% YoY',
    return: '15-18%', 
    color: '#6F4E37'
  },
  { 
    id: 'palm', 
    name: 'Palm Oil', 
    icon: '/images/propertyhuile.jfif', 
    description: 'Industrial production', 
    marketPrice: '$1,150/Ton',
    globalDemand: '+15% YoY',
    return: '20-25%', 
    color: '#DAA520'
  },
  { 
    id: 'banana', 
    name: 'Banana', 
    icon: '/images/propertybananes.jfif', 
    description: 'Organic farming', 
    marketPrice: '$650/Ton',
    globalDemand: '+6% YoY',
    return: '16-20%', 
    color: '#FFD700'
  }
];

// 🏗️ HARDCODED INVESTMENT PROJECTS (Value-Added & Infrastructure)
const investmentProjects = [
  {
    id: "PROJ-001",
    title: "Cocoa Processing Unit - Mbalmayo",
    category: "Processing Plant",
    shortDesc: "Transform raw cocoa into premium chocolate products",
    description: "State-of-the-art cocoa processing facility. Convert raw beans into cocoa butter, powder, and finished chocolate. Direct export to EU/US markets.",
    image: "/images/dryingunit.jfif",
    investment: "$2,500,000",
    minTicket: "$50,000",
    expectedROI: "32-38%",
    timeline: "18 months",
    jobsCreated: "150+",
    status: "Funding Round A",
    matchScore: 96,
    impact: "High",
    partner: "European Chocolate Association",
    benefits: [
      "80% margin vs raw export",
      "EU tariff-free access",
      "Offtake agreements secured",
      "Training center included"
    ],
    crop: 'cocoa',
    location: "Center Region"
  },
  {
    id: "PROJ-002",
    title: "Palm Oil Mill Complex - Kribi",
    category: "Industrial Mill",
    shortDesc: "Integrated palm oil extraction & refining",
    description: "Complete palm oil mill with FFB processing capacity of 30T/hour. Includes refinery, fractionation plant, and biodiesel unit. Located near deep-sea port.",
    image: "/images/compactoil.jfif",
    investment: "$8,500,000",
    minTicket: "$100,000",
    expectedROI: "28-35%",
    timeline: "24 months",
    jobsCreated: "350+",
    status: "Pre-Construction",
    matchScore: 94,
    impact: "Very High",
    partner: "Malaysian Palm Oil Council",
    benefits: [
      "Port access for export",
      "Waste-to-energy unit",
      "RSPO certification ready",
      "Captive plantation 5000Ha"
    ],
    crop: 'palm',
    location: "South Region"
  },
  {
    id: "PROJ-003",
    title: "Smart Irrigation Infrastructure - North Region",
    category: "Water Management",
    shortDesc: "Solar-powered irrigation for 2000+ farmers",
    description: "Large-scale drip irrigation project covering 5000Ha. Solar-powered pumps, storage reservoirs, and distribution network. Transform arid land into year-round production zone.",
    image: "/images/globalirigationkit.jfif",
    investment: "$4,200,000",
    minTicket: "$25,000",
    expectedROI: "22-26%",
    timeline: "12 months",
    jobsCreated: "500+",
    status: "Early Stage",
    matchScore: 92,
    impact: "Very High",
    partner: "World Food Programme",
    benefits: [
      "Water 3 harvests/year",
      "Carbon credits eligible",
      "Smallholder inclusion",
      "Government subsidy 30%"
    ],
    crop: null,
    location: "North Region"
  },
  {
    id: "PROJ-004",
    title: "Cassava Industrial Park - Ebolowa",
    category: "Agro-Industrial Park",
    shortDesc: "Cassava-to-ethanol & starch production hub",
    description: "Integrated cassava processing industrial park. Produce industrial starch, bio-ethanol, and animal feed. 200MT/day capacity. Anchor tenant secured.",
    image: "/images/propertymaniocs.jfif",
    investment: "$6,800,000",
    minTicket: "$75,000",
    expectedROI: "30-40%",
    timeline: "20 months",
    jobsCreated: "400+",
    status: "Due Diligence",
    matchScore: 95,
    impact: "Very High",
    partner: "Brewing Industry Association",
    benefits: [
      "Offtake for starch secured",
      "Biofuel tax credits",
      "Outgrower scheme ready",
      "Export zone benefits"
    ],
    crop: 'cassava',
    location: "South Region"
  },
  {
    id: "PROJ-005",
    title: "Coffee Washing Station Network",
    category: "Processing Infrastructure",
    shortDesc: "Network of 15 coffee washing stations",
    description: "Build and operate 15 modern coffee washing stations across West Region. Produce fully washed Arabica for specialty markets. Direct farm-to-cup traceability.",
    image: "/images/apt-douala.jpg",
    investment: "$1,800,000",
    minTicket: "$15,000",
    expectedROI: "25-30%",
    timeline: "10 months",
    jobsCreated: "200+",
    status: "Funding Ready",
    matchScore: 98,
    impact: "High",
    partner: "Specialty Coffee Association",
    benefits: [
      "Premium prices +40%",
      "Direct trade model",
      "Farmer training program",
      "Blockchain traceability"
    ],
    crop: 'coffee',
    location: "West Region"
  },
  {
    id: "PROJ-006",
    title: "Onion Cold Storage & Drying Facility",
    category: "Post-Harvest",
    shortDesc: "Reduce post-harvest losses from 40% to 5%",
    description: "Modern cold storage and solar drying facility for onions. Reduce massive post-harvest losses. Enable year-round supply to markets across Central Africa.",
    image: "/images/propertyoignons.jfif",
    investment: "$1,200,000",
    minTicket: "$10,000",
    expectedROI: "20-24%",
    timeline: "8 months",
    jobsCreated: "80+",
    status: "Early Stage",
    matchScore: 90,
    impact: "High",
    partner: "IFAD",
    benefits: [
      "Reduce 40% waste",
      "Price stability",
      "Export to Chad/CAR",
      "Women-led operation"
    ],
    crop: 'onion',
    location: "Far North"
  }
];

// 🏞️ LAND OPPORTUNITIES (Raw Land Investment)
const landOpportunities = [
  { 
    id: "LAND-001", 
    title: "Mbalmayo Cocoa Estate", 
    location: "Center Region", 
    size: "25 Ha", 
    price: "$12,500", 
    matchScore: 98,
    soilQuality: 85,
    waterAccess: true,
    primaryCrop: 'cocoa',
    image: "/images/propertycacao.jfif",
    description: "Premium cocoa plantation with irrigation system. Yield: 1.2T/Ha/year",
    returnRate: "18-22%",
    minInvestment: "$5,000"
  },
  { 
    id: "LAND-002", 
    title: "Foumbot Volcanic Lands", 
    location: "West Region", 
    size: "10 Ha", 
    price: "$35,000", 
    matchScore: 92,
    soilQuality: 94,
    waterAccess: true,
    primaryCrop: 'coffee',
    image: "/images/propertyananas.jfif",
    description: "Rich volcanic soil for Arabica coffee. Bio certification in progress",
    returnRate: "15-18%",
    minInvestment: "$10,000"
  },
  { 
    id: "LAND-003", 
    title: "Kribi Palm Plantation", 
    location: "South Region", 
    size: "100 Ha", 
    price: "$150,000", 
    matchScore: 88,
    soilQuality: 75,
    waterAccess: false,
    primaryCrop: 'palm',
    image: "/images/palm-plantation.jpg",
    description: "Industrial palm oil plantation near Kribi port for export",
    returnRate: "20-25%",
    minInvestment: "$25,000"
  },
  { 
    id: "LAND-004", 
    title: "Nkongsamba Banana Valley", 
    location: "Littoral Region", 
    size: "15 Ha", 
    price: "$28,000", 
    matchScore: 95,
    soilQuality: 88,
    waterAccess: true,
    primaryCrop: 'banana',
    image: "/images/propertybananes.jfif",
    description: "Organic banana plantation. Year-round harvest. Fair Trade label",
    returnRate: "16-20%",
    minInvestment: "$8,000"
  }
];

const AgriculturePage = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [activeCrop, setActiveCrop] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(investmentProjects);
  const [filteredLands, setFilteredLands] = useState(landOpportunities);
  const [loading, setLoading] = useState(false);

  const handleMatchFound = (crop) => {
    setActiveCrop(crop);
    setLoading(true);
    
    setTimeout(() => {
      if (activeTab === 'projects') {
        const filtered = investmentProjects.filter(project => 
          !project.crop || project.crop === crop.id
        );
        setFilteredProjects(filtered);
      } else {
        const filtered = landOpportunities.filter(land => 
          land.primaryCrop === crop.id
        );
        setFilteredLands(filtered);
      }
      setLoading(false);
    }, 300);
  };

  const handleResetFilters = () => {
    setActiveCrop(null);
    setFilteredProjects(investmentProjects);
    setFilteredLands(landOpportunities);
  };

  useEffect(() => {
    setFilteredProjects(investmentProjects);
    setFilteredLands(landOpportunities);
  }, [activeTab]);

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-emerald-500 selection:text-black">
      <Navbar />

      {/* 🔥 EPIC HERO SECTION */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-black to-black z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/heroagri.png')] bg-cover bg-center opacity-20 z-0"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur rounded-full px-4 py-2 mb-6 border border-emerald-500/20">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Active Opportunities</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6">
                Cultivate Your<br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Agricultural Empire</span>
              </h1>
              <p className="text-gray-400 text-lg font-light leading-relaxed max-w-lg mb-8">
                Direct access to Cameroon's most lucrative agricultural investments. 
                From raw land to processing plants — we connect global capital with African growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/5 backdrop-blur rounded-2xl px-6 py-3 border border-white/10">
                  <p className="text-emerald-400 text-sm font-bold">Available Capital</p>
                  <p className="text-2xl font-black text-white">$24.8M+</p>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-2xl px-6 py-3 border border-white/10">
                  <p className="text-emerald-400 text-sm font-bold">Active Projects</p>
                  <p className="text-2xl font-black text-white">{investmentProjects.length}</p>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-2xl px-6 py-3 border border-white/10">
                  <p className="text-emerald-400 text-sm font-bold">Avg. ROI</p>
                  <p className="text-2xl font-black text-white">27.5%</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-emerald-900/30 to-black border border-emerald-500/20 rounded-3xl p-6 backdrop-blur">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">Featured Crop Prices</p>
                {agriculturalProducts.slice(0,4).map((product, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{product.marketPrice}</p>
                      <p className="text-emerald-400 text-xs">{product.globalDemand}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 MARKET INTELLIGENCE SECTION */}
      <section className="max-w-7xl mx-auto px-8 -mt-16 relative z-20">
        <div className="bg-gradient-to-r from-emerald-900/20 to-black border border-emerald-500/20 rounded-3xl p-8 backdrop-blur">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Crop Matching</h3>
              <p className="text-gray-400">Select a crop to see matching investment opportunities</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {agriculturalProducts.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => handleMatchFound(crop)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeCrop?.id === crop.id
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50'
                  }`}
                >
                  {crop.name}
                </button>
              ))}
              {activeCrop && (
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 INVESTMENT TABS: PROJECTS vs LAND */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex gap-4 mb-10 border-b border-white/10">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-6 font-bold text-lg transition-all relative ${
              activeTab === 'projects'
                ? 'text-emerald-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5" />
              Investment Projects
            </div>
            {activeTab === 'projects' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('land')}
            className={`pb-4 px-6 font-bold text-lg transition-all relative ${
              activeTab === 'land'
                ? 'text-emerald-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Land Opportunities
            </div>
            {activeTab === 'land' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"></div>
            )}
          </button>
        </div>

        {/* PROJECTS GRID */}
        {activeTab === 'projects' && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                <p className="text-gray-400">Matching opportunities...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                          {project.matchScore}% Match
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <span className="inline-block bg-emerald-500/20 backdrop-blur text-emerald-400 text-xs font-bold px-2 py-1 rounded">
                            {project.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">{project.shortDesc}</p>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-emerald-400 text-xs font-bold">Investment</p>
                            <p className="text-white font-bold text-lg">{project.investment}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-emerald-400 text-xs font-bold">Expected ROI</p>
                            <p className="text-white font-bold text-lg">{project.expectedROI}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-emerald-400 text-xs font-bold">Min. Ticket</p>
                            <p className="text-white text-sm">{project.minTicket}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-emerald-400 text-xs font-bold">Jobs Created</p>
                            <p className="text-white text-sm">{project.jobsCreated}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.benefits.slice(0,3).map((benefit, i) => (
                            <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                              ✓ {benefit}
                            </span>
                          ))}
                        </div>
                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                          View Project Details <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* LAND GRID */}
        {activeTab === 'land' && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                <p className="text-gray-400">Loading land opportunities...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredLands.map((land) => (
                  <div key={land.id} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img src={land.image} alt={land.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-4 right-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                          {land.matchScore}% Match
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-1">{land.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{land.location} • {land.size}</p>
                        <p className="text-gray-400 text-sm mb-4">{land.description}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <div>
                            <p className="text-emerald-400 text-xs font-bold">Investment</p>
                            <p className="text-white font-bold">{land.price}</p>
                            <p className="text-gray-500 text-xs">min: {land.minInvestment}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 text-xs font-bold">Expected Return</p>
                            <p className="text-white font-bold">{land.returnRate}</p>
                          </div>
                        </div>
                        <button className="w-full mt-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-emerald-500 hover:text-black transition-all">
                          View Land
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ⚡ CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-emerald-900/20 to-black border-t border-b border-emerald-500/20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Build Your <span className="text-emerald-400">Agricultural Portfolio</span>?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join 150+ international investors already generating 20%+ average returns in Cameroonian agriculture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
              Schedule Investor Call <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
              Download Prospectus
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgriculturePage;