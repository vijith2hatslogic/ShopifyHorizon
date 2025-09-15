/**
 * AI Plugins Integration
 * Main integration file for all AI-powered Shopify plugins
 * Designed specifically for the sailing stickers store
 */

class AIPluginsIntegration {
  constructor() {
    this.plugins = {
      descriptions: null,
      imageOptimization: null,
      recommendations: null
    };
    this.config = this.loadConfiguration();
    this.init();
  }

  init() {
    this.createMainUI();
    this.initializePlugins();
    this.setupGlobalEventHandlers();
    this.createPluginDashboard();
  }

  loadConfiguration() {
    return {
      openai_api_key: window.SAILING_STORE_CONFIG?.openai_api_key || '',
      enable_ai_descriptions: true,
      enable_image_optimization: true,
      enable_recommendations: true,
      sailing_theme_colors: {
        primary: '#1e3a8a',
        secondary: '#1e40af',
        accent: '#166534',
        background: '#f0f4ff'
      }
    };
  }

  createMainUI() {
    const container = document.createElement('div');
    container.id = 'ai-plugins-main';
    container.innerHTML = `
      <div class="ai-plugins-dashboard">
        <div class="dashboard-header">
          <h2>⚓ AI-Powered Sailing Store</h2>
          <div class="dashboard-controls">
            <button class="dashboard-toggle" onclick="aiPlugins.toggleDashboard()">
              <span class="toggle-icon">⚙️</span>
            </button>
          </div>
        </div>
        
        <div class="dashboard-content">
          <div class="plugin-status">
            <h3>Plugin Status</h3>
            <div class="status-grid">
              <div class="status-item" id="descriptions-status">
                <div class="status-icon">🤖</div>
                <div class="status-info">
                  <h4>AI Descriptions</h4>
                  <span class="status-indicator active">Active</span>
                </div>
              </div>
              <div class="status-item" id="image-status">
                <div class="status-icon">📸</div>
                <div class="status-info">
                  <h4>Image Optimization</h4>
                  <span class="status-indicator active">Active</span>
                </div>
              </div>
              <div class="status-item" id="recommendations-status">
                <div class="status-icon">🧭</div>
                <div class="status-info">
                  <h4>Recommendations</h4>
                  <span class="status-indicator active">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
              <button class="action-btn" onclick="aiPlugins.openPlugin('descriptions')">
                <span class="btn-icon">🤖</span>
                Generate Description
              </button>
              <button class="action-btn" onclick="aiPlugins.openPlugin('imageOptimization')">
                <span class="btn-icon">📸</span>
                Optimize Images
              </button>
              <button class="action-btn" onclick="aiPlugins.openPlugin('recommendations')">
                <span class="btn-icon">🧭</span>
                View Recommendations
              </button>
            </div>
          </div>

          <div class="analytics-summary">
            <h3>Store Analytics</h3>
            <div class="analytics-grid">
              <div class="analytics-item">
                <div class="analytics-value" id="descriptions-generated">0</div>
                <div class="analytics-label">Descriptions Generated</div>
              </div>
              <div class="analytics-item">
                <div class="analytics-value" id="images-optimized">0</div>
                <div class="analytics-label">Images Optimized</div>
              </div>
              <div class="analytics-item">
                <div class="analytics-value" id="recommendations-shown">0</div>
                <div class="analytics-label">Recommendations Shown</div>
              </div>
              <div class="analytics-item">
                <div class="analytics-value" id="conversion-rate">0%</div>
                <div class="analytics-label">Conversion Rate</div>
              </div>
            </div>
          </div>

          <div class="sailing-theme-info">
            <h3>🌊 Sailing Theme Integration</h3>
            <div class="theme-features">
              <div class="feature-item">
                <span class="feature-icon">⚓</span>
                <span class="feature-text">Nautical color scheme applied</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🧭</span>
                <span class="feature-text">Sailing-focused recommendations</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📸</span>
                <span class="feature-text">Marine-optimized image processing</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🤖</span>
                <span class="feature-text">Sailing-themed AI descriptions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const styles = document.createElement('style');
    styles.textContent = `
      .ai-plugins-dashboard {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: white;
        border: 2px solid #1e3a8a;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(30, 58, 138, 0.3);
        z-index: 9998;
        font-family: 'Work Sans', sans-serif;
        max-height: 80vh;
        overflow-y: auto;
        transition: transform 0.3s ease;
      }

      .ai-plugins-dashboard.collapsed {
        transform: translateX(300px);
      }

      .dashboard-header {
        background: linear-gradient(135deg, #1e3a8a, #1e40af);
        color: white;
        padding: 16px 20px;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .dashboard-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .dashboard-toggle {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: background 0.2s ease;
      }

      .dashboard-toggle:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .dashboard-content {
        padding: 20px;
      }

      .dashboard-content h3 {
        margin: 0 0 16px 0;
        color: #1e3a8a;
        font-size: 16px;
        border-bottom: 2px solid #e0e7ff;
        padding-bottom: 8px;
      }

      .status-grid {
        display: grid;
        gap: 12px;
        margin-bottom: 24px;
      }

      .status-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #f0f4ff;
        border-radius: 8px;
        border-left: 4px solid #1e3a8a;
      }

      .status-icon {
        font-size: 24px;
      }

      .status-info h4 {
        margin: 0 0 4px 0;
        font-size: 14px;
        color: #1e3a8a;
      }

      .status-indicator {
        font-size: 12px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 12px;
        background: #10b981;
        color: white;
      }

      .status-indicator.inactive {
        background: #ef4444;
      }

      .action-buttons {
        display: grid;
        gap: 8px;
        margin-bottom: 24px;
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border: 2px solid #1e3a8a;
        border-radius: 8px;
        background: white;
        color: #1e3a8a;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .action-btn:hover {
        background: #1e3a8a;
        color: white;
      }

      .analytics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 24px;
      }

      .analytics-item {
        text-align: center;
        padding: 12px;
        background: #f0f4ff;
        border-radius: 8px;
      }

      .analytics-value {
        font-size: 20px;
        font-weight: 700;
        color: #1e3a8a;
        margin-bottom: 4px;
      }

      .analytics-label {
        font-size: 12px;
        color: #6b7280;
      }

      .theme-features {
        display: grid;
        gap: 8px;
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #374151;
      }

      .feature-icon {
        font-size: 16px;
      }

      @media (max-width: 768px) {
        .ai-plugins-dashboard {
          width: 300px;
          right: 10px;
          top: 10px;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(container);
  }

  initializePlugins() {
    // Initialize AI Product Descriptions
    if (this.config.enable_ai_descriptions) {
      try {
        this.plugins.descriptions = new AIProductDescriptions();
        this.updatePluginStatus('descriptions', true);
      } catch (error) {
        console.error('Failed to initialize AI Descriptions:', error);
        this.updatePluginStatus('descriptions', false);
      }
    }

    // Initialize Smart Image Optimization
    if (this.config.enable_image_optimization) {
      try {
        this.plugins.imageOptimization = new SmartImageOptimization();
        this.updatePluginStatus('imageOptimization', true);
      } catch (error) {
        console.error('Failed to initialize Image Optimization:', error);
        this.updatePluginStatus('imageOptimization', false);
      }
    }

    // Initialize Personalized Recommendations
    if (this.config.enable_recommendations) {
      try {
        this.plugins.recommendations = new PersonalizedRecommendations();
        this.updatePluginStatus('recommendations', true);
      } catch (error) {
        console.error('Failed to initialize Recommendations:', error);
        this.updatePluginStatus('recommendations', false);
      }
    }

    this.loadAnalytics();
  }

  updatePluginStatus(pluginName, isActive) {
    const statusElement = document.getElementById(`${pluginName}-status`);
    if (statusElement) {
      const indicator = statusElement.querySelector('.status-indicator');
      indicator.textContent = isActive ? 'Active' : 'Inactive';
      indicator.className = `status-indicator ${isActive ? 'active' : 'inactive'}`;
    }
  }

  openPlugin(pluginName) {
    const pluginMap = {
      descriptions: 'ai-description-generator',
      imageOptimization: 'smart-image-optimizer',
      recommendations: 'personalized-recommendations'
    };

    const panelId = pluginMap[pluginName];
    if (panelId) {
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.style.display = 'block';
        this.trackPluginUsage(pluginName);
      }
    }
  }

  toggleDashboard() {
    const dashboard = document.querySelector('.ai-plugins-dashboard');
    dashboard.classList.toggle('collapsed');
  }

  trackPluginUsage(pluginName) {
    const usage = this.getStoredAnalytics();
    usage[`${pluginName}_usage`] = (usage[`${pluginName}_usage`] || 0) + 1;
    this.saveAnalytics(usage);
    this.updateAnalyticsDisplay();
  }

  getStoredAnalytics() {
    const stored = localStorage.getItem('sailing-store-analytics');
    return stored ? JSON.parse(stored) : {
      descriptions_generated: 0,
      images_optimized: 0,
      recommendations_shown: 0,
      conversion_rate: 0
    };
  }

  saveAnalytics(analytics) {
    localStorage.setItem('sailing-store-analytics', JSON.stringify(analytics));
  }

  loadAnalytics() {
    const analytics = this.getStoredAnalytics();
    this.updateAnalyticsDisplay(analytics);
  }

  updateAnalyticsDisplay(analytics = null) {
    const data = analytics || this.getStoredAnalytics();
    
    document.getElementById('descriptions-generated').textContent = data.descriptions_generated || 0;
    document.getElementById('images-optimized').textContent = data.images_optimized || 0;
    document.getElementById('recommendations-shown').textContent = data.recommendations_shown || 0;
    document.getElementById('conversion-rate').textContent = `${data.conversion_rate || 0}%`;
  }

  setupGlobalEventHandlers() {
    // Track when AI descriptions are generated
    document.addEventListener('ai-description-generated', () => {
      const analytics = this.getStoredAnalytics();
      analytics.descriptions_generated++;
      this.saveAnalytics(analytics);
      this.updateAnalyticsDisplay();
    });

    // Track when images are optimized
    document.addEventListener('image-optimized', () => {
      const analytics = this.getStoredAnalytics();
      analytics.images_optimized++;
      this.saveAnalytics(analytics);
      this.updateAnalyticsDisplay();
    });

    // Track when recommendations are shown
    document.addEventListener('recommendations-shown', () => {
      const analytics = this.getStoredAnalytics();
      analytics.recommendations_shown++;
      this.saveAnalytics(analytics);
      this.updateAnalyticsDisplay();
    });

    // Track conversions (cart additions)
    document.addEventListener('cart-item-added', () => {
      const analytics = this.getStoredAnalytics();
      const totalViews = analytics.recommendations_shown || 1;
      const conversions = analytics.conversions || 0;
      analytics.conversions = conversions + 1;
      analytics.conversion_rate = Math.round((analytics.conversions / totalViews) * 100);
      this.saveAnalytics(analytics);
      this.updateAnalyticsDisplay();
    });
  }

  createPluginDashboard() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case 'D':
            e.preventDefault();
            this.openPlugin('descriptions');
            break;
          case 'I':
            e.preventDefault();
            this.openPlugin('imageOptimization');
            break;
          case 'R':
            e.preventDefault();
            this.openPlugin('recommendations');
            break;
          case 'A':
            e.preventDefault();
            this.toggleDashboard();
            break;
        }
      }
    });

    // Add sailing theme integration
    this.applySailingThemeStyles();
  }

  applySailingThemeStyles() {
    const sailingStyles = document.createElement('style');
    sailingStyles.textContent = `
      /* Sailing Theme Integration for AI Plugins */
      .ai-description-panel,
      .image-optimizer-panel,
      .recommendations-panel {
        border-color: #1e3a8a !important;
        box-shadow: 0 10px 30px rgba(30, 58, 138, 0.3) !important;
      }

      .ai-panel-header,
      .optimizer-header,
      .recommendations-header {
        background: linear-gradient(135deg, #1e3a8a, #1e40af) !important;
      }

      .ai-floating-btn {
        background: linear-gradient(135deg, #1e3a8a, #1e40af) !important;
        box-shadow: 0 4px 12px rgba(30, 58, 138, 0.4) !important;
      }

      .image-optimizer-btn {
        background: linear-gradient(135deg, #166534, #15803d) !important;
        box-shadow: 0 4px 12px rgba(22, 101, 52, 0.4) !important;
      }

      .recommendations-btn {
        background: linear-gradient(135deg, #0c4a6e, #075985) !important;
        box-shadow: 0 4px 12px rgba(12, 74, 110, 0.4) !important;
      }

      /* Sailing-themed loading animations */
      .ai-spinner {
        border-top-color: #1e3a8a !important;
      }

      /* Nautical color scheme for all plugin elements */
      .ai-generate-btn,
      .optimize-all-btn,
      .refresh-recommendations-btn {
        background: linear-gradient(135deg, #1e3a8a, #1e40af) !important;
      }

      .ai-generate-btn:hover,
      .optimize-all-btn:hover,
      .refresh-recommendations-btn:hover {
        background: linear-gradient(135deg, #1e40af, #2563eb) !important;
      }
    `;
    document.head.appendChild(sailingStyles);
  }

  // Public API methods
  getPluginStatus() {
    return {
      descriptions: !!this.plugins.descriptions,
      imageOptimization: !!this.plugins.imageOptimization,
      recommendations: !!this.plugins.recommendations
    };
  }

  getAnalytics() {
    return this.getStoredAnalytics();
  }

  resetAnalytics() {
    localStorage.removeItem('sailing-store-analytics');
    this.updateAnalyticsDisplay();
  }
}

// Initialize the main integration
const aiPlugins = new AIPluginsIntegration();

// Add main floating button
const mainFloatingBtn = document.createElement('button');
mainFloatingBtn.innerHTML = '⚓ AI';
mainFloatingBtn.className = 'ai-main-btn';
mainFloatingBtn.onclick = () => aiPlugins.toggleDashboard();

const mainFloatingStyles = document.createElement('style');
mainFloatingStyles.textContent = `
  .ai-main-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e3a8a, #1e40af);
    color: white;
    border: none;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
    z-index: 9999;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ai-main-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(30, 58, 138, 0.6);
  }

  .ai-main-btn:active {
    transform: scale(0.95);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .ai-main-btn {
      width: 60px;
      height: 60px;
      font-size: 16px;
      bottom: 15px;
      right: 15px;
    }
  }
`;

document.head.appendChild(mainFloatingStyles);
document.body.appendChild(mainFloatingBtn);

// Export for global access
window.AIPluginsIntegration = AIPluginsIntegration;
window.aiPlugins = aiPlugins;

// Add keyboard shortcut help
console.log(`
⚓ AI-Powered Sailing Store Plugins Loaded!

Keyboard Shortcuts:
- Ctrl + Shift + D: Open AI Descriptions
- Ctrl + Shift + I: Open Image Optimizer  
- Ctrl + Shift + R: Open Recommendations
- Ctrl + Shift + A: Toggle Dashboard
- Ctrl + D: Quick AI Description (from descriptions plugin)

Features:
✅ AI-generated product descriptions with sailing themes
✅ Smart image optimization for marine products
✅ Personalized recommendations based on sailing preferences
✅ Integrated analytics and performance tracking
✅ Sailing-themed UI with nautical color schemes
`);
