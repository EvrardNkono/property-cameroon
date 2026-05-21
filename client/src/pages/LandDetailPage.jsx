// frontend/src/pages/LandDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, TrendingUp, Droplets, Zap, Sprout, DollarSign, Ruler, Award, ShieldCheck, Mail, Loader2, Send, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const LandDetailPage = () => {
  const { id } = useParams();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return `http://localhost:5000/uploads/properties/${image}`;
  };

  useEffect(() => {
    const fetchLand = async () => {
      try {
        setLoading(true);
        const response = await api.getAgriculturalLandById(id);
        setLand(response.land);
      } catch (err) {
        console.error('Error fetching land:', err);
        setError('Failed to load land details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchLand();
    }
    window.scrollTo(0, 0);
  }, [id]);

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      await api.post('/inquiries', {
        landId: land._id,
        landTitle: land.title,
        ...contactData
      });
      
      setContactSuccess(true);
      setTimeout(() => {
        setShowContactForm(false);
        setContactSuccess(false);
        setContactData({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    } catch (err) {
      console.error('Error sending inquiry:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <Loader2 size={48} className="text-pc-green animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !land) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-32">
          <p className="text-red-600 text-lg">{error || 'Land not found'}</p>
          <Link to="/agriculture" className="text-pc-green underline mt-4 inline-block">
            Back to Agriculture
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Back button */}
        <Link to="/agriculture" className="inline-flex items-center gap-2 text-slate-500 hover:text-pc-green mb-6 transition-colors">
          <ArrowLeft size={20} /> Back to opportunities
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images section */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-100">
              <img 
                src={getImageUrl(land.images?.[0])} 
                alt={land.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
                }}
              />
            </div>
            {land.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {land.images.slice(1, 5).map((img, idx) => (
                  <img 
                    key={idx} 
                    src={getImageUrl(img)} 
                    alt="" 
                    className="w-full h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-slate-400">ID: {land._id?.slice(-8)}</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                <ShieldCheck size={12} /> Verified
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{land.title}</h1>
            
            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <MapPin size={18} />
              <span>{land.location?.city || 'Cameroon'}, {land.location?.region}</span>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">{land.description}</p>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 flex items-center gap-1"><Ruler size={12} /> Surface</p>
                <p className="text-2xl font-bold">{land.surface?.value} {land.surface?.unit}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 flex items-center gap-1"><DollarSign size={12} /> Price</p>
                <p className="text-2xl font-bold text-pc-green">{land.price?.amount?.toLocaleString()} FCFA</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 flex items-center gap-1"><TrendingUp size={12} /> Expected ROI</p>
                <p className="text-2xl font-bold text-green-600">+{land.expectedRoi || 12}%</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 flex items-center gap-1"><Sprout size={12} /> Primary Crop</p>
                <p className="text-2xl font-bold capitalize">{land.agricultureDetails?.primaryCrop || '—'}</p>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-bold mb-3">Features & Infrastructure</h3>
              <div className="flex flex-wrap gap-3">
                {land.agricultureDetails?.waterAccess && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"><Droplets size={14} /> Water Access</span>
                )}
                {land.agricultureDetails?.electricityAccess && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"><Zap size={14} /> Electricity</span>
                )}
                {land.agricultureDetails?.soilType && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"><Sprout size={14} /> {land.agricultureDetails.soilType}</span>
                )}
                {land.agricultureDetails?.roadAccess && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"><MapPin size={14} /> {land.agricultureDetails.roadAccess} road</span>
                )}
              </div>
            </div>

            {/* Compatible crops */}
            {land.agricultureDetails?.cropCompatibility?.length > 0 && (
              <div className="border-t pt-6 mb-6">
                <h3 className="font-bold mb-3">Compatible Crops</h3>
                <div className="flex flex-wrap gap-2">
                  {land.agricultureDetails.cropCompatibility.map(crop => (
                    <span key={crop} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs capitalize">{crop}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {land.certifications?.length > 0 && (
              <div className="border-t pt-6 mb-6">
                <h3 className="font-bold mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-3">
                  {land.certifications.map(cert => (
                    <span key={cert} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      <Award size={14} /> {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact button */}
            <button 
              onClick={() => setShowContactForm(true)}
              className="w-full py-4 bg-pc-green text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={18} /> Contact Seller
            </button>
          </div>
        </div>
      </main>

      {/* Modal de contact - CORRIGÉ */}
      {showContactForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowContactForm(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
              aria-label="Close"
            >
              <X size={20} className="text-slate-500" />
            </button>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">Contact Seller</h3>
            <p className="text-slate-500 text-sm mb-4">About: <span className="font-semibold">{land.title}</span></p>
            
            {contactSuccess ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center">
                <Mail size={32} className="mx-auto mb-3" />
                <p className="font-semibold text-lg">Message sent!</p>
                <p className="text-sm mt-1">The seller will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={contactData.name}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pc-green"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pc-green"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pc-green"
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Message *</label>
                  <textarea
                    name="message"
                    value={contactData.message}
                    onChange={handleContactChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pc-green resize-none"
                    placeholder="I am interested in this property. Please contact me with more details..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-pc-green text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LandDetailPage;