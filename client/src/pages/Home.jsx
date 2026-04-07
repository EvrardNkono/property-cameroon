import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Conteneur pour limiter la largeur des sections sur très grands écrans */}
        <div className="max-w-[1600px] mx-auto">
          <StatsBar />

          {/* Section de réassurance : Responsive Text */}
          <section className="py-16 md:py-32 bg-white text-center">
            <div className="max-w-2xl mx-auto px-6">
              <h3 className="text-xl md:text-3xl font-serif text-slate-900 mb-8 italic leading-snug">
                "L'excellence n'est pas un acte, <br className="hidden md:block" /> c'est une habitude."
              </h3>
              <div className="w-16 h-[1px] bg-pc-gold mx-auto opacity-50"></div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;