import React from 'react';
import { Search, FileCheck, TestTube, Briefcase, Key } from 'lucide-react';

const AUDIT_STEPS = [
  {
    id: "01",
    title: "Geospatial Sourcing",
    icon: <Search size={20} />,
    description: "Satellite mapping and physical boundary verification to ensure the land exists and is clear of any overlapping claims."
  },
  {
    id: "02",
    title: "Legal Due Diligence",
    icon: <FileCheck size={20} />,
    description: "Deep audit of the Land Title (Titre Foncier) at the Ministry of Land Tenure. Verification of the 'Certificat de Propriété'."
  },
  {
    id: "03",
    title: "Agronomic Feasibility",
    icon: <TestTube size={20} />,
    description: "Soil sampling and laboratory analysis (pH, NPK, organic matter) to match the terrain with the most profitable crop."
  },
  {
    id: "04",
    title: "Strategic Business Plan",
    icon: <Briefcase size={20} />,
    description: "Creation of a 10-year financial projection including CAPEX (clearing, planting) and OPEX (maintenance, harvesting)."
  },
  {
    id: "05",
    title: "Final Deed Transfer",
    icon: <Key size={20} />,
    description: "Notarized transaction and administrative follow-up until the final Land Title is issued in the investor's name."
  }
];

const TheAuditProcess = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-[10px] font-black text-pc-gold uppercase tracking-[0.4em] mb-4">
            Our Protocol
          </h2>
          <h3 className="text-4xl font-serif text-slate-900 uppercase tracking-tighter">
            From Raw Land to <span className="italic text-pc-green">Certified Asset</span>
          </h3>
          <div className="w-20 h-1 bg-pc-gold mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {AUDIT_STEPS.map((step, index) => (
            <div key={step.id} className="relative group">
              {/* Connector Line (Desktop) */}
              {index !== AUDIT_STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-[1px] bg-slate-100 z-0"></div>
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:border-pc-gold group-hover:text-pc-gold group-hover:bg-slate-900 transition-all duration-500 mb-6">
                  {step.icon}
                </div>

                {/* Content */}
                <span className="text-[10px] font-black text-pc-gold mb-2">{step.id}</span>
                <h4 className="text-sm font-bold text-slate-900 uppercase mb-3 px-4">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheAuditProcess;