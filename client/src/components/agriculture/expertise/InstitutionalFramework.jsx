import React from 'react';
import { Landmark, Award, ShieldCheck } from 'lucide-react';

const InstitutionalFramework = () => {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <span className="text-pc-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
              Regulatory Compliance
            </span>
            <h2 className="text-4xl font-serif mb-6 uppercase tracking-tighter leading-tight">
              Aligned with <br />
              <span className="text-pc-green italic font-light">National Standards</span>
            </h2>
            <p className="text-slate-400 font-light leading-relaxed mb-8">
              Every project managed by Property Cameroon strictly follows the guidelines set by the <strong>CAPEF</strong> (Chamber of Agriculture, Fisheries, Livestock and Forestry) and <strong>MINADER</strong>. We ensure your investment contributes to the National Strategic Development Plan (SND30).
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 border-l-2 border-pc-gold">
                <Landmark className="text-pc-gold" size={20} />
                <span className="text-xs uppercase font-bold tracking-widest">CAPEF Certified Standards</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 border-l-2 border-pc-gold">
                <ShieldCheck className="text-pc-gold" size={20} />
                <span className="text-xs uppercase font-bold tracking-widest">MINDCAF Legal Land Security</span>
              </div>
            </div>
          </div>

          {/* Visual Element: A professional seal or abstract geometric representation */}
          <div className="relative h-[400px] bg-slate-800 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]"></div>
             <div className="relative z-10 text-center p-12 border border-pc-gold/20 bg-slate-900/50 backdrop-blur-sm">
                <Award size={64} className="text-pc-gold mx-auto mb-6" />
                <h4 className="text-xl font-serif italic mb-2 text-white">Institutional Reliability</h4>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Governmental Liaison Office</p>
             </div>
             {/* Decorative circles */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-pc-green/10 rounded-full blur-3xl"></div>
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pc-gold/10 rounded-full blur-3xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InstitutionalFramework;