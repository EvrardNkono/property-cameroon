import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Tu peux utiliser des icônes de react-icons ou des SVG simples
const ArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const PROPERTIES = [
  { id: 1, name: "Lumina Villa", location: "Bastos, Yaoundé", price: "450,000,000", image: "/images/villa-bastos.jpg", tag: "Exclusive" },
  { id: 2, name: "Azure Residence", location: "Bonapriso, Douala", price: "185,000,000", image: "/images/apt-douala.jpg", tag: "New" },
  { id: 3, name: "The Heights Mansion", location: "Golf, Yaoundé", price: "600,000,000", image: "/images/mansion-golf.jpg", tag: "Prime" }
];

const RealEstateCarousel = () => {
  const swiperRef = useRef(null);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8">
        
        {/* Header avec contrôles intégrés */}
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

          {/* Boutons de navigation personnalisés */}
          <div className="flex gap-4">
            <button 
              onClick={() => swiperRef.current?.swiper.slidePrev()}
              className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:border-pc-gold hover:text-pc-gold transition-all duration-500 group"
            >
              <ArrowLeft />
            </button>
            <button 
              onClick={() => swiperRef.current?.swiper.slideNext()}
              className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:border-pc-gold hover:text-pc-gold transition-all duration-500"
            >
              <ArrowRight />
            </button>
          </div>
        </div>

        <Swiper
          ref={swiperRef}
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={40}
          slidesPerView={1}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 3000, // Plus rapide (3s)
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true, el: '.custom-pagination' }}
          breakpoints={{
            768: { slidesPerView: 2 },
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
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-all duration-700"></div>
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

        {/* Barre de progression/pagination discrète en bas */}
        <div className="custom-pagination mt-16 flex justify-center"></div>
      </div>

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 30px !important;
          height: 2px !important;
          border-radius: 0 !important;
          background: #e2e8f0 !important;
          opacity: 1 !important;
          margin: 0 10px !important;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #1A4731 !important; /* PC Green */
          width: 60px !important;
        }
      `}</style>
    </section>
  );
};

export default RealEstateCarousel;