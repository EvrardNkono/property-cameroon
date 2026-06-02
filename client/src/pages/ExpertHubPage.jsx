// frontend/src/pages/ExpertHubPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FileCheck, Scale, Compass, Sprout, BarChart3, 
  Truck, ArrowRight, ShieldAlert, CheckCircle2,
  Gavel, Home, Landmark, Leaf, TrendingUp, Package,
  Users, Briefcase, Globe, Award, Star, Shield, X,
  Phone, Mail, MessageSquare, Send, User, Link2
} from 'lucide-react';

const ExpertHubPage = () => {
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productLink: '',
    motivation: '',
    expertType: ''
  });

  // Récupérer la langue depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang') || localStorage.getItem('preferredLanguage') || 'fr';
    setCurrentLang(lang === 'en' ? 'en' : 'fr');
  }, []);

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Hero section
      heroBadge: "Hub d'Experts Certifiés",
      heroTitle: "Assistance & Expertise",
      heroDesc: "Un écosystème certifié de professionnels pour sécuriser vos acquisitions foncières et maximiser la rentabilité de vos projets agro-industriels au Cameroun.",
      
      // Stats
      statsCertified: "Experts Certifiés",
      statsFraudFree: "Transactions Sans Fraude",
      statsSupport: "Support Client",
      statsSatisfaction: "Satisfaction Client",
      
      // Compliance banner
      complianceText: "Zéro compromis sur la sécurité : Tous les experts listés sur notre plateforme sont inscrits auprès de leurs ordres professionnels respectifs au Cameroun et soumis à notre strict code d'éthique.",
      
      // Section titles
      ourNetwork: "Notre Réseau",
      certifiedProfessionals: "Professionnels Certifiés",
      
      // Trust badges
      trustedBy: "Approuvé par les investisseurs leaders",
      joinClients: "Rejoignez plus de 500+ clients satisfaits dans le monde",
      
      // Support banner
      needSupport: "Besoin d'un accompagnement personnalisé ?",
      supportDesc: "Nos chargés de comptes dédiés vous mettront en relation avec le pool d'experts adapté à l'échelle et aux exigences de votre projet.",
      bookConsultation: "Réserver une Consultation",
      
      // Modal
      requestSent: "Demande Envoyée !",
      modalDesc: "Votre demande de consultation a été soumise. Un expert vous contactera dans les 24 heures.",
      fullName: "Nom Complet *",
      email: "Email *",
      phone: "Téléphone *",
      productLink: "Lien du Produit/Bien",
      expertType: "Type d'Expert",
      motivation: "Motivation / Détails du Projet *",
      sendRequest: "Envoyer la Demande de Consultation",
      sending: "Envoi en cours...",
      
      // Modal placeholders
      namePlaceholder: "Jean Dupont",
      emailPlaceholder: "jean@example.com",
      phonePlaceholder: "+237 6XX XXX XXX",
      linkPlaceholder: "https://...",
      motivationPlaceholder: "Parlez-nous de votre projet, de l'aide dont vous avez besoin, et de vos exigences spécifiques..."
    },
    en: {
      // Hero section
      heroBadge: "Verified Expert Hub",
      heroTitle: "Assistance & Expertise",
      heroDesc: "A certified ecosystem of professionals to secure your land acquisitions and maximize the profitability of your agro-industrial projects in Cameroon.",
      
      // Stats
      statsCertified: "Certified Experts",
      statsFraudFree: "Fraud-Free Transactions",
      statsSupport: "Client Support",
      statsSatisfaction: "Client Satisfaction",
      
      // Compliance banner
      complianceText: "Zero compromise on security: All experts listed on our platform are registered with their respective professional orders in Cameroon and subject to our strict code of ethics.",
      
      // Section titles
      ourNetwork: "Our Network",
      certifiedProfessionals: "Certified Professionals",
      
      // Trust badges
      trustedBy: "Trusted by leading investors",
      joinClients: "Join over 500+ satisfied clients worldwide",
      
      // Support banner
      needSupport: "Need personalized support?",
      supportDesc: "Our dedicated account managers will connect you with the right expert pool for your project's scale and requirements.",
      bookConsultation: "Book a Consultation",
      
      // Modal
      requestSent: "Request Sent!",
      modalDesc: "Your consultation request has been submitted. An expert will contact you within 24 hours.",
      fullName: "Full Name *",
      email: "Email *",
      phone: "Phone Number *",
      productLink: "Product/Property Link",
      expertType: "Expert Type",
      motivation: "Motivation / Project Details *",
      sendRequest: "Send Consultation Request",
      sending: "Sending...",
      
      // Modal placeholders
      namePlaceholder: "John Doe",
      emailPlaceholder: "john@example.com",
      phonePlaceholder: "+237 6XX XXX XXX",
      linkPlaceholder: "https://...",
      motivationPlaceholder: "Tell us about your project, what you need help with, and any specific requirements..."
    }
  };

  const texts = t[currentLang] || t.fr;

  // Experts data with translations
  const experts = [
    {
      id: "mindcaf",
      icon: <Landmark className="text-pc-gold" size={36} />,
      badge: currentLang === 'fr' ? "Sécurité Foncière" : "Land Security",
      title: currentLang === 'fr' ? "Services de Vérification MINDCAF" : "MINDCAF Verification Services",
      subtitle: currentLang === 'fr' ? "Authentification des titres fonciers" : "Land title & deed authentication",
      desc: currentLang === 'fr' 
        ? "Accès direct au Ministère des Domaines, du Cadastre et des Affaires Foncières pour vérifier l'authenticité des terrains. Un atout majeur pour une prévention absolue de la fraude."
        : "Direct access to the Ministry of Domains, Cadastre and Land Affairs to verify land authenticity. A major asset for absolute fraud prevention.",
      cta: currentLang === 'fr' ? "Demander une Vérification" : "Request Verification",
      features: currentLang === 'fr' 
        ? ["Vérification titres", "Prévention fraude", "Certification officielle"]
        : ["Title verification", "Fraud prevention", "Official certification"],
      longDesc: currentLang === 'fr'
        ? "Nos experts certifiés MINDCAF fournissent des services complets de vérification des titres fonciers, garantissant que vos documents fonciers sont authentiques et juridiquement valides."
        : "Our MINDCAF-certified experts provide comprehensive land title verification services, ensuring your property documents are authentic and legally binding.",
      bgGradient: "from-amber-900/20 to-transparent"
    },
    {
      id: "legal",
      icon: <Gavel className="text-pc-gold" size={36} />,
      badge: currentLang === 'fr' ? "Droit Immobilier" : "Real Estate Law",
      title: currentLang === 'fr' ? "Conseil Juridique & Transactions" : "Legal Counsel & Transactions",
      subtitle: currentLang === 'fr' ? "Spécialiste en droit immobilier" : "Real estate law specialist",
      desc: currentLang === 'fr'
        ? "Rédaction sécurisée de contrats de vente, gestion de comptes séquestres et accompagnement personnalisé à travers le cadre juridique complexe du Cameroun."
        : "Secure sales contract drafting, escrow account management, and customized support through Cameroon's complex legal framework.",
      cta: currentLang === 'fr' ? "Demander une Aide Juridique" : "Request Legal Help",
      features: currentLang === 'fr'
        ? ["Rédaction contrats", "Services séquestres", "Conformité légale"]
        : ["Contract drafting", "Escrow services", "Legal compliance"],
      longDesc: currentLang === 'fr'
        ? "Nos experts juridiques se spécialisent dans les réglementations immobilières du Cameroun, garantissant que vos transactions sont entièrement conformes et légalement protégées."
        : "Our legal experts specialize in Cameroon's real estate regulations, ensuring your transactions are fully compliant and legally protected.",
      bgGradient: "from-blue-900/20 to-transparent"
    },
    {
      id: "surveyors",
      icon: <Compass className="text-pc-gold" size={36} />,
      badge: currentLang === 'fr' ? "Géomètres" : "Surveying",
      title: currentLang === 'fr' ? "Géomètres Experts Certifiés" : "Certified Land Surveyors",
      subtitle: currentLang === 'fr' ? "Bornage & délimitation technique" : "Boundary marking & technical delimitation",
      desc: currentLang === 'fr'
        ? "Opérations précises de bornage, cartographie topographique détaillée et vérification rigoureuse de la conformité terrain-document."
        : "Precise boundary operations, detailed topographic mapping, and rigorous verification of land-to-document consistency.",
      cta: currentLang === 'fr' ? "Engager un Géomètre" : "Hire a Surveyor",
      features: currentLang === 'fr'
        ? ["Bornage", "Cartographie topographique", "Vérification site"]
        : ["Boundary marking", "Topographic mapping", "Site verification"],
      longDesc: currentLang === 'fr'
        ? "Les géomètres certifiés fournissent des relevés fonciers précis, des bornages et des cartes topographiques essentiels pour les transactions immobilières."
        : "Certified geometers provide accurate land surveys, boundary markings, and topographic maps essential for property transactions.",
      bgGradient: "from-emerald-900/20 to-transparent"
    },
    {
      id: "agribusiness",
      icon: <Leaf className="text-pc-gold" size={36} />,
      badge: currentLang === 'fr' ? "Agronomie" : "Agronomy",
      title: currentLang === 'fr' ? "Ingénieurs Agro-industrie & Pédologie" : "Agro-industry & Pedology Engineers",
      subtitle: currentLang === 'fr' ? "Analyse des sols & évaluation viabilité" : "Soil analysis & viability assessment",
      desc: currentLang === 'fr'
        ? "Essentiel pour les investisseurs agricoles. Évaluation approfondie de la qualité des sols, analyse de viabilité des cultures et études de faisabilité complètes."
        : "Essential for agricultural investors. In-depth soil quality evaluation, crop viability analysis, and comprehensive project feasibility studies.",
      cta: currentLang === 'fr' ? "Consulter un Ingénieur" : "Consult an Engineer",
      features: currentLang === 'fr'
        ? ["Analyse sols", "Viabilité cultures", "Études faisabilité"]
        : ["Soil analysis", "Crop viability", "Feasibility studies"],
      longDesc: currentLang === 'fr'
        ? "Nos experts en agronomie évaluent la qualité des sols, recommandent les cultures optimales et fournissent des études de faisabilité détaillées pour les projets agricoles."
        : "Our agronomy experts evaluate soil quality, recommend optimal crops, and provide detailed feasibility studies for agricultural projects.",
      bgGradient: "from-green-900/20 to-transparent"
    },
    {
      id: "analysts",
      icon: <TrendingUp className="text-pc-gold" size={36} />,
      badge: currentLang === 'fr' ? "Finance" : "Finance",
      title: currentLang === 'fr' ? "Analystes Financiers & Économistes" : "Financial Analysts & Economists",
      subtitle: currentLang === 'fr' ? "Évaluation rentabilité investissement" : "Investment profitability assessment",
      desc: currentLang === 'fr'
        ? "Accompagnement des investisseurs pour calculer le ROI, analyser la demande du marché et optimiser l'allocation du capital."
        : "Support for investors to calculate ROI, analyze market demand, and optimize capital allocation across investment opportunities.",
      cta: currentLang === 'fr' ? "Parler à un Analyste" : "Talk to an Analyst",
      features: currentLang === 'fr'
        ? ["Calcul ROI", "Analyse marché", "Optimisation capital"]
        : ["ROI calculation", "Market analysis", "Capital optimization"],
      longDesc: currentLang === 'fr'
        ? "Les experts financiers vous aident à maximiser les rendements avec des calculs de ROI détaillés, une analyse des tendances du marché et des stratégies d'investissement."
        : "Financial experts help you maximize returns with detailed ROI calculations, market trend analysis, and investment strategies.",
      bgGradient: "from-purple-900/20 to-transparent"
    },
    {
      id: "china-sourcing",
      icon: <Package className="text-pc-gold" size={36} />,
      badge: currentLang === 'fr' ? "Logistique Internationale" : "International Logistics",
      title: currentLang === 'fr' ? "Chaîne d'Approvisionnement & Sourcing Chine" : "Supply Chain & China Sourcing",
      subtitle: currentLang === 'fr' ? "Infrastructure & opérations industrielles" : "Infrastructure & industrial operations",
      desc: currentLang === 'fr'
        ? "Gestion de l'approvisionnement en intrants de haute qualité, machines et emballages directement depuis des usines partenaires en Chine."
        : "Management of high-quality input supply, machinery, and packaging directly from partner factories in China.",
      cta: currentLang === 'fr' ? "Trouver un Spécialiste" : "Find a Specialist",
      features: currentLang === 'fr'
        ? ["Chaîne approvisionnement", "Sourcing usine", "Achat équipement"]
        : ["Supply chain", "Factory sourcing", "Equipment procurement"],
      longDesc: currentLang === 'fr'
        ? "Nos spécialistes en approvisionnement vous connectent avec des fournisseurs de confiance en Chine pour les intrants agricoles, les machines et les solutions d'emballage."
        : "Our sourcing specialists connect you with trusted suppliers in China for agricultural inputs, machinery, and packaging solutions.",
      bgGradient: "from-cyan-900/20 to-transparent"
    }
  ];

  const stats = [
    { value: "50+", label: texts.statsCertified, icon: <Users size={20} /> },
    { value: "100%", label: texts.statsFraudFree, icon: <Shield size={20} /> },
    { value: "24/7", label: texts.statsSupport, icon: <Globe size={20} /> },
    { value: "98%", label: texts.statsSatisfaction, icon: <Star size={20} /> }
  ];

  const openModal = (expert) => {
    setSelectedExpert(expert);
    setFormData({
      name: '',
      email: '',
      phone: '',
      productLink: '',
      motivation: '',
      expertType: expert.title
    });
    setIsModalOpen(true);
    setSubmitSuccess(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpert(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      productLink: '',
      motivation: '',
      expertType: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    }, 1500);
  };

  return (
    <main className="bg-white pt-20">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/45-degree-fabric-light.png')] opacity-5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-pc-gold/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pc-green/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <span className="h-[1px] w-12 bg-pc-gold"></span>
              <span className="text-pc-gold font-black text-xs uppercase tracking-[0.4em]">{texts.heroBadge}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tighter mb-10 leading-[0.9] animate-in fade-in slide-in-from-left-8 duration-1000">
              Professional <br /> 
              <span className="italic font-light bg-gradient-to-r from-pc-gold to-pc-green bg-clip-text text-transparent">{texts.heroTitle}</span>
            </h1>
            <p className="text-slate-300 text-xl font-light leading-relaxed max-w-2xl border-l-4 border-pc-gold pl-8 animate-in fade-in slide-in-from-left-12 duration-1000">
              {texts.heroDesc}
            </p>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-white py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-pc-green/10 to-pc-gold/10 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(stat.icon, { className: "text-pc-gold" })}
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLIANCE WARNING BANNER */}
      <section className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-b border-amber-200 py-4">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-amber-900">
          <ShieldAlert className="text-amber-600 shrink-0" size={24} />
          <p className="text-sm font-light text-center">
            <strong>{currentLang === 'fr' ? "Zéro compromis sur la sécurité :" : "Zero compromise on security:"}</strong> {texts.complianceText}
          </p>
        </div>
      </section>

      {/* EXPERTS GRID SECTION */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] font-black uppercase tracking-[0.4em]">{texts.ourNetwork}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mt-3">{texts.certifiedProfessionals}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pc-gold to-pc-green mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert) => (
              <div 
                key={expert.id} 
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer"
                onClick={() => openModal(expert)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${expert.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-pc-gold/30 rounded-3xl transition-all duration-500" />
                
                <div className="relative p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-gradient-to-br from-slate-100 to-white rounded-2xl shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                      {expert.icon}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest bg-pc-green/10 text-pc-green px-3 py-1.5 rounded-full border border-pc-green/20">
                      {expert.badge}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-serif text-xl text-slate-900 mb-2 leading-tight group-hover:text-pc-gold transition-colors duration-300">
                      {expert.title}
                    </h3>
                    <div className="w-12 h-0.5 bg-pc-gold/50 group-hover:w-24 transition-all duration-500"></div>
                    <p className="text-pc-gold font-medium text-xs uppercase tracking-wider mt-3">
                      {expert.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {expert.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {expert.features.map((feature, idx) => (
                      <span key={idx} className="text-[7px] font-black uppercase text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-pc-green/10 group-hover:text-pc-green transition-all duration-300">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <button className="w-full inline-flex items-center justify-between bg-slate-900 text-white hover:bg-pc-gold px-6 py-3.5 rounded-xl font-bold uppercase text-[9px] tracking-wider transition-all duration-300 group-hover:shadow-lg">
                      {expert.cta}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-gradient-to-r from-pc-green/5 via-pc-gold/5 to-transparent rounded-3xl p-10 border border-pc-green/10 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-pc-gold/20 to-pc-green/20 rounded-2xl flex items-center justify-center">
                  <Award size={40} className="text-pc-gold" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{texts.trustedBy}</h4>
                  <p className="text-sm text-slate-500">{texts.joinClients}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Star size={18} className="text-pc-gold fill-pc-gold" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT FOOTER BANNER */}
      <section className="bg-gradient-to-r from-pc-green to-emerald-800 py-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="text-white max-w-2xl text-center lg:text-left">
            <h4 className="text-3xl md:text-4xl font-serif uppercase italic mb-3">{texts.needSupport}</h4>
            <p className="font-light opacity-90 text-sm uppercase tracking-widest leading-relaxed">
              {texts.supportDesc}
            </p>
          </div>
          <button className="bg-white text-pc-green hover:bg-pc-gold hover:text-white px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-105">
            {texts.bookConsultation}
          </button>
        </div>
      </section>

      {/* MODAL - Expert Consultation Form */}
      {isModalOpen && selectedExpert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedExpert.bgGradient} from-slate-900 to-slate-800 p-6 rounded-t-3xl border-b border-pc-gold/20`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    {selectedExpert.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-white">{selectedExpert.title}</h3>
                    <p className="text-pc-gold text-xs uppercase tracking-wider">{selectedExpert.subtitle}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h4 className="text-2xl font-serif text-slate-900 mb-2">{texts.requestSent}</h4>
                  <p className="text-slate-500">{texts.modalDesc}</p>
                </div>
              ) : (
                <>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {selectedExpert.longDesc}
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{texts.fullName}</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-pc-gold transition-all"
                            placeholder={texts.namePlaceholder}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{texts.email}</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-pc-gold transition-all"
                            placeholder={texts.emailPlaceholder}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{texts.phone}</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-pc-gold transition-all"
                            placeholder={texts.phonePlaceholder}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{texts.productLink}</label>
                        <div className="relative">
                          <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="url"
                            name="productLink"
                            value={formData.productLink}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-pc-gold transition-all"
                            placeholder={texts.linkPlaceholder}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{texts.expertType}</label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="expertType"
                          value={formData.expertType}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-pc-gold transition-all bg-slate-100 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{texts.motivation}</label>
                      <div className="relative">
                        <MessageSquare size={16} className="absolute left-3 top-4 text-slate-400" />
                        <textarea
                          name="motivation"
                          value={formData.motivation}
                          onChange={handleInputChange}
                          required
                          rows="4"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-pc-gold transition-all resize-none"
                          placeholder={texts.motivationPlaceholder}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:from-pc-gold hover:to-pc-green transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          {texts.sendRequest}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default ExpertHubPage;