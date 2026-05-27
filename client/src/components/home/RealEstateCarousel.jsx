// RealEstateCarousel.jsx - VERSION OPTIMISÉE
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import CSS seulement si nécessaire (mais fais du lazy loading plus tard)
import 'swiper/css';
import 'swiper/css/pagination';

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const ArrowLeft = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>);
const ArrowRight = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);

const PROPERTIES = [
  { id: 1, name: "Lumina Villa", location: "Bastos, Yaoundé", price: "450,000,000", image: "/images/villa-bastos.jpg", tag: "Exclusive" },
  { id: 2, name: "Azure Residence", location: "Bonapriso, Douala", price: "185,000,000", image: "/images/apt-douala.jpg", tag: "New" },
  { id: 3, name: "The Heights Mansion", location: "Golf, Yaoundé", price: "600,000,000", image: "/images/mansion-golf.jpg", tag: "Prime" }
];

const RealEstateCarousel = () => {
  const swiperRef = useRef(null);
  const isMobile = useMobile();

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8">
        
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[1px] bg-pc-gold"></div>
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-pc-gold">Curated Portfolio</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-none tracking-tighter">
              Premier <span className="text-pc-green italic">Real Estate</span>
            </h2>
          </div>

          <div className="flex gap-4">
            <button onClick={() => swiperRef.current?.swiper.slidePrev()} className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:border-pc-gold hover:text-pc-gold transition-all">
              <ArrowLeft />
            </button>
            <button onClick={() => swiperRef.current?.swiper.slideNext()} className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:border-pc-gold hover:text-pc-gold transition-all">
              <ArrowRight />
            </button>
          </div>
        </div>

        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination]}
          spaceBetween={isMobile ? 20 : 40}
          slidesPerView={isMobile ? 1 : 1}
          loop={false}  // ← CRUCIAL : PAS DE LOOP SUR MOBILE
          autoplay={false}  // ← CRUCIAL : PAS D'AUTOPLAY
          speed={isMobile ? 200 : 500}
          pagination={isMobile ? false : { clickable: true, el: '.custom-pagination' }}
          breakpoints={{
            768: { slidesPerView: 2, loop: true, autoplay: { delay: 3000 } },
            1200: { slidesPerView: 3 }
          }}
          className="!overflow-visible"
        >
          {PROPERTIES.map((property) => (
            <SwiperSlide key={property.id}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 border border-slate-50">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    loading="lazy"  // ← AJOUTÉ
                    decoding="async"  // ← AJOUTÉ
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-8 left-8">
                    <span className="text-[8px] font-bold uppercase tracking-[0.3em] bg-white px-4 py-2 text-slate-900">
                      {property.tag}
                    </span>
                  </div>
                </div>
                <div className="mt-8 text-left">
                  <p className="text-[9px] text-pc-gold font-bold uppercase tracking-[0.4em] mb-2">{property.location}</p>
                  <h3 className="text-2xl font-serif text-slate-900 mb-4">{property.name}</h3>
                  <p className="text-xl font-light text-slate-900 border-l border-pc-gold pl-4">
                    {property.price} <span className="text-[10px] text-slate-400 font-bold ml-1">XAF</span>
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="custom-pagination mt-16 flex justify-center"></div>
      </div>
    </section>
  );
};

export default RealEstateCarousel;