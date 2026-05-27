// RealEstateCarousel.jsx - VERSION ULTIME OPTIMISÉE
import React, { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { Navigation, Pagination } from 'swiper/modules';

// Lazy loading des CSS Swiper (CRUCIAL)
import 'swiper/css';
import 'swiper/css/pagination';

const Swiper = lazy(() => import('swiper/react').then(mod => ({ default: mod.Swiper })));
const SwiperSlide = lazy(() => import('swiper/react').then(mod => ({ default: mod.SwiperSlide })));

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

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const PROPERTIES = [
  { id: 1, name: "Lumina Villa", location: "Bastos, Yaoundé", price: "450,000,000", image: "/images/villa-bastos.jpg", tag: "Exclusive" },
  { id: 2, name: "Azure Residence", location: "Bonapriso, Douala", price: "185,000,000", image: "/images/apt-douala.jpg", tag: "New" },
  { id: 3, name: "The Heights Mansion", location: "Golf, Yaoundé", price: "600,000,000", image: "/images/mansion-golf.jpg", tag: "Prime" }
];

// Composant Image optimisé avec priority sur la première
const OptimizedSlideImage = ({ src, alt, isFirst }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (isFirst) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [isFirst]);

  return (
    <div ref={imgRef} className="absolute inset-0 w-full h-full">
      {!loaded && <div className="absolute inset-0 bg-slate-100 animate-pulse" />}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading={isFirst ? "eager" : "lazy"}
          fetchPriority={isFirst ? "high" : "low"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

const RealEstateCarousel = () => {
  const swiperRef = useRef(null);
  const isMobile = useMobile();

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8">
        
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-8 md:w-10 h-[1px] bg-pc-gold"></div>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-black text-pc-gold">
                Curated Portfolio
              </span>
            </div>
            <h2 className="text-3xl md:text-6xl font-serif text-slate-900 leading-tight md:leading-none tracking-tighter">
              Premier <span className="text-pc-green italic">Real Estate</span>
            </h2>
          </div>

          {/* Caché sur mobile pour réduire le DOM */}
          {!isMobile && (
            <div className="flex gap-3 md:gap-4">
              <button 
                onClick={() => swiperRef.current?.swiper.slidePrev()}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-pc-gold hover:text-pc-gold transition-all"
                aria-label="Previous slide"
              >
                <ArrowLeft />
              </button>
              <button 
                onClick={() => swiperRef.current?.swiper.slideNext()}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-pc-gold hover:text-pc-gold transition-all"
                aria-label="Next slide"
              >
                <ArrowRight />
              </button>
            </div>
          )}
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-slate-200 rounded-xl" />
                <div className="mt-4 h-4 bg-slate-200 rounded w-1/3" />
                <div className="mt-2 h-6 bg-slate-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        }>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={isMobile ? 16 : 40}
            slidesPerView={1}
            loop={false}
            autoplay={false}
            speed={isMobile ? 0 : 500}
            pagination={!isMobile ? { clickable: true, el: '.custom-pagination' } : false}
            breakpoints={{
              768: { slidesPerView: 2, loop: true, autoplay: { delay: 4000 }, spaceBetween: 30 },
              1200: { slidesPerView: 3, loop: true, autoplay: { delay: 4000 }, spaceBetween: 40 }
            }}
            className="!overflow-visible"
          >
            {PROPERTIES.map((property, index) => (
              <SwiperSlide key={property.id}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 rounded-xl">
                    <OptimizedSlideImage 
                      src={property.image} 
                      alt={property.name}
                      isFirst={index === 0}
                    />
                    <div className="absolute top-4 md:top-8 left-4 md:left-8">
                      <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] bg-white/90 backdrop-blur px-3 py-1.5 md:px-4 md:py-2 text-slate-900 rounded">
                        {property.tag}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-8 text-left">
                    <p className="text-[8px] md:text-[9px] text-pc-gold font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1 md:mb-2">
                      {property.location}
                    </p>
                    <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-2 md:mb-4">{property.name}</h3>
                    <p className="text-lg md:text-xl font-light text-slate-900 border-l-2 border-pc-gold pl-3 md:pl-4">
                      {property.price} <span className="text-[9px] md:text-[10px] text-slate-400 font-bold">XAF</span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Suspense>

        {!isMobile && <div className="custom-pagination mt-12 md:mt-16 flex justify-center"></div>}
      </div>

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 24px !important;
          height: 2px !important;
          border-radius: 0 !important;
          background: #cbd5e1 !important;
          opacity: 1 !important;
          margin: 0 6px !important;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #1A4731 !important;
          width: 48px !important;
        }
        @media (max-width: 768px) {
          .group:hover .group-hover\\:scale-110 {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default RealEstateCarousel;