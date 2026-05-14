import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';

const PRODUCTS = [
  { id: 1, name: "Premium Cocoa Beans", price: "2,800", unit: "Kg", img: "/images/propertycacao.jfif" },
  { id: 2, name: "Sweet Cayenne Pineapple", price: "1,500", unit: "Unit", img: "/images/propertyananas.jfif" },
  { id: 3, name: "Yellow Corn (Grade A)", price: "22,000", unit: "100kg Bag", img: "/images/propertymais.jfif" },
  { id: 4, name: "Red Onions", price: "12,500", unit: "50kg Bag", img: "/images/propertyoignons.jfif" }
];

const AgricultureCarousel = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-pc-green">Marketplace</span>
          <h2 className="text-4xl font-serif text-slate-900 mt-2">Current Harvests</h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={25}
          slidesPerView={1.5}
          autoplay={{ delay: 4000 }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2.5 },
            1024: { slidesPerView: 4.5 }
          }}
          className="pb-16"
        >
          {PRODUCTS.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white p-4 shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square overflow-hidden mb-6">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-sm uppercase tracking-tight text-slate-800">{item.name}</h4>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                  <p className="text-pc-green font-black">{item.price} <span className="text-[10px] text-slate-400">FCFA / {item.unit}</span></p>
                  <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-pc-green hover:text-white transition-colors">+</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AgricultureCarousel;