import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Globe, CheckCircle,
  ArrowRight, Landmark,
  Warehouse, Scale, Handshake,
  TrendingUp, TrendingDown,
  Coins, Gavel,
  X, UserPlus, FileText, Phone, Mail, MapPin,
  Leaf, Fish, Beef, Trees,
  Award, Briefcase, GraduationCap, Mic2
} from 'lucide-react'

// Hook pour récupérer la langue actuelle
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  
  return lang;
};

const G  = '#1a4731';
const GL = '#2d6e4e';
const GO = '#c8a84b';
const GB = '#f0f7f2';

const IMGS = {
  hero:    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1800&q=80",
  agri1:   "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80",
  agri2:   "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?w=900&q=80",
  agri3:   "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&q=80",
  fishing: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80",
  forest:  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80",
  meeting: "https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?w=900&q=80",
};

const CAPEF_SECTIONS = [
  { titleKey: "agriculture", contentKey: "agricultureContent" },
  { titleKey: "fisheries", contentKey: "fisheriesContent" },
  { titleKey: "livestock", contentKey: "livestockContent" },
  { titleKey: "forestry", contentKey: "forestryContent" }
];

const InstitutionalProfil = () => {
  const currentLang = useCurrentLang();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', city:'', email:'', sector:'' });
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Hero
      badge: "Établissement Public Professionnel • Fondé en 1921",
      title: "CAPEF",
      subtitle: "Chambre d'Agriculture, des Pêches, de l'Élevage et des Forêts du Cameroun",
      description: "Le pilier institutionnel qui structure, protège et propulse les secteurs Agropastoral, des Pêches et Forestier du Cameroun vers les standards mondiaux.",
      joinNow: "Rejoindre CAPEF Maintenant",
      contactUs: "Nous Contacter",
      
      // Bottom nav sectors
      agriculture: "Agriculture",
      fisheries: "Pêches & Aquaculture",
      livestock: "Élevage",
      forestry: "Forêts",
      
      // Mission Section
      institutionalMission: "Mission Institutionnelle",
      missionTitle: "L'interface légale entre",
      missionTitleEnd: "l'État et le Producteur.",
      missionDesc: "Sous la tutelle technique du Ministère de l'Agriculture et du Développement Rural, le CAPEF est votre bouclier légal et technique. Ce n'est pas un simple partenaire — c'est votre représentant institutionnel reconnu par l'État camerounais.",
      consultativeMission: "Mission Consultative",
      consultativeDesc: "Conseiller obligatoire du gouvernement sur les politiques rurales et agricoles.",
      sectorRegulation: "Régulation Sectorielle",
      sectorRegulationDesc: "Structuration des interprofessions pour une juste répartition des revenus.",
      economicDiplomacy: "Diplomatie Économique",
      economicDiplomacyDesc: "Représentation du Cameroun dans les chambres internationales.",
      memberProtection: "Protection des Membres",
      memberProtectionDesc: "Assistance juridique, foncière et contractuelle pour tous les membres.",
      joinCapef: "Rejoindre CAPEF →",
      learnMore: "En savoir plus",
      
      // Key Figures
      institutionalWeight: "Poids Institutionnel",
      capefByNumbers: "CAPEF en chiffres",
      representedSections: "Sections Représentées",
      agriFisheriesLivestockForestry: "Agri · Pêches · Élevage · Forêts",
      regionsCovered: "Régions Couvertes",
      fullNationalPresence: "Présence nationale complète",
      yearFounded: "Année de Création",
      overCentury: "Plus d'un siècle d'institution",
      stateLegitimacy: "Légitimité d'État",
      ministryOversight: "Tutelle du Ministère de l'Agriculture",
      becomeOfficialMember: "Devenir Membre Officiel du CAPEF →",
      
      // Quote Banner
      quoteText: "Structurer, protéger et développer le monde rural camerounais — depuis 1921.",
      capefFullName: "CAPEF — Chambre d'Agriculture, des Pêches, de l'Élevage et des Forêts du Cameroun",
      joinNowArrow: "Rejoindre maintenant →",
      bookAppointment: "Prendre rendez-vous",
      
      // Youth Excellence Program
      exclusiveProgram: "Programme Exclusif",
      advantageForYoung: "L'Avantage pour",
      youngPioneers: "JEUNES",
      pioneersEnd: "Pionniers.",
      programDesc: "Accélérer la transition vers une agro-industrie compétitive et prête à l'export.",
      performanceCatalyst: "Un Catalyseur de Performance",
      performanceDesc: "Le CAPEF offre un accès privilégié aux JEUNES agri-entrepreneurs à travers un écosystème conçu pour éliminer les barrières structurelles. En adhérant, les leaders JEUNES bénéficient d'une réduction de 50% des frais d'adhésion et de certification, ainsi que d'une exonération totale des frais de traitement des dossiers d'investissement.",
      registrationFees: "Frais d'adhésion pour",
      youngFounders: "JEUNES Fondateurs",
      landAndProjects: "Terrains & Projets",
      landDesc: "Nous accompagnons les JEUNES producteurs dans la maturation de leurs projets et facilitons l'accès prioritaire à l'acquisition de terres agricoles sécurisées.",
      institutionalGuarantee: "Garantie Institutionnelle",
      guaranteeDesc: "Le CAPEF se porte garant auprès des banques et fonds internationaux pour aider les JEUNES entrepreneurs à obtenir le capital nécessaire à leur expansion.",
      skillsAndInfluence: "Compétences & Influence",
      skillsDesc: "Nous offrons une formation spécialisée en gestion technique et marketing pour les JEUNES agri-entrepreneurs, combinée à un plaidoyer direct auprès du gouvernement et des ONG internationales pour défendre vos intérêts.",
      readyToTransform: "Prêt à transformer le secteur ?",
      activateYoungLicense: "Activer ma Licence",
      youth: "JEUNES",
      
      // FAQ Section
      faqTitle: "CAPEF × Questions Fréquentes",
      faq1_q: "Pourquoi l'adhésion au CAPEF est-elle essentielle pour les exportateurs ?",
      faq1_a: "En tant qu'institution d'État, la Chambre certifie l'origine professionnelle et la qualité de vos produits. Sans son aval, il est extrêmement difficile de répondre aux normes de certification strictes requises pour les marchés internationaux comme l'Union européenne.",
      faq2_q: "Comment le CAPEF aide-t-il concrètement les jeunes qui souhaitent investir ?",
      faq2_a: "La Chambre vous assiste dans la maturation de vos projets d'investissement. Si vous recherchez un espace agricole, elle facilite le processus d'acquisition de terres et vous aide à constituer des dossiers solides pour obtenir le financement nécessaire à votre entreprise.",
      faq3_q: "Quelles compétences spécifiques puis-je acquérir auprès de la Chambre ?",
      faq3_a: "Pour moderniser le secteur agricole camerounais, le CAPEF propose des formations professionnelles axées sur trois piliers : les compétences techniques pour la production, l'expertise managériale pour la gestion d'exploitation et les stratégies marketing pour mieux positionner vos produits.",
      faq4_q: "Quel est le rôle de la Chambre en tant qu'« Organe Consultatif » ?",
      faq4_a: "Le CAPEF agit comme un pont entre les producteurs et les décideurs. Il recueille les défis concrets des membres des secteurs agricole, de l'élevage, des pêches et forestier et les soumet directement au gouvernement, aux organisations internationales et aux ONG.",
      faq5_q: "Le CAPEF peut-il m'aider à trouver de nouveaux marchés ou clients ?",
      faq5_a: "Oui, l'une de ses missions principales est la promotion économique. La Chambre aide les producteurs à améliorer leur production et promeut leurs produits tant au Cameroun qu'à l'international pour accroître la visibilité et les ventes.",
      
      // Palm Connect Section
      strategicGateway: "Une passerelle stratégique pour les jeunes agri-entrepreneurs",
      gatewayDesc1: "Le CAPEF est une institution d'État conçue pour défendre vos intérêts. Il sert de pont essentiel, transmettant les défis rencontrés par les jeunes producteurs directement au gouvernement, aux organisations internationales et aux ONG. Adhérer, c'est faire entendre votre voix au plus haut niveau.",
      gatewayDesc2: "Accélérez votre croissance grâce à des formations professionnelles techniques, managériales et marketing visant à moderniser l'industrie. Bénéficiez d'un accompagnement spécialisé pour sécuriser des terres, maturer des projets d'investissement et accéder au financement nécessaire pour développer votre production.",
      registerWithCapef: "S'inscrire au CAPEF",
      consultExpert: "Consulter un expert",
      
      // Final CTA
      joinElite: "Rejoignez l'élite agricole camerounaise",
      becomeCertified: "Devenez un",
      certifiedAgroEntrepreneur: "Agro-Entrepreneur Certifié",
      withCapef: "avec le CAPEF.",
      finalDesc: "Rejoindre le CAPEF via Palm Connect signifie intégrer la plus grande plateforme d'opportunités rurales du Cameroun. La première consultation est gratuite.",
      startMembership: "Commencer mon adhésion officielle",
      speakToAdvisor: "Parler à un conseiller",
      
      // Modal
      officialMembership: "Adhésion Officielle",
      becomeCapefMember: "Devenir membre du CAPEF",
      firstName: "Prénom *",
      lastName: "Nom *",
      phoneNumber: "Numéro de téléphone *",
      city: "Ville *",
      email: "Email",
      sectorActivity: "Secteur d'activité *",
      select: "— Sélectionner —",
      agricultureOption: "Agriculture",
      fisheriesOption: "Pêches & Aquaculture",
      livestockOption: "Élevage",
      forestryOption: "Forêts & Bois",
      agriFoodOption: "Agro-Alimentaire",
      submitApplication: "Soumettre ma demande d'adhésion",
      modalFooter: "Notre équipe vous contactera dans les 48 heures pour finaliser votre dossier.",
      
      // Buttons
      joinCapefNow: "Rejoindre CAPEF Maintenant",
      contactUsBtn: "Nous Contacter",
      
      // Sector content
      agricultureContent: "Encadrement des filières cacao, café, coton, et cultures vivrières pour garantir la sécurité alimentaire.",
      fisheriesContent: "Modernisation des pirogues, gestion des zones de pêche et promotion de la pisciculture intensive.",
      livestockContent: "Amélioration des races bovines, aviculture moderne et contrôle sanitaire des produits animaux.",
      forestryContent: "Gestion durable des ressources ligneuses et promotion de la transformation locale du bois."
    },
    en: {
      // Hero
      badge: "Professional Public Establishment • Founded in 1921",
      title: "CAPEF",
      subtitle: "Chamber of Agriculture, Fisheries, Livestock & Forestry of Cameroon",
      description: "The institutional pillar that structures, protects, and propels Cameroon's Agropastoral, Fisheries, and Forestry sectors toward global standards.",
      joinNow: "Join CAPEF Now",
      contactUs: "Contact Us",
      
      // Bottom nav sectors
      agriculture: "Agriculture",
      fisheries: "Fisheries & Aquaculture",
      livestock: "Livestock",
      forestry: "Forestry",
      
      // Mission Section
      institutionalMission: "Institutional Mission",
      missionTitle: "The legal interface between",
      missionTitleEnd: "the State and the Producer.",
      missionDesc: "Under the technical supervision of the Ministry of Agriculture and Rural Development, CAPEF is your legal and technical shield. It is not a simple partner — it is your institutional representative recognized by the Cameroonian State.",
      consultativeMission: "Consultative Mission",
      consultativeDesc: "Mandatory government advisor on rural and agricultural policies.",
      sectorRegulation: "Sector Regulation",
      sectorRegulationDesc: "Structuring inter-professions for a fair distribution of income.",
      economicDiplomacy: "Economic Diplomacy",
      economicDiplomacyDesc: "Representing Cameroon in international chambers.",
      memberProtection: "Member Protection",
      memberProtectionDesc: "Legal, land, and contractual assistance for all members.",
      joinCapef: "Join CAPEF →",
      learnMore: "Learn More",
      
      // Key Figures
      institutionalWeight: "Institutional Weight",
      capefByNumbers: "CAPEF by the Numbers",
      representedSections: "Represented Sections",
      agriFisheriesLivestockForestry: "Agri · Fisheries · Livestock · Forestry",
      regionsCovered: "Regions Covered",
      fullNationalPresence: "Full national presence",
      yearFounded: "Year Founded",
      overCentury: "Over a century of institution",
      stateLegitimacy: "State Legitimacy",
      ministryOversight: "Ministry of Agriculture oversight",
      becomeOfficialMember: "Become an Official CAPEF Member →",
      
      // Quote Banner
      quoteText: "Structuring, protecting, and developing Cameroon's rural world — since 1921.",
      capefFullName: "CAPEF — Chamber of Agriculture, Fisheries, Livestock & Forestry of Cameroon",
      joinNowArrow: "Join Now →",
      bookAppointment: "Book an Appointment",
      
      // Youth Excellence Program
      exclusiveProgram: "Exclusive Program",
      advantageForYoung: "The Advantage for",
      youngPioneers: "YOUNG",
      pioneersEnd: "Pioneers.",
      programDesc: "Driving the transition toward a competitive and export-ready agro-industry.",
      performanceCatalyst: "A Performance Catalyst",
      performanceDesc: "CAPEF provides privileged access to YOUNG agri-preneurs through an ecosystem designed to remove structural barriers. By joining, YOUNG leaders benefit from a 50% reduction in membership and certification fees, along with a total waiver of processing fees for investment files.",
      registrationFees: "Registration Fees for",
      youngFounders: "YOUNG Founders",
      landAndProjects: "Land & Projects",
      landDesc: "We assist YOUNG producers in maturing their projects and facilitate priority access to acquiring secured agricultural land.",
      institutionalGuarantee: "Institutional Guarantee",
      guaranteeDesc: "CAPEF acts as a guarantor for banks and international funds to help YOUNG entrepreneurs secure the capital needed for expansion.",
      skillsAndInfluence: "Skills & Influence",
      skillsDesc: "We provide specialized training in technical and marketing management for YOUNG agri-preneurs, combined with direct advocacy to the government and international NGOs to defend your interests.",
      readyToTransform: "Ready to transform the sector?",
      activateYoungLicense: "Activate My YOUNG License",
      youth: "YOUNG",
      
      // FAQ Section
      faqTitle: "CAPEF × Frequently Asked Questions",
      faq1_q: "Why is CAPEF membership essential for exporters?",
      faq1_a: "As a state institution, the Chamber certifies the professional origin and quality of your products. Without their endorsement, it is extremely difficult to meet the strict certification standards required for international markets like the European Union.",
      faq2_q: "How does CAPEF concretely help young people looking to invest?",
      faq2_a: "The Chamber assists you in maturing your investment projects. If you are looking for agricultural space, they facilitate the process of acquiring land and help you build solid files to secure the necessary funding for your venture.",
      faq3_q: "What specific skills can I acquire through the Chamber?",
      faq3_a: "To modernize Cameroon's agricultural sector, CAPEF provides professional training focused on three pillars: technical skills for production, managerial expertise for farm management, and marketing strategies to better position your products.",
      faq4_q: "What is the Chamber's role as a 'Consultative Body'?",
      faq4_a: "CAPEF acts as a bridge between producers and decision-makers. It collects real-world challenges from members in the agriculture, livestock, fisheries, and forestry sectors and submits them directly to the government, international organizations, and NGOs.",
      faq5_q: "Can CAPEF help me find new markets or customers?",
      faq5_a: "Yes, one of its core missions is economic promotion. The Chamber helps producers improve their output and promotes their products both within Cameroon and on the international stage to increase visibility and sales.",
      
      // Palm Connect Section
      strategicGateway: "A Strategic Gateway for Young Agri-Entrepreneurs",
      gatewayDesc1: "CAPEF is a state institution designed to defend your interests. It serves as a vital bridge, taking the challenges faced by young producers and submitting them directly to the government, international organizations, and NGOs. Joining means your voice is heard at the highest levels.",
      gatewayDesc2: "Accelerate your growth through professional technical, managerial, and marketing training aimed at modernizing the industry. Benefit from specialized support to secure land, mature investment projects, and access the funding necessary to scale your production.",
      registerWithCapef: "Register with CAPEF",
      consultExpert: "Consult an Expert",
      
      // Final CTA
      joinElite: "Join Cameroon's agricultural elite",
      becomeCertified: "Become a",
      certifiedAgroEntrepreneur: "Certified Agro-Entrepreneur",
      withCapef: "with CAPEF.",
      finalDesc: "Joining CAPEF through Palm Connect means integrating Cameroon's largest rural opportunity platform. First consultation is free.",
      startMembership: "Start My Official Membership",
      speakToAdvisor: "Speak to an Advisor",
      
      // Modal
      officialMembership: "Official Membership",
      becomeCapefMember: "Become a CAPEF Member",
      firstName: "First Name *",
      lastName: "Last Name *",
      phoneNumber: "Phone Number *",
      city: "City *",
      email: "Email",
      sectorActivity: "Sector of Activity *",
      select: "— Select —",
      agricultureOption: "Agriculture",
      fisheriesOption: "Fisheries & Aquaculture",
      livestockOption: "Livestock",
      forestryOption: "Forestry & Timber",
      agriFoodOption: "Agri-Food Processing",
      submitApplication: "Submit My Membership Application",
      modalFooter: "Our team will contact you within 48 hours to finalize your file.",
      
      // Buttons
      joinCapefNow: "Join CAPEF Now",
      contactUsBtn: "Contact Us",
      
      // Sector content
      agricultureContent: "Supervision of cocoa, coffee, cotton, and food crop sectors to ensure food security.",
      fisheriesContent: "Modernization of fishing boats, management of fishing zones, and promotion of intensive fish farming.",
      livestockContent: "Improvement of cattle breeds, modern poultry farming, and sanitary control of animal products.",
      forestryContent: "Sustainable management of timber resources and promotion of local wood processing."
    }
  }[currentLang] || {
    // Fallback français (reprendre la structure fr)
    agriculture: "Agriculture",
    fisheries: "Pêches & Aquaculture",
    livestock: "Élevage",
    forestry: "Forêts",
    agricultureContent: "Encadrement des filières cacao, café, coton, et cultures vivrières pour garantir la sécurité alimentaire.",
    fisheriesContent: "Modernisation des pirogues, gestion des zones de pêche et promotion de la pisciculture intensive.",
    livestockContent: "Amélioration des races bovines, aviculture moderne et contrôle sanitaire des produits animaux.",
    forestryContent: "Gestion durable des ressources ligneuses et promotion de la transformation locale du bois."
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    const successMsg = currentLang === 'fr' 
      ? "Demande d'adhésion soumise ! Notre équipe vous contactera dans les 48 heures."
      : "Membership application submitted! Our team will contact you within 48 hours.";
    alert(successMsg);
    setModal(false);
  };

  // Secteurs pour le bas de la hero section
  const heroSectors = [
    { icon:<Leaf size={20}/>, label: t.agriculture },
    { icon:<Fish size={20}/>, label: t.fisheries },
    { icon:<Beef size={20}/>, label: t.livestock },
    { icon:<Trees size={20}/>, label: t.forestry },
  ];

  // Missions
  const missions = [
    { icon:<Gavel size={18}/>, title: t.consultativeMission, desc: t.consultativeDesc },
    { icon:<Scale size={18}/>, title: t.sectorRegulation, desc: t.sectorRegulationDesc },
    { icon:<Globe size={18}/>, title: t.economicDiplomacy, desc: t.economicDiplomacyDesc },
    { icon:<Handshake size={18}/>, title: t.memberProtection, desc: t.memberProtectionDesc },
  ];

  // Key figures
  const keyFigures = [
    { num:"4",    label: t.representedSections,  sub: t.agriFisheriesLivestockForestry },
    { num:"10",   label: t.regionsCovered,       sub: t.fullNationalPresence },
    { num:"1921", label: t.yearFounded,          sub: t.overCentury },
    { num:"100%", label: t.stateLegitimacy,      sub: t.ministryOversight },
  ];

  // FAQ items
  const faqItems = [
    { q: t.faq1_q, a: t.faq1_a },
    { q: t.faq2_q, a: t.faq2_a },
    { q: t.faq3_q, a: t.faq3_a },
    { q: t.faq4_q, a: t.faq4_a },
    { q: t.faq5_q, a: t.faq5_a }
  ];

  // Options du formulaire
  const sectorOptions = [
    t.agricultureOption,
    t.fisheriesOption,
    t.livestockOption,
    t.forestryOption,
    t.agriFoodOption
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background:'#f7fbf8', fontFamily:"'Georgia','Times New Roman',serif" }}>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: G }}>
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ backgroundImage:`url(${IMGS.hero})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.25 }} />
          <div className="absolute inset-0" style={{ background:`linear-gradient(160deg, ${G} 30%, ${GL}88 100%)` }} />
        </motion.div>
        <div className="absolute inset-0 z-[1] opacity-[0.06]" style={{ backgroundImage:'radial-gradient(circle, #c8a84b 1px, transparent 1px)', backgroundSize:'60px 60px' }} />

        <div className="relative z-10 text-center px-8 max-w-6xl mx-auto pt-32 pb-20">
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9 }}>
            <span className="inline-block px-6 py-2 border text-[10px] font-black uppercase tracking-[0.5em] mb-6" style={{ borderColor:`${GO}66`, color:GO, fontFamily:'sans-serif' }}>
              {t.badge}
            </span>
            <h1 className="text-5xl md:text-8xl text-white leading-[0.9] mb-6">
              {t.title}<br />
              <span className="italic font-light text-3xl md:text-5xl" style={{ color:GO }}>
                {t.subtitle}
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-white/70 text-lg leading-relaxed mb-12 mt-8" style={{ fontFamily:'sans-serif', fontStyle:'normal' }}>
              {t.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={() => setModal(true)}
                className="flex items-center gap-3 px-12 py-5 font-black uppercase text-[11px] tracking-widest transition-all hover:scale-105 shadow-2xl"
                style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
                <UserPlus size={18} /> {t.joinNow}
              </button>
              <Link to="/book-appointment">
                <button className="flex items-center gap-3 px-12 py-5 font-black uppercase text-[11px] tracking-widest border text-white hover:bg-white/10 transition-all"
                  style={{ borderColor:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
                  <Phone size={18} style={{ color:GO }} /> {t.contactUs}
                </button>
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }} className="mt-20">
            <div className="w-px h-16 mx-auto" style={{ background:`linear-gradient(to bottom, ${GO}, transparent)` }} />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-2 md:grid-cols-4">
          {heroSectors.map((s, i) => (
            <div key={i} className="flex items-center justify-center gap-3 py-5 text-white/80 hover:text-white transition-all"
              style={{ background: i%2===0 ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.25)', fontFamily:'sans-serif', fontSize:11 }}>
              <span style={{ color:GO }}>{s.icon}</span>
              <span className="font-black uppercase tracking-widest text-[10px]">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ INSTITUTIONAL MISSION ══ */}
      <section className="py-28 px-8" style={{ background:'white' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="grid grid-cols-2 gap-4 h-[520px]">
            <div className="row-span-2 overflow-hidden rounded-2xl">
              <img src={IMGS.agri1} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src={IMGS.fishing} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src={IMGS.forest} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>{t.institutionalMission}</span>
            <h2 className="text-4xl md:text-5xl leading-tight mb-6 italic" style={{ color:G }}>
              {t.missionTitle}<br />{t.missionTitleEnd}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-10" style={{ fontFamily:'sans-serif' }}>
              {t.missionDesc}
            </p>
            <div className="space-y-4">
              {missions.map((item, i) => (
                <div key={i} className="flex gap-5 p-5 border border-slate-100 rounded-xl hover:border-green-200 hover:shadow-md transition-all group cursor-default">
                  <div className="mt-1 shrink-0 p-2 rounded-lg" style={{ color:G, background:GB }}>{item.icon}</div>
                  <div>
                    <div className="font-bold text-sm mb-1" style={{ color:G }}>{item.title}</div>
                    <div className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily:'sans-serif' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex gap-4">
              <button onClick={() => setModal(true)}
                className="px-10 py-4 font-black uppercase text-[11px] tracking-widest text-white transition-all hover:opacity-90"
                style={{ background:G, fontFamily:'sans-serif' }}>
                {t.joinCapef}
              </button>
              <Link to="/book-appointment">
                <button className="px-10 py-4 font-black uppercase text-[11px] tracking-widest border transition-all hover:bg-slate-50"
                  style={{ borderColor:G, color:G, fontFamily:'sans-serif' }}>
                  {t.learnMore}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ KEY FIGURES ══ */}
      <section className="py-24 px-8" style={{ background:G }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>{t.institutionalWeight}</span>
            <h2 className="text-4xl md:text-5xl text-white italic">{t.capefByNumbers}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background:'rgba(255,255,255,0.1)' }}>
            {keyFigures.map((s, i) => (
              <div key={i} className="p-10 text-center" style={{ background:G }}>
                <div className="text-5xl font-black mb-3" style={{ color:GO }}>{s.num}</div>
                <div className="text-white font-bold text-sm mb-1">{s.label}</div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider" style={{ fontFamily:'sans-serif' }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={() => setModal(true)}
              className="px-14 py-5 font-black uppercase text-[11px] tracking-widest transition-all hover:bg-white hover:text-black"
              style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
              {t.becomeOfficialMember}
            </button>
          </div>
        </div>
      </section>

      {/* ══ QUOTE BANNER ══ */}
      <section className="relative overflow-hidden" style={{ minHeight:400 }}>
        <div className="absolute inset-0 z-0">
          <img src={IMGS.meeting} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background:`${G}e0` }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-24 text-center">
          <blockquote className="text-2xl md:text-4xl text-white italic leading-relaxed mb-8">
            "{t.quoteText}"
          </blockquote>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black" style={{ color:GO, fontFamily:'sans-serif' }}>
            {t.capefFullName}
          </span>
          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">
            <button onClick={() => setModal(true)}
              className="px-12 py-5 font-black uppercase text-[11px] tracking-widest transition-all hover:bg-white hover:text-black"
              style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
              {t.joinNowArrow}
            </button>
            <Link to="/book-appointment">
              <button className="px-12 py-5 font-black uppercase text-[11px] tracking-widest border text-white hover:bg-white/10 transition-all"
                style={{ borderColor:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
                {t.bookAppointment}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SECTION: YOUTH EXCELLENCE PROGRAM (BENTO GRID) ══ */}
      <section className="py-24 px-8" style={{ background: '#FDFCFB' }}>
        <div className="max-w-7xl mx-auto">
          
          {/* Sophisticated Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[1px] w-12 bg-slate-200"></span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-black" style={{ color: GO }}>{t.exclusiveProgram}</span>
              </div>
              <h2 className="text-5xl md:text-6xl italic leading-[1.1] tracking-tight" style={{ color: G }}>
                {t.advantageForYoung} <span style={{ color: GO }}>{t.youngPioneers}</span> <br /> 
                <span className="text-slate-800">{t.pioneersEnd}</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed italic border-l pl-6" style={{ borderColor: GO }}>
              {t.programDesc}
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* 1. Vision & Reductions (Large Card) */}
            <div className="md:col-span-8 bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8" style={{ background: `${G}10`, color: G }}>
                  <Award size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-6 italic" style={{ color: G }}>{t.performanceCatalyst}</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-8" style={{ fontFamily: 'sans-serif' }}>
                  {t.performanceDesc}
                </p>
              </div>
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
                <Landmark size={200} />
              </div>
            </div>

            {/* 2. Key Figure (Square Card) */}
            <div className="md:col-span-4 bg-[#1A1A1A] p-10 rounded-[3rem] flex flex-col justify-between items-start group hover:bg-black transition-all">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${GO}20`, color: GO }}>
                <TrendingDown size={28} />
              </div>
              <div>
                <div className="text-6xl font-black text-white mb-2 italic">-50%</div>
                <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold">
                  {t.registrationFees} <span style={{ color: GO }}>{t.youngFounders}</span>
                </p>
              </div>
            </div>

            {/* 3. Land & Projects (Medium Card) */}
            <div className="md:col-span-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="flex gap-4 mb-6">
                <div className="p-3 rounded-xl" style={{ background: GB, color: G }}><MapPin size={20}/></div>
                <h4 className="text-xl font-bold italic" style={{ color: G }}>{t.landAndProjects}</h4>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
                {t.landDesc}
              </p>
            </div>

            {/* 4. Financing & Credit (Medium Card) */}
            <div className="md:col-span-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="flex gap-4 mb-6">
                <div className="p-3 rounded-xl" style={{ background: GB, color: G }}><Coins size={20}/></div>
                <h4 className="text-xl font-bold italic" style={{ color: G }}>{t.institutionalGuarantee}</h4>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
                {t.guaranteeDesc}
              </p>
            </div>

            {/* 5. Expertise & Advocacy (Large Horizontal Card) */}
            <div className="md:col-span-12 lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition-all">
              <div className="flex-1">
                <h4 className="text-2xl font-bold mb-4 italic" style={{ color: G }}>{t.skillsAndInfluence}</h4>
                <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
                  {t.skillsDesc}
                </p>
              </div>
              <div className="shrink-0 flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                     <img src={`https://i.pravatar.cc/150?u=${i+30}`} alt="member" />
                   </div>
                 ))}
                 <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                   +500
                 </div>
              </div>
            </div>

            {/* 6. Call to Action Card */}
            <div className="md:col-span-12 lg:col-span-4 p-2 rounded-[3.2rem]" style={{ background: `linear-gradient(135deg, ${G}, ${GL})` }}>
              <div className="h-full w-full p-8 flex flex-col justify-center items-center text-center">
                <h4 className="text-xl font-bold mb-4 italic text-white text-center">{t.readyToTransform}</h4>
                <button 
                  onClick={() => setModal(true)}
                  className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl hover:scale-[1.02] active:scale-95 bg-white"
                  style={{ color: G }}
                >
                  {t.activateYoungLicense}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ FAQ SECTION ══ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-12 italic tracking-tight" style={{ color: G }}>
            {t.faqTitle}
          </h2>
          <div className="space-y-6">
            {faqItems.map((faq, idx) => (
              <details key={idx} className="group border-b pb-6">
                <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-slate-800">
                  {faq.q}
                  <ArrowRight size={18} className="group-open:rotate-90 transition-transform" style={{ color: GO }} />
                </summary>
                <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PALM CONNECT × CAPEF ══ */}
      <section className="py-24 px-8" style={{ background: GB }}>
        <div className="max-w-7xl mx-auto">
          <div className="border-l-4 p-10 md:p-14 bg-white shadow-sm" style={{ borderColor: GO }}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
              
              {/* Logos */}
              <div className="flex items-center gap-4 md:gap-6 shrink-0">
                <div className="text-slate-300 font-light text-3xl">×</div>
                <div 
                  className="px-6 py-3 rounded-xl flex items-center justify-center font-black text-xs md:text-sm text-white uppercase tracking-widest whitespace-nowrap shadow-lg" 
                  style={{ background: G }}
                >
                  Pioneer Choice
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="font-black text-xl mb-3 italic uppercase tracking-tight" style={{ color: G }}>
                  {t.strategicGateway}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <p className="text-slate-500 text-[13px] leading-relaxed">
                    {t.gatewayDesc1}
                  </p>
                  <p className="text-slate-500 text-[13px] leading-relaxed">
                    {t.gatewayDesc2}
                  </p>
                </div>
                
                <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-slate-200"></span>
                    {t.agriculture}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-slate-200"></span>
                    {t.livestock}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-slate-200"></span>
                    {t.fisheries}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-slate-200"></span>
                    {t.forestry}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-col gap-3 w-full lg:w-auto">
                <button onClick={() => setModal(true)}
                  className="px-10 py-4 font-black uppercase text-[11px] tracking-widest text-white transition-all hover:opacity-90 whitespace-nowrap"
                  style={{ background: G, fontFamily: 'sans-serif' }}>
                  {t.registerWithCapef}
                </button>
                <Link to="/book-appointment">
                  <button className="w-full px-10 py-4 font-black uppercase text-[11px] tracking-widest border transition-all hover:bg-slate-50 whitespace-nowrap text-center"
                    style={{ borderColor: G, color: G, fontFamily: 'sans-serif' }}>
                    {t.consultExpert}
                  </button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-32 text-center relative overflow-hidden" style={{ background:G }}>
        <div className="absolute inset-0" style={{ backgroundImage:`url(${IMGS.agri3})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.12 }} />
        <div className="absolute inset-0" style={{ background:`linear-gradient(to bottom, ${G}, transparent, ${G})` }} />
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black block mb-6" style={{ color:GO, fontFamily:'sans-serif' }}>{t.joinElite}</span>
          <h2 className="text-4xl md:text-7xl text-white leading-tight mb-8 italic">
            {t.becomeCertified}<br />
            <span style={{ color:GO }}>{t.certifiedAgroEntrepreneur}</span><br />
            {t.withCapef}
          </h2>
          <p className="text-white/50 text-sm mb-14 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily:'sans-serif' }}>
            {t.finalDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => setModal(true)}
              className="flex items-center justify-center gap-3 px-14 py-6 font-black uppercase text-[11px] tracking-widest transition-all hover:bg-white shadow-2xl"
              style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
              <UserPlus size={18} /> {t.startMembership}
            </button>
            <Link to="/book-appointment">
              <button className="flex items-center justify-center gap-3 px-14 py-6 font-black uppercase text-[11px] tracking-widest border text-white hover:bg-white/10 transition-all"
                style={{ borderColor:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
                <Phone size={18} style={{ color:GO }} /> {t.speakToAdvisor}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ MEMBERSHIP MODAL ══ */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale:0.92, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.92, opacity:0 }}
              className="relative bg-white w-full max-w-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{ borderTop:`6px solid ${G}` }}>
              <button onClick={() => setModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black transition-colors z-10">
                <X size={28} />
              </button>
              <div className="p-10 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color:GO, fontFamily:'sans-serif' }}>{t.officialMembership}</span>
                    <h3 className="text-2xl italic" style={{ color:G }}>{t.becomeCapefMember}</h3>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>{t.firstName}</label>
                      <input required name="firstName" onChange={handleChange} type="text"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>{t.lastName}</label>
                      <input required name="lastName" onChange={handleChange} type="text"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>{t.phoneNumber}</label>
                    <input required name="phone" onChange={handleChange} type="tel"
                      className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                      style={{ fontFamily:'sans-serif' }}
                      onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>{t.city}</label>
                      <input required name="city" onChange={handleChange} type="text"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>{t.email}</label>
                      <input name="email" onChange={handleChange} type="email"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>{t.sectorActivity}</label>
                    <select required name="sector" onChange={handleChange}
                      className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 bg-transparent"
                      style={{ fontFamily:'sans-serif' }}
                      onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
                      <option value="">{t.select}</option>
                      {sectorOptions.map((opt, idx) => (
                        <option key={idx}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="pt-6">
                    <button type="submit"
                      className="w-full py-5 font-black uppercase text-[11px] tracking-widest text-white transition-all hover:opacity-90"
                      style={{ background:G, fontFamily:'sans-serif' }}>
                      {t.submitApplication}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-4" style={{ fontFamily:'sans-serif' }}>
                      {t.modalFooter}
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default InstitutionalProfil;