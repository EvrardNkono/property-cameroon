// client/src/services/ContentService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ContentService {
  constructor() {
    this.cache = new Map();
  }

  // Récupérer un contenu spécifique
  async getContent(contentType, contentId, locale = null) {
    const currentLocale = locale || localStorage.getItem('i18nextLng') || 'fr';
    const cacheKey = `${contentType}_${contentId}_${currentLocale}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    try {
      const response = await fetch(`${API_URL}/api/translatable/${contentType}/${contentId}?locale=${currentLocale}`);
      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
      return null;
    }
  }

  // Récupérer tous les contenus d'un type
  async getAllContents(contentType, page = 1, limit = 10, locale = null) {
    const currentLocale = locale || localStorage.getItem('i18nextLng') || 'fr';
    const cacheKey = `${contentType}_list_${page}_${currentLocale}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    try {
      const response = await fetch(`${API_URL}/api/translatable/${contentType}?locale=${currentLocale}&page=${page}&limit=${limit}`);
      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erreur chargement liste:', error);
      return { contents: [], pagination: {} };
    }
  }

  // Créer un contenu
  async createContent(contentType, frData, enData, metadata, media) {
    try {
      const response = await fetch(`${API_URL}/api/translatable/${contentType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frData, enData, metadata, media })
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur création:', error);
      return null;
    }
  }

  // Mettre à jour un contenu
  async updateContent(contentType, contentId, frData, enData, metadata, media) {
    try {
      const response = await fetch(`${API_URL}/api/translatable/${contentType}/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frData, enData, metadata, media })
      });
      // Invalider le cache
      this.cache.clear();
      return await response.json();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      return null;
    }
  }

  // Traduction automatique
  async autoTranslate(contentType, contentId, targetLocale) {
    try {
      const response = await fetch(`${API_URL}/api/translatable/auto-translate/${contentType}/${contentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetLocale })
      });
      this.cache.clear();
      return await response.json();
    } catch (error) {
      console.error('Erreur traduction auto:', error);
      return null;
    }
  }
}

export default new ContentService();