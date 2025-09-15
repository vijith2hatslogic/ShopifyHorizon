/**
 * AI Plugins Configuration
 * Configuration file for AI-powered Shopify plugins
 * Sailing Stickers Store
 */

window.SAILING_STORE_CONFIG = {
  // OpenAI API Configuration
  openai_api_key: '', // Add your OpenAI API key here
  
  // Plugin Settings
  plugins: {
    ai_descriptions: {
      enabled: true,
      model: 'gpt-3.5-turbo',
      max_tokens: 200,
      temperature: 0.7,
      sailing_themes: [
        'nautical',
        'sailing',
        'marine',
        'coastal',
        'lighthouse',
        'navigation'
      ],
      default_prompts: {
        sailing: 'Write a compelling product description for a sailing sticker that appeals to sailing enthusiasts and boaters.',
        nautical: 'Create an engaging description for a nautical-themed sticker that captures maritime heritage.',
        marine: 'Generate a product description for marine life stickers that appeals to ocean lovers.',
        coastal: 'Write a description for coastal-themed stickers that evokes beach and seaside vibes.'
      }
    },
    
    image_optimization: {
      enabled: true,
      quality: 85,
      max_width: 1200,
      max_height: 1200,
      format: 'webp',
      enable_lazy_loading: true,
      enable_progressive: true,
      compression_levels: {
        high: { quality: 90, format: 'jpeg' },
        medium: { quality: 85, format: 'webp' },
        low: { quality: 75, format: 'webp' }
      }
    },
    
    recommendations: {
      enabled: true,
      max_recommendations: 4,
      update_frequency: 300000, // 5 minutes
      user_tracking: {
        page_views: true,
        product_views: true,
        cart_additions: true,
        time_spent: true
      },
      recommendation_weights: {
        style_match: 30,
        color_match: 15,
        category_preference: 20,
        price_range: 15,
        trending_factor: 10,
        random_factor: 10
      }
    }
  },
  
  // Sailing Theme Configuration
  sailing_theme: {
    colors: {
      primary: '#1e3a8a',
      secondary: '#1e40af',
      accent: '#166534',
      background: '#f0f4ff',
      text: '#374151',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    
    fonts: {
      primary: 'Work Sans',
      heading: 'Playfair Display',
      accent: 'Work Sans'
    },
    
    nautical_icons: {
      sailboat: '/assets/icon-sailboat.svg',
      compass: '/assets/icon-compass.svg',
      anchor: '/assets/icon-anchor.svg',
      lighthouse: '/assets/icon-lighthouse.svg'
    }
  },
  
  // Analytics Configuration
  analytics: {
    enabled: true,
    track_events: [
      'description_generated',
      'image_optimized',
      'recommendation_clicked',
      'cart_item_added',
      'plugin_used'
    ],
    storage_key: 'sailing-store-analytics',
    retention_days: 30
  },
  
  // Performance Settings
  performance: {
    lazy_load_plugins: true,
    cache_recommendations: true,
    cache_duration: 300000, // 5 minutes
    debounce_delay: 300,
    max_concurrent_requests: 3
  },
  
  // Feature Flags
  features: {
    advanced_analytics: true,
    a_b_testing: false,
    real_time_updates: true,
    offline_support: false,
    push_notifications: false
  },
  
  // API Endpoints (for future use)
  api_endpoints: {
    recommendations: '/api/recommendations',
    analytics: '/api/analytics',
    optimization: '/api/optimize-image'
  },
  
  // Error Handling
  error_handling: {
    show_user_errors: true,
    log_errors: true,
    fallback_enabled: true,
    retry_attempts: 3,
    retry_delay: 1000
  }
};

// Utility functions for configuration
window.SailingStoreConfig = {
  // Get configuration value
  get: function(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], window.SAILING_STORE_CONFIG);
  },
  
  // Set configuration value
  set: function(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, window.SAILING_STORE_CONFIG);
    target[lastKey] = value;
  },
  
  // Check if feature is enabled
  isFeatureEnabled: function(feature) {
    return this.get(`features.${feature}`) === true;
  },
  
  // Get plugin configuration
  getPluginConfig: function(pluginName) {
    return this.get(`plugins.${pluginName}`);
  },
  
  // Check if plugin is enabled
  isPluginEnabled: function(pluginName) {
    const config = this.getPluginConfig(pluginName);
    return config && config.enabled === true;
  },
  
  // Get sailing theme colors
  getThemeColors: function() {
    return this.get('sailing_theme.colors');
  },
  
  // Get nautical icons
  getNauticalIcons: function() {
    return this.get('sailing_theme.nautical_icons');
  }
};

// Initialize configuration on load
document.addEventListener('DOMContentLoaded', function() {
  // Validate required configuration
  if (!window.SAILING_STORE_CONFIG.openai_api_key) {
    console.warn('⚠️ OpenAI API key not configured. AI descriptions will use mock data.');
  }
  
  // Apply sailing theme to existing elements
  const sailingConfig = window.SailingStoreConfig;
  const colors = sailingConfig.getThemeColors();
  
  // Create CSS custom properties for sailing theme
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --sailing-primary: ${colors.primary};
      --sailing-secondary: ${colors.secondary};
      --sailing-accent: ${colors.accent};
      --sailing-background: ${colors.background};
      --sailing-text: ${colors.text};
      --sailing-success: ${colors.success};
      --sailing-warning: ${colors.warning};
      --sailing-error: ${colors.error};
    }
  `;
  document.head.appendChild(style);
  
  console.log('⚓ Sailing Store AI Plugins Configuration Loaded');
  console.log('🌊 Theme Colors Applied:', colors);
  console.log('🤖 Plugins Status:', {
    descriptions: sailingConfig.isPluginEnabled('ai_descriptions'),
    image_optimization: sailingConfig.isPluginEnabled('image_optimization'),
    recommendations: sailingConfig.isPluginEnabled('recommendations')
  });
});
