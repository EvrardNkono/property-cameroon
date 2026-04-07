const Footer = () => {
  return (
    <footer className="bg-pc-green text-white pt-24 pb-12 border-t-2 border-pc-gold/30">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* COLUMN 1: BRAND & VISION */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-black tracking-tighter mb-8 flex items-center">
              PROPERTY<span className="text-pc-gold ml-1 italic font-serif font-light lowercase">Cameroon</span>
            </div>
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
              <li><a href="#" className="hover:text-pc-gold transition-colors italic">Luxury Residences</a></li>
              <li><a href="#" className="hover:text-pc-gold transition-colors italic">Land Title Verification</a></li>
              <li><a href="#" className="hover:text-pc-gold transition-colors italic">Site Management</a></li>
            </ul>
          </div>

          {/* COLUMN 3: AGRICULTURE (GREEN) */}
          <div>
            <h4 className="text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-8">
              Agricultural Division
            </h4>
            <ul className="space-y-4 text-sm text-slate-300 font-light">
              <li><a href="#" className="hover:text-white transition-colors italic">CAPEF Operations</a></li>
              <li><a href="#" className="hover:text-white transition-colors italic">Agro-Mechanization</a></li>
              <li><a href="#" className="hover:text-white transition-colors italic">Export & Logistics</a></li>
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
                <button className="border border-white/20 px-6 py-2 rounded-sm text-[10px] uppercase tracking-widest hover:bg-white hover:text-pc-green transition-all">
                  Book an Appointment
                </button>
              </div>
            </address>
          </div>
        </div>

        {/* BOTTOM LINE (COPYRIGHT) */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.4em] text-slate-500 font-medium text-center md:text-left">
            © 2026 PropertyCameroon — Institutional Seriousness
          </p>
          
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