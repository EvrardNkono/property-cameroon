import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Real Estate', 'Agriculture', 'Sourcing', 'Lifestyle'];

  const posts = [
    {
      id: 1,
      category: 'Real Estate',
      title: "Securing Your Land Title in Cameroon: The 2026 Comprehensive Guide",
      excerpt: "Everything you need to know to avoid land disputes and invest with complete peace of mind...",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80",
      date: "April 12, 2026",
      author: "Admin"
    },
    {
      id: 2,
      category: 'Agriculture',
      title: "The Rise of Pig Farming: Why You Should Invest Now",
      excerpt: "A deep dive into the local market analysis and profitability opportunities for the upcoming season...",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80",
      date: "April 10, 2026",
      author: "Agro Expert"
    },
    {
      id: 3,
      category: 'Sourcing',
      title: "Importing Chinese Machinery: Avoid These 5 Common Mistakes",
      excerpt: "How to verify supplier reliability and ensure quality control before shipment...",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
      date: "April 08, 2026",
      author: "Sourcing Team"
    }
  ];

  const opportunities = [
    {
      id: 1,
      title: "Secured Agricultural Land - 5 Hectares",
      location: "Central Cameroon",
      roi: "12% Estimated Annual ROI"
    },
    {
      id: 2,
      title: "Turnkey Pig Farming Project",
      location: "West Cameroon",
      roi: "18% Potential ROI"
    }
  ];

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative h-[80vh] flex items-center justify-center text-center pt-20">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
          className="absolute w-full h-full object-cover"
          alt="Cameroon Landscape"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-white px-6">
          <h1 className="text-4xl md:text-6xl font-serif italic mb-6">
            Invest in Cameroon <br /> Without Compromise
          </h1>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Real Estate, Agriculture, and International Sourcing — a secure and profitable approach for the modern investor.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-pc-gold px-6 py-3 text-[10px] uppercase font-bold tracking-widest text-slate-900">
              Explore Now
            </button>
            <button className="border border-white px-6 py-3 text-[10px] uppercase tracking-widest">
              Diaspora Portal
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

        {/* CAPEF PARTNERSHIP SECTION */}
        <div className="bg-white border border-slate-100 p-10 mb-20 shadow-sm">
          <h2 className="text-3xl font-serif italic mb-4">
            Strategic Partnership with CAPEF
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            We work closely with the Chamber of Agriculture, Fisheries, Livestock and Forests (CAPEF) to guarantee 
            secured and profitable agricultural investments, managed by certified local experts.
          </p>
          <button className="bg-pc-green text-white px-6 py-3 text-[10px] uppercase font-bold tracking-widest">
            Learn More
          </button>
        </div>

        {/* DIASPORA SECTION */}
        <div className="bg-slate-900 text-white p-16 mb-20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-serif italic mb-6">
              Invest from Abroad with Confidence
            </h2>
            <p className="text-slate-300 max-w-2xl leading-relaxed">
              We manage, secure, and develop your investments in Cameroon. 
              Leveraging our local expertise: you invest, we execute.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pc-gold opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* OPPORTUNITIES SECTION */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-serif italic">Current Opportunities</h2>
            <div className="h-[1px] flex-1 bg-slate-100"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {opportunities.map((op) => (
              <div key={op.id} className="border border-slate-100 p-8 group hover:border-pc-gold transition-colors duration-500">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-pc-gold transition-colors">{op.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{op.location}</p>
                <div className="flex justify-between items-center">
                    <p className="text-pc-green font-bold tracking-tighter">{op.roi}</p>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOG HEADER */}
        <div className="mb-16">
          <p className="text-pc-gold text-[10px] uppercase font-bold tracking-[0.4em] mb-4">The Journal</p>
          <h2 className="text-4xl font-serif italic">Insights & Expertise</h2>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex gap-4 mb-12 flex-wrap border-b border-slate-50 pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white rounded-full'
                  : 'text-slate-400 hover:text-pc-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* POSTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group">
              <div className="aspect-video overflow-hidden mb-6 bg-slate-100">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
              </div>
              <p className="text-[9px] text-pc-gold uppercase font-bold tracking-widest mb-3">{post.category}</p>
              <h3 className="text-xl font-serif italic text-slate-900 mb-3 group-hover:text-pc-green transition-colors">{post.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 italic leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>

        {/* FINAL CTA */}
        <div className="mt-32 bg-slate-50 p-16 text-center border border-slate-100">
          <h2 className="text-3xl font-serif italic mb-6">
            Ready to Invest Smartly?
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-slate-900 text-white px-10 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-pc-green transition-all">
              Talk to an Expert
            </button>
            <button className="border border-slate-900 text-slate-900 px-10 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-slate-900 hover:text-white transition-all">
              View Opportunities
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Blog;