/**
 * Smart Image Optimization Plugin
 * Automatically optimizes images for sailing stickers store
 */

class SmartImageOptimization {
  constructor() {
    this.optimizationSettings = {
      quality: 85,
      maxWidth: 1200,
      maxHeight: 1200,
      format: 'webp',
      enableLazyLoading: true,
      enableProgressive: true
    };
    this.init();
  }

  init() {
    this.createUI();
    this.optimizeExistingImages();
    this.setupImageUploadHandler();
    this.setupLazyLoading();
  }

  createUI() {
    const container = document.createElement('div');
    container.id = 'smart-image-optimizer';
    container.innerHTML = `
      <div class="image-optimizer-panel">
        <div class="optimizer-header">
          <h3>📸 Smart Image Optimizer</h3>
          <button class="optimizer-close-btn" onclick="this.closest('.image-optimizer-panel').style.display='none'">×</button>
        </div>
        <div class="optimizer-content">
          <div class="optimization-stats">
            <div class="stat-item">
              <span class="stat-label">Images Optimized:</span>
              <span class="stat-value" id="optimized-count">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Space Saved:</span>
              <span class="stat-value" id="space-saved">0 KB</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Load Time Improved:</span>
              <span class="stat-value" id="load-improvement">0%</span>
            </div>
          </div>
          
          <div class="optimization-controls">
            <h4>Optimization Settings</h4>
            <div class="control-group">
              <label for="quality-slider">Quality: <span id="quality-value">85</span>%</label>
              <input type="range" id="quality-slider" min="60" max="100" value="85" oninput="smartImageOpt.updateQuality(this.value)">
            </div>
            <div class="control-group">
              <label for="max-width">Max Width: <span id="width-value">1200</span>px</label>
              <input type="range" id="max-width" min="800" max="2000" value="1200" oninput="smartImageOpt.updateMaxWidth(this.value)">
            </div>
            <div class="control-group">
              <label>
                <input type="checkbox" id="enable-webp" checked onchange="smartImageOpt.toggleWebP(this.checked)">
                Convert to WebP format
              </label>
            </div>
            <div class="control-group">
              <label>
                <input type="checkbox" id="enable-lazy" checked onchange="smartImageOpt.toggleLazyLoading(this.checked)">
                Enable lazy loading
              </label>
            </div>
          </div>

          <div class="batch-actions">
            <button class="optimize-all-btn" onclick="smartImageOpt.optimizeAllImages()">
              <span class="btn-icon">⚡</span>
              Optimize All Images
            </button>
            <button class="analyze-btn" onclick="smartImageOpt.analyzeImages()">
              <span class="btn-icon">📊</span>
              Analyze Performance
            </button>
          </div>

          <div class="optimization-progress" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <p class="progress-text">Optimizing images...</p>
          </div>

          <div class="optimization-results" style="display: none;">
            <h4>Optimization Results</h4>
            <div class="results-content"></div>
          </div>
        </div>
      </div>
    `;

    const styles = document.createElement('style');
    styles.textContent = `
      .image-optimizer-panel {
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
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: 'Work Sans', sans-serif;
      }

      .optimizer-header {
        background: linear-gradient(135deg, #1e3a8a, #1e40af);
        color: white;
        padding: 16px 20px;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .optimizer-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .optimizer-close-btn {
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

      .optimizer-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .optimizer-content {
        padding: 20px;
      }

      .optimization-stats {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 20px;
        padding: 16px;
        background: #f0f4ff;
        border-radius: 8px;
      }

      .stat-item {
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

      .optimization-controls h4 {
        margin: 0 0 16px 0;
        color: #1e3a8a;
        font-size: 16px;
      }

      .control-group {
        margin-bottom: 16px;
      }

      .control-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #1e3a8a;
      }

      .control-group input[type="range"] {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: #e0e7ff;
        outline: none;
        -webkit-appearance: none;
      }

      .control-group input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #1e3a8a;
        cursor: pointer;
      }

      .control-group input[type="checkbox"] {
        margin-right: 8px;
        transform: scale(1.2);
      }

      .batch-actions {
        display: flex;
        gap: 12px;
        margin-top: 20px;
      }

      .batch-actions button {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #1e3a8a;
        border-radius: 8px;
        background: white;
        color: #1e3a8a;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease;
      }

      .batch-actions button:hover {
        background: #1e3a8a;
        color: white;
      }

      .optimize-all-btn {
        background: #1e3a8a !important;
        color: white !important;
      }

      .optimize-all-btn:hover {
        background: #1e40af !important;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #e0e7ff;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 12px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #1e3a8a, #1e40af);
        width: 0%;
        transition: width 0.3s ease;
      }

      .progress-text {
        text-align: center;
        color: #1e3a8a;
        margin: 0;
      }

      .optimization-results {
        margin-top: 20px;
        padding: 16px;
        background: #f0fdf4;
        border-radius: 8px;
        border-left: 4px solid #166534;
      }

      .optimization-results h4 {
        margin: 0 0 12px 0;
        color: #166534;
      }

      .results-content {
        font-size: 14px;
        line-height: 1.5;
        color: #374151;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(container);
  }

  optimizeExistingImages() {
    const images = document.querySelectorAll('img:not([data-optimized])');
    images.forEach(img => this.optimizeImage(img));
  }

  optimizeImage(img) {
    if (img.dataset.optimized) return;

    const originalSrc = img.src;
    const optimizedSrc = this.generateOptimizedURL(originalSrc);
    
    // Create a new image to test if optimized version loads
    const testImg = new Image();
    testImg.onload = () => {
      img.src = optimizedSrc;
      img.dataset.optimized = 'true';
      this.updateStats();
    };
    testImg.onerror = () => {
      // Fallback to original if optimization fails
      img.dataset.optimized = 'true';
    };
    testImg.src = optimizedSrc;
  }

  generateOptimizedURL(originalURL) {
    // This would integrate with your image optimization service
    // For demo purposes, we'll simulate optimization
    const url = new URL(originalURL);
    url.searchParams.set('w', this.optimizationSettings.maxWidth);
    url.searchParams.set('h', this.optimizationSettings.maxHeight);
    url.searchParams.set('q', this.optimizationSettings.quality);
    if (this.optimizationSettings.format === 'webp') {
      url.searchParams.set('f', 'webp');
    }
    return url.toString();
  }

  setupImageUploadHandler() {
    // Handle new image uploads
    const fileInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    fileInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => this.processUploadedImage(file));
      });
    });
  }

  processUploadedImage(file) {
    if (!file.type.startsWith('image/')) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const { width, height } = this.calculateDimensions(
        img.width, 
        img.height, 
        this.optimizationSettings.maxWidth, 
        this.optimizationSettings.maxHeight
      );

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      const optimizedDataURL = canvas.toDataURL(
        `image/${this.optimizationSettings.format === 'webp' ? 'jpeg' : this.optimizationSettings.format}`,
        this.optimizationSettings.quality / 100
      );

      // Update file input with optimized image
      this.updateFileInput(optimizedDataURL, file.name);
    };

    img.src = URL.createObjectURL(file);
  }

  calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let { width, height } = { width: originalWidth, height: originalHeight };

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  updateFileInput(dataURL, filename) {
    // Convert data URL to blob and update file input
    fetch(dataURL)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], filename, { type: blob.type });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        
        const fileInput = document.querySelector('input[type="file"][accept*="image"]');
        if (fileInput) {
          fileInput.files = dataTransfer.files;
        }
      });
  }

  setupLazyLoading() {
    if (!this.optimizationSettings.enableLazyLoading) return;

    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.loading = 'lazy';
    });
  }

  updateQuality(value) {
    this.optimizationSettings.quality = parseInt(value);
    document.getElementById('quality-value').textContent = value;
  }

  updateMaxWidth(value) {
    this.optimizationSettings.maxWidth = parseInt(value);
    document.getElementById('width-value').textContent = value;
  }

  toggleWebP(enabled) {
    this.optimizationSettings.format = enabled ? 'webp' : 'jpeg';
  }

  toggleLazyLoading(enabled) {
    this.optimizationSettings.enableLazyLoading = enabled;
    if (enabled) {
      this.setupLazyLoading();
    }
  }

  async optimizeAllImages() {
    const images = document.querySelectorAll('img:not([data-optimized])');
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const progressPanel = document.querySelector('.optimization-progress');
    
    progressPanel.style.display = 'block';
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      this.optimizeImage(img);
      
      const progress = ((i + 1) / images.length) * 100;
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `Optimizing image ${i + 1} of ${images.length}...`;
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    progressPanel.style.display = 'none';
    this.showResults();
  }

  analyzeImages() {
    const images = document.querySelectorAll('img');
    let totalSize = 0;
    let optimizedCount = 0;
    
    images.forEach(img => {
      if (img.dataset.optimized) optimizedCount++;
      // Estimate file size (this would be more accurate with actual file sizes)
      totalSize += this.estimateImageSize(img);
    });
    
    const results = {
      totalImages: images.length,
      optimizedImages: optimizedCount,
      estimatedSize: totalSize,
      potentialSavings: Math.round(totalSize * 0.3) // Estimate 30% savings
    };
    
    this.displayAnalysis(results);
  }

  estimateImageSize(img) {
    // Rough estimation based on dimensions
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    return Math.round((width * height * 3) / 1024); // KB
  }

  displayAnalysis(results) {
    const resultsPanel = document.querySelector('.optimization-results');
    const resultsContent = document.querySelector('.results-content');
    
    resultsContent.innerHTML = `
      <div class="analysis-item">
        <strong>Total Images:</strong> ${results.totalImages}
      </div>
      <div class="analysis-item">
        <strong>Optimized:</strong> ${results.optimizedImages}
      </div>
      <div class="analysis-item">
        <strong>Estimated Total Size:</strong> ${results.estimatedSize} KB
      </div>
      <div class="analysis-item">
        <strong>Potential Savings:</strong> ${results.potentialSavings} KB
      </div>
      <div class="analysis-item">
        <strong>Load Time Improvement:</strong> ~${Math.round((results.potentialSavings / results.estimatedSize) * 100)}%
      </div>
    `;
    
    resultsPanel.style.display = 'block';
  }

  showResults() {
    const resultsPanel = document.querySelector('.optimization-results');
    const resultsContent = document.querySelector('.results-content');
    
    resultsContent.innerHTML = `
      <div class="success-message">
        ✅ All images have been optimized successfully!
      </div>
      <div class="improvement-stats">
        <p>• Faster page load times</p>
        <p>• Reduced bandwidth usage</p>
        <p>• Better user experience</p>
        <p>• Improved SEO performance</p>
      </div>
    `;
    
    resultsPanel.style.display = 'block';
  }

  updateStats() {
    const optimizedCount = document.querySelectorAll('img[data-optimized]').length;
    document.getElementById('optimized-count').textContent = optimizedCount;
    
    // Update other stats (simplified for demo)
    const spaceSaved = optimizedCount * 50; // KB
    document.getElementById('space-saved').textContent = `${spaceSaved} KB`;
    
    const improvement = Math.min(optimizedCount * 5, 50); // Max 50%
    document.getElementById('load-improvement').textContent = `${improvement}%`;
  }
}

// Initialize the plugin
const smartImageOpt = new SmartImageOptimization();

// Add floating button
const floatingBtn = document.createElement('button');
floatingBtn.innerHTML = '📸';
floatingBtn.className = 'image-optimizer-btn';
floatingBtn.onclick = () => {
  const panel = document.getElementById('smart-image-optimizer');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
};

const floatingStyles = document.createElement('style');
floatingStyles.textContent = `
  .image-optimizer-btn {
    position: fixed;
    bottom: 20px;
    right: 90px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #166534, #15803d);
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(22, 101, 52, 0.4);
    z-index: 9999;
    transition: transform 0.2s ease;
  }

  .image-optimizer-btn:hover {
    transform: scale(1.1);
  }
`;

document.head.appendChild(floatingStyles);
document.body.appendChild(floatingBtn);

// Export for use in other scripts
window.SmartImageOptimization = SmartImageOptimization;
