import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, School, ShoppingBasket, 
  Fuel, Coffee, CheckCircle2, Share2, Printer, 
  Maximize, Bed, Bath, Car, Calendar 
} from 'lucide-react';
import { MOCK_PROPERTIES } from '../data/properties';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  
  // Récupération du bien dans la data
  const property = MOCK_PROPERTIES.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Asset Not Found</h2>
          <Link to="/real-estate" className="text-pc-gold uppercase text-[10px] font-black tracking-widest">Return to Catalog</Link>
        </div>
      </div>
    );
  }

  const isLand = property.type === 'land' || property.type === 'field';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 1. NAVIGATION ACTIONS */}
      <nav className="pt-32 pb-6 px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/real-estate" className="flex items-center text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] group">
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Catalog
          </Link>
          <div className="flex gap-6 text-slate-400">
            <button className="hover:text-pc-gold transition-colors"><Share2 size={16} /></button>
            <button className="hover:text-pc-gold transition-colors"><Printer size={16} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* 2. HEADER: TITRE & PRIX */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-pc-gold text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                {property.status === 'sale' ? 'For Sale' : 'For Lease'}
              </span>
              <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                Ref: #PC-00{property.id}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-[1.1] uppercase tracking-tighter mb-4">
              {property.title}
            </h1>
            <p className="flex items-center text-slate-500 font-light tracking-wide italic">
              <MapPin size={18} className="mr-2 text-pc-gold" /> {property.location}
            </p>
          </div>

          <div className="bg-slate-900 p-8 text-white min-w-[320px] rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pc-gold/10 rounded-full -translate-y-12 translate-x-12"></div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2 font-bold">Inquiry Price</p>
            <div className="text-4xl font-bold text-pc-gold">
              {property.price} <span className="text-xs font-light text-white/50 ml-1 uppercase">XAF</span>
            </div>
            {!isLand && <p className="text-[9px] text-white/30 uppercase mt-2 italic font-medium tracking-tighter">Conditions apply / monthly basis</p>}
            <div className="flex items-center gap-2 mt-6 py-3 border-t border-white/10">
              <div className="w-2 h-2 bg-pc-green rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-pc-green">Certified Legal Title</span>
            </div>
          </div>
        </div>

        {/* 3. GALLERY GRID (Style Magazine) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20 h-[500px] md:h-[650px]">
          <div className="md:col-span-2 h-full overflow-hidden group">
            <img src={property.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Cover" />
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-4 h-full">
            {property.gallery && property.gallery.length > 0 ? (
              property.gallery.slice(0, 3).map((img, i) => (
                <div key={i} className={`overflow-hidden rounded-sm group ${i === 2 ? 'col-span-2' : ''}`}>
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Interior" />
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-slate-50 flex items-center justify-center border border-dashed border-slate-200">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Additional views pending</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* 4. CONTENT AREA (LEFT) */}
          <div className="lg:col-span-2 space-y-20">
            
            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-10 border-y border-slate-100">
              {isLand ? (
                <SpecItem icon={<Maximize size={20}/>} label="Total Area" value={`${property.size} sqm`} />
              ) : (
                <>
                  <SpecItem icon={<Bed size={20}/>} label="Bedrooms" value={property.beds} />
                  <SpecItem icon={<Bath size={20}/>} label="Bathrooms" value={property.baths} />
                  <SpecItem icon={<Maximize size={20}/>} label="Total Surface" value={property.surface} />
                  <SpecItem icon={<Car size={20}/>} label="Parking Slot" value="Available" />
                </>
              )}
            </div>

            {/* Description */}
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8 border-l-4 border-pc-gold pl-5">Property Narrative</h2>
              <div className="text-slate-600 text-lg leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                {property.description}
              </div>
            </section>

            {/* NEIGHBORHOOD ANALYSIS */}
            <section className="bg-slate-50 p-10 md:p-16 rounded-sm">
              <div className="text-center mb-16">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 mb-3">Strategic Proximity</h2>
                <div className="w-12 h-1 bg-pc-gold mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                <AmenityBox icon={<School />} title="Education" data={property.amenities.schools} />
                <AmenityBox icon={<ShoppingBasket />} title="Markets" data={property.amenities.markets} />
                <AmenityBox icon={<Fuel />} title="Energy/Fuel" data={property.amenities.stations} />
                <AmenityBox icon={<Coffee />} title="Gastronomy" data={property.amenities.bakeries} />
              </div>
            </section>
          </div>

          {/* 5. SIDEBAR (CONTACT) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white border border-slate-200 p-8 shadow-2xl shadow-slate-200/50">
                <h3 className="text-xl font-serif text-slate-900 mb-6 italic">Secure this Asset</h3>
                <form className="space-y-4">
                  <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 border-none text-[12px] focus:ring-1 focus:ring-pc-gold outline-none transition-all" />
                  <input type="email" placeholder="Professional Email" className="w-full p-4 bg-slate-50 border-none text-[12px] focus:ring-1 focus:ring-pc-gold outline-none transition-all" />
                  <textarea placeholder="Specific Requirements..." rows="4" className="w-full p-4 bg-slate-50 border-none text-[12px] focus:ring-1 focus:ring-pc-gold outline-none transition-all"></textarea>
                  <button className="w-full bg-slate-900 text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-pc-gold transition-all duration-500">
                    Request Private Viewing
                  </button>
                </form>
              </div>
              
              <div className="p-8 border border-slate-100 bg-slate-50/30 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Direct Channel</p>
                <p className="text-lg font-serif text-slate-900">+237 6XX XXX XXX</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* --- MINI COMPOSANTS --- */

const SpecItem = ({ icon, label, value }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="text-pc-gold mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{icon}</div>
    <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">{label}</span>
    <span className="text-sm text-slate-900 font-bold tracking-tighter">{value}</span>
  </div>
);

const AmenityBox = ({ icon, title, data }) => (
  <div className="flex gap-5">
    <div className="shrink-0 w-12 h-12 bg-white flex items-center justify-center text-pc-gold shadow-sm border border-slate-100">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <h4 className="text-[10px] font-black uppercase text-slate-900 mb-2 tracking-widest">{title}</h4>
      <p className="text-pc-gold text-[10px] font-bold mb-3">{data.count} Places Found</p>
      <ul className="space-y-2">
        {data.names.map((name, i) => (
          <li key={i} className="flex items-center text-[11px] text-slate-500 font-medium">
            <CheckCircle2 size={10} className="mr-2 text-pc-green shrink-0" /> {name}
          </li>
        ))}
        {data.count === 0 && <li className="text-[10px] text-slate-400 italic font-light">Data pending for this zone</li>}
      </ul>
    </div>
  </div>
);

export default PropertyDetailsPage;