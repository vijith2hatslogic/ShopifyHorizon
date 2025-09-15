/**
 * Personalized Recommendations Plugin
 * AI-powered product recommendations for sailing stickers store
 */

class PersonalizedRecommendations {
  constructor() {
    this.userPreferences = this.loadUserPreferences();
    this.browsingHistory = this.loadBrowsingHistory();
    this.recommendationEngine = new RecommendationEngine();
    this.init();
  }

  init() {
    this.createUI();
    this.trackUserBehavior();
    this.generateRecommendations();
    this.setupEventListeners();
  }

  createUI() {
    const container = document.createElement('div');
    container.id = 'personalized-recommendations';
    container.innerHTML = `
      <div class="recommendations-panel">
        <div class="recommendations-header">
          <h3>🧭 Personalized Recommendations</h3>
          <button class="recommendations-close-btn" onclick="this.closest('.recommendations-panel').style.display='none'">×</button>
        </div>
        <div class="recommendations-content">
          <div class="user-profile">
            <div class="profile-summary">
              <h4>Your Sailing Profile</h4>
              <div class="profile-stats">
                <div class="stat">
                  <span class="stat-label">Sailing Style:</span>
                  <span class="stat-value" id="sailing-style">Classic</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Preferred Colors:</span>
                  <span class="stat-value" id="preferred-colors">Navy & White</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Activity Level:</span>
                  <span class="stat-value" id="activity-level">Moderate</span>
                </div>
              </div>
            </div>
          </div>

          <div class="recommendation-sections">
            <div class="recommendation-section">
              <h4>⚓ For You</h4>
              <div class="recommendation-grid" id="for-you-grid">
                <!-- Dynamic content -->
              </div>
            </div>

            <div class="recommendation-section">
              <h4>🌊 Trending in Sailing</h4>
              <div class="recommendation-grid" id="trending-grid">
                <!-- Dynamic content -->
              </div>
            </div>

            <div class="recommendation-section">
              <h4>🎯 Complete Your Look</h4>
              <div class="recommendation-grid" id="complete-look-grid">
                <!-- Dynamic content -->
              </div>
            </div>
          </div>

          <div class="recommendation-controls">
            <button class="refresh-recommendations-btn" onclick="personalizedRecs.refreshRecommendations()">
              <span class="btn-icon">🔄</span>
              Refresh Recommendations
            </button>
            <button class="preferences-btn" onclick="personalizedRecs.showPreferences()">
              <span class="btn-icon">⚙️</span>
              Update Preferences
            </button>
          </div>

          <div class="preferences-modal" style="display: none;">
            <div class="preferences-content">
              <h4>Customize Your Recommendations</h4>
              <div class="preference-group">
                <label>Sailing Style:</label>
                <select id="sailing-style-pref">
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="vintage">Vintage</option>
                  <option value="minimalist">Minimalist</option>
                </select>
              </div>
              <div class="preference-group">
                <label>Preferred Colors:</label>
                <div class="color-options">
                  <label><input type="checkbox" value="navy"> Navy</label>
                  <label><input type="checkbox" value="white"> White</label>
                  <label><input type="checkbox" value="red"> Red</label>
                  <label><input type="checkbox" value="blue"> Blue</label>
                  <label><input type="checkbox" value="green"> Green</label>
                </div>
              </div>
              <div class="preference-group">
                <label>Price Range:</label>
                <select id="price-range-pref">
                  <option value="budget">$5-15</option>
                  <option value="mid">$15-25</option>
                  <option value="premium">$25+</option>
                </select>
              </div>
              <div class="preference-actions">
                <button class="save-preferences-btn" onclick="personalizedRecs.savePreferences()">Save</button>
                <button class="cancel-preferences-btn" onclick="personalizedRecs.hidePreferences()">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const styles = document.createElement('style');
    styles.textContent = `
      .recommendations-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #1e3a8a;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(30, 58, 138, 0.3);
        z-index: 10000;
        width: 90%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: 'Work Sans', sans-serif;
      }

      .recommendations-header {
        background: linear-gradient(135deg, #1e3a8a, #1e40af);
        color: white;
        padding: 16px 20px;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .recommendations-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .recommendations-close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .recommendations-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .recommendations-content {
        padding: 20px;
      }

      .user-profile {
        background: #f0f4ff;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .profile-summary h4 {
        margin: 0 0 12px 0;
        color: #1e3a8a;
        font-size: 16px;
      }

      .profile-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }

      .stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .stat-label {
        font-weight: 500;
        color: #1e3a8a;
      }

      .stat-value {
        font-weight: 600;
        color: #1e40af;
      }

      .recommendation-sections {
        margin-bottom: 20px;
      }

      .recommendation-section {
        margin-bottom: 24px;
      }

      .recommendation-section h4 {
        margin: 0 0 12px 0;
        color: #1e3a8a;
        font-size: 16px;
        border-bottom: 2px solid #e0e7ff;
        padding-bottom: 8px;
      }

      .recommendation-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
      }

      .recommendation-item {
        background: white;
        border: 2px solid #e0e7ff;
        border-radius: 8px;
        padding: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }

      .recommendation-item:hover {
        border-color: #1e3a8a;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(30, 58, 138, 0.2);
      }

      .recommendation-item img {
        width: 100%;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 8px;
      }

      .recommendation-item h5 {
        margin: 0 0 4px 0;
        font-size: 12px;
        color: #1e3a8a;
        font-weight: 600;
      }

      .recommendation-item .price {
        font-size: 14px;
        font-weight: 600;
        color: #1e40af;
      }

      .recommendation-item .match-score {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #10b981;
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        font-weight: 600;
      }

      .recommendation-controls {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .recommendation-controls button {
        padding: 12px 20px;
        border: 2px solid #1e3a8a;
        border-radius: 8px;
        background: white;
        color: #1e3a8a;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
      }

      .recommendation-controls button:hover {
        background: #1e3a8a;
        color: white;
      }

      .preferences-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .preferences-content {
        background: white;
        padding: 24px;
        border-radius: 12px;
        width: 90%;
        max-width: 400px;
        border: 2px solid #1e3a8a;
      }

      .preferences-content h4 {
        margin: 0 0 20px 0;
        color: #1e3a8a;
        text-align: center;
      }

      .preference-group {
        margin-bottom: 16px;
      }

      .preference-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #1e3a8a;
      }

      .preference-group select {
        width: 100%;
        padding: 8px 12px;
        border: 2px solid #e0e7ff;
        border-radius: 6px;
        font-size: 14px;
      }

      .color-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .color-options label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        margin-bottom: 0;
      }

      .preference-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 20px;
      }

      .preference-actions button {
        padding: 10px 20px;
        border: 2px solid #1e3a8a;
        border-radius: 6px;
        background: white;
        color: #1e3a8a;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .preference-actions button:hover {
        background: #1e3a8a;
        color: white;
      }

      .save-preferences-btn {
        background: #1e3a8a !important;
        color: white !important;
      }

      .save-preferences-btn:hover {
        background: #1e40af !important;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(container);
  }

  loadUserPreferences() {
    const saved = localStorage.getItem('sailing-store-preferences');
    return saved ? JSON.parse(saved) : {
      sailingStyle: 'classic',
      preferredColors: ['navy', 'white'],
      priceRange: 'mid',
      activityLevel: 'moderate'
    };
  }

  loadBrowsingHistory() {
    const saved = localStorage.getItem('sailing-store-history');
    return saved ? JSON.parse(saved) : [];
  }

  saveUserPreferences() {
    localStorage.setItem('sailing-store-preferences', JSON.stringify(this.userPreferences));
  }

  saveBrowsingHistory() {
    localStorage.setItem('sailing-store-history', JSON.stringify(this.browsingHistory));
  }

  trackUserBehavior() {
    // Track page views
    this.trackPageView();
    
    // Track product views
    this.trackProductViews();
    
    // Track cart additions
    this.trackCartAdditions();
    
    // Track time spent on pages
    this.trackTimeSpent();
  }

  trackPageView() {
    const currentPage = window.location.pathname;
    const timestamp = Date.now();
    
    this.browsingHistory.push({
      type: 'page_view',
      page: currentPage,
      timestamp: timestamp
    });
    
    this.saveBrowsingHistory();
  }

  trackProductViews() {
    const productImages = document.querySelectorAll('img[alt*="sticker"], img[alt*="sailing"], img[alt*="nautical"]');
    productImages.forEach(img => {
      img.addEventListener('click', () => {
        const productName = img.alt || 'Unknown Product';
        this.browsingHistory.push({
          type: 'product_view',
          product: productName,
          timestamp: Date.now()
        });
        this.saveBrowsingHistory();
      });
    });
  }

  trackCartAdditions() {
    const addToCartButtons = document.querySelectorAll('button[type="submit"], .btn[href*="cart"]');
    addToCartButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.browsingHistory.push({
          type: 'cart_addition',
          timestamp: Date.now()
        });
        this.saveBrowsingHistory();
      });
    });
  }

  trackTimeSpent() {
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeSpent = Date.now() - startTime;
      this.browsingHistory.push({
        type: 'time_spent',
        duration: timeSpent,
        page: window.location.pathname,
        timestamp: Date.now()
      });
      this.saveBrowsingHistory();
    });
  }

  generateRecommendations() {
    const recommendations = this.recommendationEngine.generateRecommendations(
      this.userPreferences,
      this.browsingHistory
    );
    
    this.displayRecommendations(recommendations);
    this.updateUserProfile();
  }

  displayRecommendations(recommendations) {
    this.displayRecommendationSection('for-you-grid', recommendations.forYou, 'For You');
    this.displayRecommendationSection('trending-grid', recommendations.trending, 'Trending');
    this.displayRecommendationSection('complete-look-grid', recommendations.completeLook, 'Complete Your Look');
  }

  displayRecommendationSection(containerId, items, sectionTitle) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'recommendation-item';
      itemElement.innerHTML = `
        <div class="match-score">${item.matchScore}%</div>
        <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNmMGY0ZmYiLz48dGV4dCB4PSI1MCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzFlM2E4YSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3RpY2tlcjwvdGV4dD48L3N2Zz4='">
        <h5>${item.name}</h5>
        <div class="price">$${item.price}</div>
      `;
      
      itemElement.addEventListener('click', () => {
        this.trackRecommendationClick(item);
        // Navigate to product or show details
        if (item.url) {
          window.location.href = item.url;
        }
      });
      
      container.appendChild(itemElement);
    });
  }

  updateUserProfile() {
    document.getElementById('sailing-style').textContent = 
      this.userPreferences.sailingStyle.charAt(0).toUpperCase() + 
      this.userPreferences.sailingStyle.slice(1);
    
    document.getElementById('preferred-colors').textContent = 
      this.userPreferences.preferredColors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' & ');
    
    document.getElementById('activity-level').textContent = 
      this.userPreferences.activityLevel.charAt(0).toUpperCase() + 
      this.userPreferences.activityLevel.slice(1);
  }

  refreshRecommendations() {
    this.generateRecommendations();
  }

  showPreferences() {
    document.querySelector('.preferences-modal').style.display = 'flex';
    
    // Populate current preferences
    document.getElementById('sailing-style-pref').value = this.userPreferences.sailingStyle;
    document.getElementById('price-range-pref').value = this.userPreferences.priceRange;
    
    // Check color preferences
    const colorCheckboxes = document.querySelectorAll('.color-options input[type="checkbox"]');
    colorCheckboxes.forEach(checkbox => {
      checkbox.checked = this.userPreferences.preferredColors.includes(checkbox.value);
    });
  }

  hidePreferences() {
    document.querySelector('.preferences-modal').style.display = 'none';
  }

  savePreferences() {
    this.userPreferences.sailingStyle = document.getElementById('sailing-style-pref').value;
    this.userPreferences.priceRange = document.getElementById('price-range-pref').value;
    
    const selectedColors = Array.from(document.querySelectorAll('.color-options input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.value);
    this.userPreferences.preferredColors = selectedColors;
    
    this.saveUserPreferences();
    this.hidePreferences();
    this.generateRecommendations();
  }

  trackRecommendationClick(item) {
    this.browsingHistory.push({
      type: 'recommendation_click',
      product: item.name,
      matchScore: item.matchScore,
      timestamp: Date.now()
    });
    this.saveBrowsingHistory();
  }

  setupEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
      const modal = document.querySelector('.preferences-modal');
      if (e.target === modal) {
        this.hidePreferences();
      }
    });
  }
}

class RecommendationEngine {
  constructor() {
    this.productDatabase = this.initializeProductDatabase();
  }

  initializeProductDatabase() {
    return [
      { id: 1, name: 'Classic Anchor', category: 'nautical', style: 'classic', colors: ['navy', 'white'], price: 12, image: '/assets/icon-anchor.svg' },
      { id: 2, name: 'Compass Rose', category: 'navigation', style: 'vintage', colors: ['navy', 'gold'], price: 15, image: '/assets/icon-compass.svg' },
      { id: 3, name: 'Sailboat Silhouette', category: 'sailing', style: 'modern', colors: ['blue', 'white'], price: 18, image: '/assets/icon-sailboat.svg' },
      { id: 4, name: 'Lighthouse Beacon', category: 'coastal', style: 'classic', colors: ['red', 'white'], price: 14, image: '/assets/icon-lighthouse.svg' },
      { id: 5, name: 'Nautical Rope', category: 'nautical', style: 'minimalist', colors: ['brown', 'white'], price: 10, image: '/assets/icon-anchor.svg' },
      { id: 6, name: 'Wave Pattern', category: 'coastal', style: 'modern', colors: ['blue', 'teal'], price: 16, image: '/assets/icon-sailboat.svg' },
      { id: 7, name: 'Ship Wheel', category: 'sailing', style: 'vintage', colors: ['navy', 'gold'], price: 20, image: '/assets/icon-compass.svg' },
      { id: 8, name: 'Marine Life', category: 'marine', style: 'modern', colors: ['green', 'blue'], price: 13, image: '/assets/icon-lighthouse.svg' }
    ];
  }

  generateRecommendations(userPreferences, browsingHistory) {
    const forYou = this.getPersonalizedRecommendations(userPreferences, browsingHistory);
    const trending = this.getTrendingRecommendations();
    const completeLook = this.getCompleteLookRecommendations(userPreferences, browsingHistory);

    return { forYou, trending, completeLook };
  }

  getPersonalizedRecommendations(userPreferences, browsingHistory) {
    const scored = this.productDatabase.map(product => ({
      ...product,
      matchScore: this.calculateMatchScore(product, userPreferences, browsingHistory)
    }));

    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4)
      .map(item => ({ ...item, matchScore: Math.round(item.matchScore) }));
  }

  getTrendingRecommendations() {
    // Simulate trending products
    const trending = [...this.productDatabase].sort(() => Math.random() - 0.5).slice(0, 4);
    return trending.map(item => ({ ...item, matchScore: Math.floor(Math.random() * 20) + 80 }));
  }

  getCompleteLookRecommendations(userPreferences, browsingHistory) {
    // Find products that complement recently viewed items
    const recentProducts = browsingHistory
      .filter(item => item.type === 'product_view')
      .slice(-3)
      .map(item => item.product);

    const complementary = this.productDatabase
      .filter(product => !recentProducts.includes(product.name))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    return complementary.map(item => ({ ...item, matchScore: Math.floor(Math.random() * 15) + 70 }));
  }

  calculateMatchScore(product, userPreferences, browsingHistory) {
    let score = 0;

    // Style match
    if (product.style === userPreferences.sailingStyle) {
      score += 30;
    }

    // Color match
    const colorMatches = product.colors.filter(color => 
      userPreferences.preferredColors.includes(color)
    ).length;
    score += colorMatches * 15;

    // Category preference based on browsing history
    const categoryViews = browsingHistory
      .filter(item => item.type === 'product_view')
      .reduce((acc, item) => {
        const category = this.getCategoryFromProductName(item.product);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

    const mostViewedCategory = Object.keys(categoryViews).reduce((a, b) => 
      categoryViews[a] > categoryViews[b] ? a : b, 'nautical'
    );

    if (product.category === mostViewedCategory) {
      score += 20;
    }

    // Price range match
    const priceRanges = {
      budget: [5, 15],
      mid: [15, 25],
      premium: [25, 50]
    };

    const [min, max] = priceRanges[userPreferences.priceRange] || [5, 50];
    if (product.price >= min && product.price <= max) {
      score += 15;
    }

    // Add some randomness for variety
    score += Math.random() * 10;

    return Math.min(score, 100);
  }

  getCategoryFromProductName(productName) {
    const name = productName.toLowerCase();
    if (name.includes('anchor') || name.includes('rope')) return 'nautical';
    if (name.includes('compass') || name.includes('wheel')) return 'navigation';
    if (name.includes('sail') || name.includes('boat')) return 'sailing';
    if (name.includes('lighthouse') || name.includes('wave')) return 'coastal';
    if (name.includes('marine') || name.includes('fish')) return 'marine';
    return 'nautical';
  }
}

// Initialize the plugin
const personalizedRecs = new PersonalizedRecommendations();

// Add floating button
const floatingBtn = document.createElement('button');
floatingBtn.innerHTML = '🧭';
floatingBtn.className = 'recommendations-btn';
floatingBtn.onclick = () => {
  const panel = document.getElementById('personalized-recommendations');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
};

const floatingStyles = document.createElement('style');
floatingStyles.textContent = `
  .recommendations-btn {
    position: fixed;
    bottom: 20px;
    right: 160px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0c4a6e, #075985);
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(12, 74, 110, 0.4);
    z-index: 9999;
    transition: transform 0.2s ease;
  }

  .recommendations-btn:hover {
    transform: scale(1.1);
  }
`;

document.head.appendChild(floatingStyles);
document.body.appendChild(floatingBtn);

// Export for use in other scripts
window.PersonalizedRecommendations = PersonalizedRecommendations;
