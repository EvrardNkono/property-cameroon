// frontend/src/services/api.js

// 🔥 Détection automatique de l'environnement
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// URLs en dur selon l'environnement
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'                                    // URL locale
  : 'https://property-cameroon-backend.vercel.app';            // URL de production

const API_URL = `${BACKEND_URL}/api`;

// Pour le debug (optionnel)
if (typeof window !== 'undefined') {
  console.log(`🌍 Environnement: ${isDevelopment ? 'DÉVELOPPEMENT (local)' : 'PRODUCTION (Vercel)'}`);
  console.log(`🔗 Backend URL: ${BACKEND_URL}`);
  console.log(`📡 API URL: ${API_URL}`);
}

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = { ...options.headers };
    
    // Don't set Content-Type for FormData (browser handles it automatically)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ========== AUTHENTICATION ==========
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(userData) {
    const isFormData = userData instanceof FormData;
    
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: isFormData ? userData : JSON.stringify(userData),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // ========== USERS (Admin only) ==========
  async getUsers(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updateUserRoles(id, roles) {
    return this.request(`/users/${id}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ roles }),
    });
  }

  async banUser(id, banReason) {
    return this.request(`/users/${id}/ban`, {
      method: 'PUT',
      body: JSON.stringify({ banReason }),
    });
  }

  async verifyKYC(id, kycStatus) {
    return this.request(`/users/${id}/kyc`, {
      method: 'PUT',
      body: JSON.stringify({ kycStatus }),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // ========== PROFILE (Logged in user) ==========
  async updateMyProfile(userData) {
    return this.request('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async uploadMyAvatar(formData) {
    const response = await fetch(`${API_URL}/profile/me/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });
    return response.json();
  }

  async uploadMyKYCDocument(formData) {
    const response = await fetch(`${API_URL}/profile/me/kyc-document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });
    return response.json();
  }

  async getMyKYCStatus() {
    return this.request('/profile/me/kyc-status');
  }

  // ========== PROPERTIES ==========
  async getProperties(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/properties${query ? `?${query}` : ''}`);
  }

  async getPropertyById(id, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/properties/${id}${query ? `?${query}` : ''}`);
  }

  async createProperty(propertyData) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id, propertyData) {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id) {
    return this.request(`/properties/${id}`, { method: 'DELETE' });
  }

  async getPropertiesByOwner(ownerId) {
    return this.request(`/properties/owner/${ownerId}`);
  }

  // ========== AGRICULTURAL LANDS ==========
  async getAgriculturalLands(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/agriculture${query ? `?${query}` : ''}`);
  }

  async getAgriculturalLandById(id, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/agriculture/${id}${query ? `?${query}` : ''}`);
  }

  async filterAgriculturalByCrop(crop) {
    return this.request(`/agriculture/filter/crop/${crop}`);
  }

  async getAgricultureRegionStats() {
    return this.request('/agriculture/stats/regions');
  }

  async createAgriculturalLand(landData) {
    return this.request('/agriculture', {
      method: 'POST',
      body: JSON.stringify(landData),
    });
  }

  async updateAgriculturalLand(id, landData) {
    return this.request(`/agriculture/${id}`, {
      method: 'PUT',
      body: JSON.stringify(landData),
    });
  }

  async deleteAgriculturalLand(id) {
    return this.request(`/agriculture/${id}`, { method: 'DELETE' });
  }

  // ========== AGRICULTURAL PRODUCTS ==========
  async getAgriculturalProducts(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/agriculture/products${query ? `?${query}` : ''}`);
  }

  async getAgriculturalProductById(id, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/agriculture/products/${id}${query ? `?${query}` : ''}`);
  }

  async getAgriculturalProductsByCategory(category, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/agriculture/products/category/${category}${query ? `?${query}` : ''}`);
  }

  async createAgriculturalProduct(productData) {
    return this.request('/agriculture/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateAgriculturalProduct(id, productData) {
    return this.request(`/agriculture/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteAgriculturalProduct(id) {
    return this.request(`/agriculture/products/${id}`, { method: 'DELETE' });
  }

  // ========== AMENITIES ==========
  async getAllAmenities(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/amenities${query ? `?${query}` : ''}`);
  }

  async getAmenitiesNearProperty(propertyId, radius = 5) {
    return this.request(`/amenities/near/${propertyId}?radius=${radius}`);
  }

  async getAmenityById(id) {
    return this.request(`/amenities/${id}`);
  }

  async createAmenity(amenityData) {
    return this.request('/amenities', {
      method: 'POST',
      body: JSON.stringify(amenityData),
    });
  }

  async updateAmenity(id, amenityData) {
    return this.request(`/amenities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(amenityData),
    });
  }

  async deleteAmenity(id) {
    return this.request(`/amenities/${id}`, { method: 'DELETE' });
  }

  // ========== LIVESTOCK CATEGORIES ==========
  async getAllLivestockCategories(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/livestock-categories${query ? `?${query}` : ''}`);
  }

  async getLivestockCategoryBySlug(slug, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/livestock-categories/slug/${slug}${query ? `?${query}` : ''}`);
  }

  async getLivestockCategoryById(id, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/livestock-categories/${id}${query ? `?${query}` : ''}`);
  }

  async createLivestockCategory(formData) {
    const response = await fetch(`${API_URL}/livestock-categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });
    return response.json();
  }

  async updateLivestockCategory(id, formData) {
    const response = await fetch(`${API_URL}/livestock-categories/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });
    return response.json();
  }

  async deleteLivestockCategory(id) {
    return this.request(`/livestock-categories/${id}`, { method: 'DELETE' });
  }

  // ========== LIVESTOCK ==========
  async getAllLivestock(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/livestock${query ? `?${query}` : ''}`);
  }

  async getLivestockByCategory(category, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/livestock/category/${category}${query ? `?${query}` : ''}`);
  }

  async getLivestockById(id, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/livestock/${id}${query ? `?${query}` : ''}`);
  }

  async getLivestockByOwner(ownerId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/livestock/owner/${ownerId}${query ? `?${query}` : ''}`);
  }

  async createLivestock(data) {
    return this.request('/livestock', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLivestock(id, data) {
    return this.request(`/livestock/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLivestock(id) {
    return this.request(`/livestock/${id}`, { method: 'DELETE' });
  }

  // ========== BLOG POSTS ==========
  async getBlogPosts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/blog${query ? `?${query}` : ''}`);
  }

  async getBlogPost(slug, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/blog/${slug}${query ? `?${query}` : ''}`);
  }

  async getFeaturedPosts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/blog/featured${query ? `?${query}` : ''}`);
  }

  // Admin Blog Methods
  async getAllBlogPostsAdmin() {
    return this.request('/blog/admin/all');
  }

  async createBlogPost(formData) {
    const response = await fetch(`${API_URL}/blog`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });
    return response.json();
  }

  async updateBlogPost(id, formData) {
    const response = await fetch(`${API_URL}/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });
    return response.json();
  }

  async deleteBlogPost(id) {
    return this.request(`/blog/${id}`, { method: 'DELETE' });
  }

  // ========== OPPORTUNITIES ==========
  async getOpportunities(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/opportunities${query ? `?${query}` : ''}`);
  }

  async getOpportunityById(id, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/opportunities/${id}${query ? `?${query}` : ''}`);
  }

  // Admin Opportunities Methods
  async createOpportunity(opportunityData) {
    return this.request('/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    });
  }

  async updateOpportunity(id, opportunityData) {
    return this.request(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(opportunityData),
    });
  }

  async deleteOpportunity(id) {
    return this.request(`/opportunities/${id}`, { method: 'DELETE' });
  }

  // ========== INQUIRIES ==========
  async createInquiry(inquiryData) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  }

  async getInquiries(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/inquiries${query ? `?${query}` : ''}`);
  }

  // ========== TRANSACTIONS ==========
  async getTransactions() {
    return this.request('/transactions');
  }

  async getTransactionById(id) {
    return this.request(`/transactions/${id}`);
  }

  async createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  // ========== INVESTMENTS ==========
  async getInvestments() {
    return this.request('/investments');
  }

  async getInvestmentById(id) {
    return this.request(`/investments/${id}`);
  }

  async createInvestment(investmentData) {
    return this.request('/investments', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    });
  }

  // ========== DOCUMENTS ==========
  async getDocuments() {
    return this.request('/documents');
  }

  async getDocumentById(id) {
    return this.request(`/documents/${id}`);
  }

  async uploadDocument(formData) {
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });
    return response.json();
  }

  async deleteDocument(id) {
    return this.request(`/documents/${id}`, { method: 'DELETE' });
  }

  // ========== SHIPMENTS ==========
  async getShipments() {
    return this.request('/shipments');
  }

  async getShipmentById(id) {
    return this.request(`/shipments/${id}`);
  }

  async createShipment(shipmentData) {
    return this.request('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    });
  }

  async updateShipmentStatus(id, status, progress) {
    return this.request(`/shipments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, progress }),
    });
  }

  async deleteShipment(id) {
    return this.request(`/shipments/${id}`, { method: 'DELETE' });
  }

  // ========== GENERIC METHODS ==========
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`${endpoint}${query ? `?${query}` : ''}`);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async del(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();