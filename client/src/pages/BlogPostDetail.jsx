// frontend/src/pages/BlogPostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Heart, 
  Share2, 
  Clock,
  Eye,
  MessageCircle,
  ChevronRight,
  Loader2,
  AlertCircle,
  Mail,
  CheckCircle,
  BookOpen,
  ThumbsUp,
  Link as LinkIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

// Hook pour récupérer la langue actuelle
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  
  return lang;
};

// ========== ARTICLE EN DUR ==========
const getHardcodedArticle = (lang) => {
  const isFrench = lang === 'fr';
  
  return {
    id: 'featured-performance',
    slug: 'performance-immobiliere-266',
    category: 'Real Estate',
    title: isFrench 
      ? "Investissement Immobilier : Une Plus-Value Exceptionnelle de +266% en 6 Mois !"
      : "Real Estate Investment: An Exceptional +266% Capital Gain in 6 Months!",
    excerpt: isFrench
      ? "Le marché immobilier camerounais confirme une fois de plus son statut de valeur refuge et de moteur de croissance pour les investisseurs avisés. Chez Property Cameroun, nous venons d'en faire la démonstration concrète sur un projet de lotissement stratégique."
      : "The Cameroonian real estate market once again confirms its status as a safe haven and growth engine for savvy investors. At Property Cameroun, we have just demonstrated this concretely on a strategic subdivision project.",
    image: "/images/propertycameroun.png",
    date: isFrench ? "15 Juillet 2026" : "July 15, 2026",
    author: "Property Cameroun",
    isFeatured: true,
    isHardcoded: true,
    views: 2847,
    tags: ['Immobilier', 'Investissement', 'Plus-Value', 'Cameroun'],
    performanceData: {
      acquisitionPrice: "1 500 FCFA/m²",
      currentPrice: "5 500 FCFA/m²",
      valueGain: "4 000 FCFA/m²",
      percentageGain: "+266,6 %"
    },
    content: `
      <p>${isFrench ? 'Le marché immobilier camerounais confirme une fois de plus son statut de valeur refuge et de moteur de croissance pour les investisseurs avisés. Chez Property Cameroun, nous venons d\'en faire la démonstration concrète sur un projet de lotissement stratégique.' : 'The Cameroonian real estate market once again confirms its status as a safe haven and growth engine for savvy investors. At Property Cameroun, we have just demonstrated this concretely on a strategic subdivision project.'}</p>
      
      <h2>${isFrench ? 'L\'Analyse de la Performance' : 'Performance Analysis'}</h2>
      <p>${isFrench ? 'Il y a seulement six mois, en janvier 2026, nous travaillions sur l\'aménagement d\'une parcelle de 4 hectares. À cette période, le prix du mètre carré était fixé à 1 500 FCFA.' : 'Just six months ago, in January 2026, we were working on the development of a 4-hectare plot. At that time, the price per square meter was set at 1,500 FCFA.'}</p>
      <p>${isFrench ? 'Aujourd\'hui, en juillet 2026, la donne a radicalement changé. Grâce à notre stratégie de développement et à l\'attractivité croissante de la zone, le prix du mètre carré se négocie désormais entre 5 000 FCFA et 6 000 FCFA.' : 'Today, in June 2026, the situation has radically changed. Thanks to our development strategy and the growing attractiveness of the area, the price per square meter now ranges between 5,000 FCFA and 6,000 FCFA.'}</p>
      
      <h3>${isFrench ? 'Le Bilan Chiffré' : 'The Financial Summary'}</h3>
      <p>${isFrench ? 'Si l\'on prend la moyenne de notre nouvelle valeur de marché (5 500 FCFA/m²), voici l\'évolution de la rentabilité :' : 'Taking the average of our new market value (5,500 FCFA/m²), here is the evolution of profitability:'}</p>
      
      <div class="bg-slate-50 rounded-xl p-6 my-6">
        <ul class="list-none space-y-3">
          <li><strong>${isFrench ? 'Prix d\'acquisition (Janvier)' : 'Acquisition Price (January)'} :</strong> 1 500 FCFA/m²</li>
          <li><strong>${isFrench ? 'Prix actuel du marché (Juillet)' : 'Current Market Price (July)'} :</strong> 5 500 FCFA/m²</li>
          <li><strong>${isFrench ? 'Gain de valeur par m²' : 'Value Gain per m²'} :</strong> 4 000 FCFA</li>
          <li><strong>${isFrench ? 'Pourcentage de bénéfice brut' : 'Gross Profit Percentage'} :</strong> <span class="text-emerald-600 font-bold">+266,6 %</span></li>
        </ul>
      </div>
      
      <h3>${isFrench ? 'Pourquoi un tel succès ?' : 'Why such success?'}</h3>
      <p>${isFrench ? 'Cette appréciation de 266 % en un semestre n\'est pas le fruit du hasard. Elle résulte de notre expertise dans le choix des emplacements, l\'anticipation du développement urbain et la mise en valeur méthodique de nos parcelles.' : 'This 266% appreciation in six months is no coincidence. It results from our expertise in location selection, anticipation of urban development, and the methodical development of our plots.'}</p>
      
      <div class="bg-pc-gold/10 border-l-4 border-pc-gold p-6 my-8 rounded-r-xl">
        <p class="font-bold text-slate-800 italic text-lg">"${isFrench ? 'Investir dans la terre reste l\'un des moyens les plus sûrs et les plus lucratifs pour bâtir un patrimoine solide au Cameroun.' : 'Investing in land remains one of the safest and most lucrative ways to build solid wealth in Cameroon.'}"</p>
      </div>
      
      <p>${isFrench ? 'Vous souhaitez profiter des prochaines opportunités avant que le marché ne sature ?' : 'Want to take advantage of upcoming opportunities before the market saturates?'}</p>
      <p><strong>${isFrench ? 'Contactez Property Cameroun dès aujourd\'hui pour découvrir nos prochains projets.' : 'Contact Property Cameroun today to discover our next projects.'}</strong></p>
    `
  };
};

const BlogPostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const currentLang = useCurrentLang();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Traductions
  const t = {
    fr: {
      backToBlog: "Retour au blog",
      publishedOn: "Publié le",
      by: "Par",
      readTime: "Temps de lecture",
      minutes: "min",
      tags: "Tags",
      share: "Partager",
      like: "J'aime",
      relatedArticles: "Articles similaires",
      readMore: "Lire la suite",
      errorTitle: "Article non trouvé",
      errorMessage: "Désolé, l'article que vous recherchez n'existe pas ou a été déplacé.",
      backToHome: "Retour à l'accueil",
      goToBlog: "Voir tous les articles",
      loading: "Chargement de l'article...",
      views: "vues",
      copied: "Lien copié !",
      performanceSummary: "Résumé de la Performance",
      featured: "À la une",
      acquisitionPrice: "Prix d'acquisition",
      currentMarketPrice: "Prix actuel du marché",
      valueGain: "Gain de valeur",
      percentageGain: "Bénéfice brut",
      readyToInvest: "Prêt à investir au Cameroun ?",
      expertGuide: "Nos experts sont là pour vous guider dans vos projets d'investissement.",
      talkToExpert: "Parler à un expert",
      exploreOpportunities: "Explorer les opportunités"
    },
    en: {
      backToBlog: "Back to blog",
      publishedOn: "Published on",
      by: "By",
      readTime: "Read time",
      minutes: "min",
      tags: "Tags",
      share: "Share",
      like: "Like",
      relatedArticles: "Related articles",
      readMore: "Read more",
      errorTitle: "Article not found",
      errorMessage: "Sorry, the article you're looking for doesn't exist or has been moved.",
      backToHome: "Back to home",
      goToBlog: "View all articles",
      loading: "Loading article...",
      views: "views",
      copied: "Link copied!",
      performanceSummary: "Performance Summary",
      featured: "Featured",
      acquisitionPrice: "Acquisition Price",
      currentMarketPrice: "Current Market Price",
      valueGain: "Value Gain",
      percentageGain: "Gross Profit",
      readyToInvest: "Ready to invest in Cameroon?",
      expertGuide: "Our experts are here to guide you in your investment projects.",
      talkToExpert: "Talk to an expert",
      exploreOpportunities: "Explore opportunities"
    }
  }[currentLang] || {
    backToBlog: "Retour au blog",
    publishedOn: "Publié le",
    by: "Par",
    readTime: "Temps de lecture",
    minutes: "min",
    tags: "Tags",
    share: "Partager",
    like: "J'aime",
    relatedArticles: "Articles similaires",
    readMore: "Lire la suite",
    errorTitle: "Article non trouvé",
    errorMessage: "Désolé, l'article que vous recherchez n'existe pas ou a été déplacé.",
    backToHome: "Retour à l'accueil",
    goToBlog: "Voir tous les articles",
    loading: "Chargement de l'article...",
    views: "vues",
    copied: "Lien copié !",
    performanceSummary: "Résumé de la Performance",
    featured: "À la une",
    acquisitionPrice: "Prix d'acquisition",
    currentMarketPrice: "Prix actuel du marché",
    valueGain: "Gain de valeur",
    percentageGain: "Bénéfice brut",
    readyToInvest: "Prêt à investir au Cameroun ?",
    expertGuide: "Nos experts sont là pour vous guider dans vos projets d'investissement.",
    talkToExpert: "Parler à un expert",
    exploreOpportunities: "Explorer les opportunités"
  };

  // Vérifier si c'est l'article en dur
  const isHardcodedSlug = (slug) => {
    return slug === 'performance-immobiliere-266' || slug === 'performance-immobiliere-266-en';
  };

  // Charger l'article
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Vérifier si c'est l'article en dur
        if (isHardcodedSlug(slug)) {
          const hardcodedPost = getHardcodedArticle(currentLang);
          setPost(hardcodedPost);
          
          // Charger des articles similaires depuis l'API ou fallback
          try {
            const response = await api.get(`/blog?category=Real Estate&limit=3&lang=${currentLang}`);
            if (response.success && response.data) {
              const filtered = response.data.filter(p => p.id !== hardcodedPost.id);
              setRelatedPosts(filtered.slice(0, 3));
            }
          } catch (err) {
            // Fallback articles
            setRelatedPosts([
              {
                id: '1',
                slug: 'securiser-titre-foncier-cameroun',
                title: currentLang === 'fr' ? "Sécuriser votre Titre Foncier au Cameroun : Le Guide Complet 2026" : "Securing Your Land Title in Cameroon: The 2026 Comprehensive Guide",
                image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80",
                category: "Real Estate",
                date: currentLang === 'fr' ? "12 Avril 2026" : "April 12, 2026",
                content: ""
              },
              {
                id: '2',
                slug: 'essor-elevage-porcin',
                title: currentLang === 'fr' ? "L'essor de l'Élevage Porcin : Pourquoi Investir Maintenant" : "The Rise of Pig Farming: Why You Should Invest Now",
                image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80",
                category: "Agriculture",
                date: currentLang === 'fr' ? "10 Avril 2026" : "April 10, 2026",
                content: ""
              }
            ]);
          }
          
          setLoading(false);
          return;
        }

        // Sinon, charger depuis l'API
        const response = await api.get(`/blog/${slug}?lang=${currentLang}`);
        if (response.success) {
          setPost(response.data);
          
          // Charger les articles similaires
          if (response.data.category) {
            const relatedResponse = await api.get(`/blog?category=${response.data.category}&limit=3&lang=${currentLang}`);
            if (relatedResponse.success) {
              const filtered = relatedResponse.data.filter(p => p.id !== response.data.id);
              setRelatedPosts(filtered.slice(0, 3));
            }
          }
        } else {
          throw new Error(response.message || 'Article non trouvé');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        
        // Vérifier si c'est l'article en dur (fallback)
        if (isHardcodedSlug(slug)) {
          setPost(getHardcodedArticle(currentLang));
          setError(null);
        } else {
          setError(err.message || 'Impossible de charger l\'article');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug, currentLang]);
  
  // Calculer le temps de lecture estimé
  const getReadTime = (content) => {
    if (!content) return 3;
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes);
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Obtenir la couleur de la catégorie
  const getCategoryColor = (category) => {
    const colors = {
      'Real Estate': 'bg-blue-100 text-blue-700 border-blue-200',
      'Agriculture': 'bg-green-100 text-green-700 border-green-200',
      'Sourcing': 'bg-purple-100 text-purple-700 border-purple-200',
      'Lifestyle': 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };
  
  // Partager sur les réseaux sociaux
  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = encodeURIComponent(post?.title || '');
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${title}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert(t.copied);
        setShowShareMenu(false);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };
  
  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 size={48} className="text-pc-gold animate-spin mb-4" />
          <p className="text-gray-500 text-sm">{t.loading}</p>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-serif text-slate-800 mb-3">{t.errorTitle}</h1>
          <p className="text-slate-500 mb-8">{t.errorMessage}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {t.backToHome}
            </Link>
            <Link
              to="/blog"
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg hover:border-pc-gold hover:text-pc-gold transition-colors"
            >
              {t.goToBlog}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const readTime = getReadTime(post.content);
  const isHardcoded = post.isHardcoded || false;
  
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section avec image de couverture */}
      <div className="relative h-[50vh] min-h-[400px] flex items-end pb-16">
        <div className="absolute inset-0">
          <img
            src={post.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000'}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            {t.backToBlog}
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
            {post.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                {t.featured}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{t.by} {post.author?.name || post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{post.date || formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{readTime} {t.minutes}</span>
            </div>
            {post.views > 0 && (
              <div className="flex items-center gap-2">
                <Eye size={14} />
                <span>{post.views} {t.views}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Contenu de l'article */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Barre latérale gauche - Actions */}
          <div className="lg:w-16 order-1 lg:order-none">
            <div className="sticky top-32 flex lg:flex-col items-center gap-4 lg:gap-6">
              {/* Like button */}
              <button
                onClick={() => setLiked(!liked)}
                className={`p-3 rounded-full transition-all ${
                  liked 
                    ? 'bg-red-50 text-red-500 scale-110' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                <Heart size={20} className={liked ? 'fill-red-500' : ''} />
              </button>
              
              {/* Share button with menu */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={20} />
                </button>
                
                {showShareMenu && (
                  <div className="absolute lg:left-full lg:top-0 lg:ml-2 left-0 top-full mt-2 lg:mt-0 bg-white rounded-xl shadow-lg border border-slate-100 p-2 z-20">
                    <button
                      onClick={() => shareOnSocial('facebook')}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full"
                    >
                      <span className="w-4 text-center">📘</span>
                      Facebook
                    </button>
                    <button
                      onClick={() => shareOnSocial('twitter')}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full"
                    >
                      <span className="w-4 text-center">🐦</span>
                      Twitter
                    </button>
                    <button
                      onClick={() => shareOnSocial('linkedin')}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full"
                    >
                      <span className="w-4 text-center">💼</span>
                      LinkedIn
                    </button>
                    <button
                      onClick={() => shareOnSocial('email')}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full"
                    >
                      <Mail size={16} className="text-gray-500" />
                      Email
                    </button>
                    <button
                      onClick={() => shareOnSocial('copy')}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full border-t border-slate-100 mt-1 pt-2"
                    >
                      <LinkIcon size={16} />
                      Copier le lien
                    </button>
                  </div>
                )}
              </div>
              
              {/* Contact expert */}
              <Link
                to="/experts"
                className="p-3 rounded-full bg-pc-gold/10 text-pc-gold hover:bg-pc-gold/20 transition-colors"
              >
                <MessageCircle size={20} />
              </Link>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="flex-1 max-w-2xl">
            {/* Résumé */}
            {post.excerpt && (
              <div className="mb-8 p-6 bg-amber-50 border-l-4 border-pc-gold rounded-r-xl">
                <p className="text-slate-700 italic leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            )}
            
            {/* Performance Stats (pour l'article en dur) */}
            {isHardcoded && post.performanceData && (
              <div className="mb-8 bg-gradient-to-r from-pc-gold/10 to-emerald-50 rounded-2xl p-6 border border-pc-gold/20">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  📊 {t.performanceSummary}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-[8px] text-slate-400 uppercase font-bold">{t.acquisitionPrice}</p>
                    <p className="text-lg font-bold text-slate-800">{post.performanceData.acquisitionPrice}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-pc-gold/20">
                    <p className="text-[8px] text-slate-400 uppercase font-bold">{t.currentMarketPrice}</p>
                    <p className="text-lg font-bold text-pc-gold">{post.performanceData.currentPrice}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-[8px] text-slate-400 uppercase font-bold">{t.valueGain}</p>
                    <p className="text-lg font-bold text-emerald-600">{post.performanceData.valueGain}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm bg-emerald-50 border border-emerald-200">
                    <p className="text-[8px] text-slate-400 uppercase font-bold">{t.percentageGain}</p>
                    <p className="text-lg font-bold text-emerald-600">{post.performanceData.percentageGain}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contenu HTML */}
            <div 
              className="prose prose-lg prose-slate max-w-none blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">{t.tags}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-pc-gold hover:text-white transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Auteur */}
            <div className="mt-10 p-6 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-pc-gold/20 flex items-center justify-center">
                  <User size={24} className="text-pc-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{post.author?.name || post.author}</h3>
                  <p className="text-sm text-slate-500">
                    Expert chez Property Cameroon
                  </p>
                </div>
              </div>
              {post.author?.bio && (
                <p className="mt-3 text-sm text-slate-600">{post.author.bio}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Articles similaires */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-100">
            <h2 className="text-2xl font-serif text-slate-800 mb-8">{t.relatedArticles}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group block"
                >
                  <div className="aspect-video overflow-hidden rounded-xl mb-3">
                    <img
                      src={relatedPost.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000'}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000';
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-pc-gold uppercase font-bold tracking-wider mb-2">
                    {relatedPost.category}
                  </p>
                  <h3 className="font-serif text-slate-800 group-hover:text-pc-gold transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <Calendar size={12} />
                    <span>{relatedPost.date || formatDate(relatedPost.publishedAt)}</span>
                    <span>•</span>
                    <Clock size={12} />
                    <span>{getReadTime(relatedPost.content)} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
          <BookOpen size={32} className="mx-auto mb-4 text-pc-gold" />
          <h3 className="text-xl font-serif mb-2">{t.readyToInvest}</h3>
          <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
            {t.expertGuide}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book-appointment"
              className="px-6 py-3 bg-pc-gold text-slate-900 rounded-lg font-medium hover:bg-pc-gold/90 transition-colors"
            >
              {t.talkToExpert}
            </Link>
            <Link
              to="/real-estate"
              className="px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              {t.exploreOpportunities}
            </Link>
          </div>
        </div>
      </div>
      
      <style>{`
        .blog-content h2 {
          font-size: 1.75rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-family: serif;
          color: #1e293b;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-family: serif;
          color: #334155;
        }
        .blog-content p {
          margin-bottom: 1.25rem;
          line-height: 1.75;
          color: #475569;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #475569;
        }
        .blog-content a {
          color: #c5a059;
          text-decoration: underline;
        }
        .blog-content a:hover {
          color: #b08a4a;
        }
        .blog-content blockquote {
          border-left: 4px solid #c5a059;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #64748b;
        }
        .blog-content img {
          border-radius: 0.75rem;
          margin: 1.5rem 0;
          max-width: 100%;
          height: auto;
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .blog-content th, .blog-content td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          text-align: left;
        }
        .blog-content th {
          background-color: #f8fafc;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default BlogPostDetail;