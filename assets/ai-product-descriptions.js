/**
 * AI-Powered Product Descriptions Plugin
 * Generates compelling product descriptions for sailing stickers
 */

class AIProductDescriptions {
  constructor() {
    this.apiKey = this.getAPIKey();
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.init();
  }

  init() {
    this.createUI();
    this.bindEvents();
  }

  getAPIKey() {
    // In production, this should be stored securely
    return window.SAILING_STORE_CONFIG?.openai_api_key || '';
  }

  createUI() {
    // Create the AI description generator interface
    const container = document.createElement('div');
    container.id = 'ai-description-generator';
    container.innerHTML = `
      <div class="ai-description-panel">
        <div class="ai-panel-header">
          <h3>⚓ AI Product Description Generator</h3>
          <button class="ai-close-btn" onclick="this.closest('.ai-description-panel').style.display='none'">×</button>
        </div>
        <div class="ai-panel-content">
          <div class="ai-input-group">
            <label for="product-name">Product Name:</label>
            <input type="text" id="product-name" placeholder="e.g., Nautical Anchor Sticker">
          </div>
          <div class="ai-input-group">
            <label for="product-category">Category:</label>
            <select id="product-category">
              <option value="sailing">Sailing</option>
              <option value="nautical">Nautical</option>
              <option value="marine">Marine Life</option>
              <option value="coastal">Coastal</option>
              <option value="lighthouse">Lighthouse</option>
              <option value="compass">Navigation</option>
            </select>
          </div>
          <div class="ai-input-group">
            <label for="product-style">Style:</label>
            <select id="product-style">
              <option value="vintage">Vintage</option>
              <option value="modern">Modern</option>
              <option value="minimalist">Minimalist</option>
              <option value="detailed">Detailed</option>
              <option value="watercolor">Watercolor</option>
            </select>
          </div>
          <div class="ai-input-group">
            <label for="product-size">Size:</label>
            <input type="text" id="product-size" placeholder="e.g., 3x3 inches">
          </div>
          <div class="ai-input-group">
            <label for="special-features">Special Features:</label>
            <textarea id="special-features" placeholder="Waterproof, UV resistant, etc."></textarea>
          </div>
          <button class="ai-generate-btn" onclick="aiDescriptions.generateDescription()">
            <span class="ai-btn-icon">🤖</span>
            Generate Description
          </button>
          <div class="ai-loading" style="display: none;">
            <div class="ai-spinner"></div>
            <p>Generating your perfect description...</p>
          </div>
          <div class="ai-result" style="display: none;">
            <h4>Generated Description:</h4>
            <div class="ai-description-output"></div>
            <div class="ai-actions">
              <button class="ai-copy-btn" onclick="aiDescriptions.copyDescription()">Copy</button>
              <button class="ai-regenerate-btn" onclick="aiDescriptions.generateDescription()">Regenerate</button>
              <button class="ai-use-btn" onclick="aiDescriptions.useDescription()">Use This Description</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .ai-description-panel {
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
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: 'Work Sans', sans-serif;
      }

      .ai-panel-header {
        background: linear-gradient(135deg, #1e3a8a, #1e40af);
        color: white;
        padding: 16px 20px;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ai-panel-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .ai-close-btn {
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

      .ai-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .ai-panel-content {
        padding: 20px;
      }

      .ai-input-group {
        margin-bottom: 16px;
      }

      .ai-input-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #1e3a8a;
      }

      .ai-input-group input,
      .ai-input-group select,
      .ai-input-group textarea {
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #e0e7ff;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.3s ease;
      }

      .ai-input-group input:focus,
      .ai-input-group select:focus,
      .ai-input-group textarea:focus {
        outline: none;
        border-color: #1e3a8a;
      }

      .ai-generate-btn {
        width: 100%;
        background: linear-gradient(135deg, #1e3a8a, #1e40af);
        color: white;
        border: none;
        padding: 14px 20px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: transform 0.2s ease;
      }

      .ai-generate-btn:hover {
        transform: translateY(-2px);
      }

      .ai-loading {
        text-align: center;
        padding: 20px;
      }

      .ai-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e0e7ff;
        border-top: 4px solid #1e3a8a;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .ai-result {
        margin-top: 20px;
        padding: 16px;
        background: #f0f4ff;
        border-radius: 8px;
        border-left: 4px solid #1e3a8a;
      }

      .ai-description-output {
        background: white;
        padding: 16px;
        border-radius: 6px;
        margin-bottom: 16px;
        line-height: 1.6;
        color: #374151;
      }

      .ai-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .ai-actions button {
        padding: 8px 16px;
        border: 2px solid #1e3a8a;
        border-radius: 6px;
        background: white;
        color: #1e3a8a;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .ai-actions button:hover {
        background: #1e3a8a;
        color: white;
      }

      .ai-actions .ai-use-btn {
        background: #1e3a8a;
        color: white;
      }

      .ai-actions .ai-use-btn:hover {
        background: #1e40af;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(container);
  }

  bindEvents() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        this.togglePanel();
      }
    });
  }

  togglePanel() {
    const panel = document.getElementById('ai-description-generator');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }

  async generateDescription() {
    const productName = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const style = document.getElementById('product-style').value;
    const size = document.getElementById('product-size').value;
    const features = document.getElementById('special-features').value;

    if (!productName) {
      alert('Please enter a product name');
      return;
    }

    // Show loading state
    document.querySelector('.ai-loading').style.display = 'block';
    document.querySelector('.ai-result').style.display = 'none';

    try {
      const prompt = this.buildPrompt(productName, category, style, size, features);
      const description = await this.callOpenAI(prompt);
      
      // Show result
      document.querySelector('.ai-description-output').textContent = description;
      document.querySelector('.ai-loading').style.display = 'none';
      document.querySelector('.ai-result').style.display = 'block';
      
    } catch (error) {
      console.error('Error generating description:', error);
      document.querySelector('.ai-loading').style.display = 'none';
      alert('Error generating description. Please try again.');
    }
  }

  buildPrompt(productName, category, style, size, features) {
    return `Generate a compelling product description for a sailing sticker with these details:

Product: ${productName}
Category: ${category}
Style: ${style}
Size: ${size}
Special Features: ${features}

Requirements:
- Write in an engaging, nautical tone
- Include benefits for sailors and boaters
- Mention durability and weather resistance
- Keep it between 100-150 words
- Use sailing terminology appropriately
- End with a call-to-action
- Make it SEO-friendly for sailing enthusiasts

Format the description as a single paragraph ready for use in an online store.`;
  }

  async callOpenAI(prompt) {
    if (!this.apiKey) {
      // Fallback to mock response for demo
      return this.getMockDescription();
    }

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional copywriter specializing in nautical and sailing products. Write compelling, SEO-friendly product descriptions that appeal to sailing enthusiasts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  getMockDescription() {
    const mockDescriptions = [
      "Set sail with confidence using our premium nautical anchor sticker! Crafted with weather-resistant vinyl, this durable decal withstands salt spray, UV rays, and harsh marine conditions. Perfect for boats, cars, laptops, and water bottles. The classic anchor design symbolizes strength and stability - essential qualities for any sailor. Easy to apply and remove without leaving residue. Show your love for the sea with this timeless maritime symbol. Order now and let your passion for sailing shine!",
      
      "Navigate your way to style with our elegant compass rose sticker! This beautifully detailed decal features traditional nautical markings in a vintage-inspired design. Made from high-quality vinyl that resists fading and peeling, it's perfect for personalizing your gear. Whether you're a seasoned sailor or a coastal dreamer, this compass sticker adds a touch of maritime charm to any surface. Waterproof and UV-resistant for long-lasting beauty. Chart your course to adventure - get yours today!",
      
      "Illuminate your passion for the sea with our stunning lighthouse sticker! This detailed decal captures the iconic beauty of coastal beacons that guide sailors home. Crafted from premium vinyl with exceptional weather resistance, it's perfect for boats, cars, and personal items. The lighthouse symbolizes hope, guidance, and safe harbor - values every sailor holds dear. Easy application with no residue removal. Let this beacon of maritime heritage light up your world. Order now and bring the coast to you!"
    ];
    
    return mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
  }

  copyDescription() {
    const description = document.querySelector('.ai-description-output').textContent;
    navigator.clipboard.writeText(description).then(() => {
      const btn = document.querySelector('.ai-copy-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.background = '#10b981';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    });
  }

  useDescription() {
    const description = document.querySelector('.ai-description-output').textContent;
    
    // Try to find and fill product description field
    const descriptionField = document.querySelector('textarea[name*="description"], input[name*="description"]');
    if (descriptionField) {
      descriptionField.value = description;
      descriptionField.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Show success message
    const btn = document.querySelector('.ai-use-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Used!';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);
  }
}

// Initialize the plugin
const aiDescriptions = new AIProductDescriptions();

// Add floating button to open the AI panel
const floatingBtn = document.createElement('button');
floatingBtn.innerHTML = '🤖 AI';
floatingBtn.className = 'ai-floating-btn';
floatingBtn.onclick = () => aiDescriptions.togglePanel();

const floatingStyles = document.createElement('style');
floatingStyles.textContent = `
  .ai-floating-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e3a8a, #1e40af);
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(30, 58, 138, 0.4);
    z-index: 9999;
    transition: transform 0.2s ease;
  }

  .ai-floating-btn:hover {
    transform: scale(1.1);
  }
`;

document.head.appendChild(floatingStyles);
document.body.appendChild(floatingBtn);

// Export for use in other scripts
window.AIProductDescriptions = AIProductDescriptions;
