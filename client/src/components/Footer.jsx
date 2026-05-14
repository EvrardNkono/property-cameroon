import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-pc-green text-white pt-24 pb-12 border-t-2 border-pc-gold/30">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* COLUMN 1: BRAND & VISION */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col gap-6 mb-8 group cursor-pointer">
              <img 
                src="/images/logo.png" 
                alt="Property Cameroon" 
                className="w-30 h-30 object-contain grayscale brightness-200 group-hover:grayscale-0 transition-all duration-700" 
              />
              <div className="text-2xl font-black tracking-tighter uppercase leading-none">
                PROPERTY<br />
                <span className="text-pc-gold italic font-serif font-light lowercase text-lg">Cameroon</span>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed font-light italic">
              "Building a legacy, cultivating a heritage." <br />
              Land excellence at the service of the diaspora and local investors.
            </p>
          </div>

          {/* COLUMN 2: REAL ESTATE (GOLD) */}
          <div>
            <h4 className="text-pc-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-80">
              Real Estate Division
            </h4>
            <ul className="space-y-4 text-sm text-slate-300 font-light">
              <li><Link to="/real-estate" className="hover:text-pc-gold transition-colors italic">Luxury Residences</Link></li>
              <li><Link to="/agriculture/expertise" className="hover:text-pc-gold transition-colors italic">Land Title Verification</Link></li>
              <li><a href="#" className="hover:text-pc-gold transition-colors italic">Site Management</a></li>
            </ul>
          </div>

          {/* COLUMN 3: AGRICULTURE (GREEN) */}
          <div>
            <h4 className="text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-8">
              Agricultural Division
            </h4>
            <ul className="space-y-4 text-sm text-slate-300 font-light">
              <li><Link to="/agriculture" className="hover:text-white transition-colors italic">Investment Projects</Link></li>
              <li><Link to="/agriculture/expertise" className="hover:text-white transition-colors italic">Agro-Mechanization</Link></li>
              <li><Link to="/agriculture/marketplace" className="hover:text-white transition-colors italic">Export & Logistics</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT & HEADQUARTERS */}
          <div>
            <h4 className="text-pc-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-80">
              Global Offices
            </h4>
            <address className="not-italic text-sm text-slate-300 space-y-4 font-light">
              <p>📍 <span className="text-white font-medium">Cameroon:</span> Bastos, Yaoundé</p>
              <p>📍 <span className="text-white font-medium">France:</span> Melun, Paris Region</p>
              <div className="pt-4">
                {/* Bouton maintenant fonctionnel */}
                <Link to="/book-appointment">
                  <button className="border border-white/20 px-6 py-2 rounded-sm text-[10px] uppercase tracking-widest hover:bg-white hover:text-pc-green transition-all">
                    Book an Appointment
                  </button>
                </Link>
              </div>
            </address>
          </div>
        </div>

        {/* BOTTOM LINE (COPYRIGHT & PARTNERS) */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[9px] uppercase tracking-[0.4em] text-slate-500 font-medium">
              © 2026 PropertyCameroon — Institutional Seriousness
            </p>
            
           
          </div>
          
          <div className="flex flex-wrap justify-center space-x-8 text-[9px] uppercase tracking-[0.2em] text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Legal Mentions</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-pc-gold/50 tracking-normal italic font-serif">Made for Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;