// generateProductPages.js
// Usage: node generateProductPages.js

const fs = require('fs');
const path = require('path');
const productsData = require('./metatagRequest.js').products || require('./metatagRequest.js');

const BASE_URL = 'https://movingouttlv.com';
const OUTPUT_DIR = path.join(__dirname, 'product');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildProductHtml(product) {
  const url = `${BASE_URL}/product/${product.id}/`;
  const image = product.mediaGallery && product.mediaGallery.length > 0 ? product.mediaGallery[0] : `${BASE_URL}/public/poster.jpg`;
  const title = escapeHtml(product.title);
  const description = escapeHtml(product.description || 'Quality item for sale in Tel Aviv!');
  const category = escapeHtml(product.category || '');
  const price = product.price;
  const originalPrice = product.originalPrice || product.price;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>${title} | MovingOutTLV</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title} | MovingOutTLV">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="MovingOutTLV">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${url}">
  <meta property="twitter:title" content="${title} | MovingOutTLV">
  <meta property="twitter:description" content="${description}">
  <meta property="twitter:image" content="${image}">
  <link rel="icon" type="image/png" href="${BASE_URL}/public/favicon.png?v=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${BASE_URL}/styles.css">
  <style>
    .product-page-main {
      padding-top: 80px;
      min-height: calc(100vh - 200px);
      background-color: var(--color-beige);
    }

    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .product-detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: start;
    }

    .product-gallery-section {
      position: sticky;
      top: 100px;
    }

    .product-image-container {
      background: white;
      border-radius: var(--radius-medium);
      padding: 20px;
      box-shadow: var(--shadow-soft);
      overflow: hidden;
    }

    .product-image-container img {
      width: 100%;
      height: auto;
      max-height: 500px;
      object-fit: contain;
      border-radius: var(--radius-small);
    }

    .product-info-section {
      background: white;
      border-radius: var(--radius-medium);
      padding: 30px;
      box-shadow: var(--shadow-soft);
    }

    .product-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-soft-black);
      margin-bottom: 15px;
    }

    .product-description {
      font-size: 1.1rem;
      color: var(--color-charcoal);
      margin-bottom: 25px;
      line-height: 1.6;
    }

    .product-price {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-sage);
      margin-bottom: 20px;
    }

    .product-category {
      font-size: 1rem;
      color: var(--color-gray-dark);
      margin-bottom: 30px;
    }

    .product-actions {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 30px;
    }

    .btn-primary {
      background: var(--color-warm-yellow);
      color: var(--color-soft-black);
      border: none;
      padding: 15px 30px;
      border-radius: var(--radius-small);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
      text-decoration: none;
      text-align: center;
      display: inline-block;
    }

    .btn-primary:hover {
      background: var(--color-warm-yellow-hover);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: var(--color-sage);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: var(--radius-small);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
      text-decoration: none;
      text-align: center;
      display: inline-block;
    }

    .btn-secondary:hover {
      background: var(--color-sage-dark);
      transform: translateY(-2px);
    }

    .btn-whatsapp {
      background: #25d366;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: var(--radius-small);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
      text-decoration: none;
      text-align: center;
      display: inline-block;
    }

    .btn-whatsapp:hover {
      background: #128c7e;
      transform: translateY(-2px);
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--color-sage);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition-fast);
      margin-top: 20px;
    }

    .back-link:hover {
      color: var(--color-sage-dark);
    }

    .share-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid var(--color-gray-medium);
    }

    .share-label {
      font-size: 0.9rem;
      color: var(--color-gray-dark);
      margin-bottom: 10px;
      display: block;
    }

    .share-buttons {
      display: flex;
      gap: 10px;
    }

    .share-btn {
      background: var(--color-off-white);
      border: 1px solid var(--color-gray-medium);
      border-radius: var(--radius-small);
      padding: 10px 15px;
      cursor: pointer;
      transition: var(--transition-fast);
      color: var(--color-gray-dark);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .share-btn:hover {
      background: var(--color-sage);
      color: white;
      border-color: var(--color-sage);
    }

    .share-btn.whatsapp:hover {
      background: #25d366;
      border-color: #25d366;
    }

    .share-btn.facebook:hover {
      background: #1877f2;
      border-color: #1877f2;
    }

    .share-btn.telegram:hover {
      background: #0088cc;
      border-color: #0088cc;
    }

    @media (max-width: 768px) {
      .product-detail-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .product-gallery-section {
        position: static;
      }

      .product-detail-container {
        padding: 20px;
      }

      .product-title {
        font-size: 1.5rem;
      }

      .product-actions {
        flex-direction: column;
      }

      .share-buttons {
        flex-wrap: wrap;
      }
    }
  </style>
</head>
<body>
  <!-- Sticky Header -->
  <header class="sticky-header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <h1><a href="${BASE_URL}" style="text-decoration:none;color:inherit;">MovingOut<span class="tlv">TLV</span></a></h1>
        </div>
        <div class="header-actions">
          <a href="${BASE_URL}" class="btn-secondary" style="text-decoration:none;">
            <i class="fas fa-home"></i>
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Product Main Content -->
  <main class="product-page-main">
    <div class="product-detail-container">
      <div class="product-detail-grid">
        <div class="product-gallery-section">
          <div class="product-image-container">
            <img src="${image}" alt="${title}">
          </div>
        </div>

        <div class="product-info-section">
          <h1 class="product-title">${title}</h1>
          <p class="product-description">${description}</p>
          <div class="product-price">₪${price}</div>
          <div class="product-category"><strong>Category:</strong> ${category}</div>

          <div class="product-actions">
            <a href="https://wa.me/972584162884?text=Hi! I'm interested in the ${encodeURIComponent(title)} for ₪${price}. Can I schedule a viewing?" class="btn-whatsapp">
              <i class="fab fa-whatsapp"></i>
              Schedule Viewing
            </a>
            <a href="https://wa.me/972584162884?text=Hi! I want to buy the ${encodeURIComponent(title)} for ₪${price}. Can you send me the pickup details?" class="btn-primary">
              <i class="fas fa-shopping-cart"></i>
              Buy Now
            </a>
            <a href="tel:+972584162884" class="btn-secondary">
              <i class="fas fa-phone"></i>
              Call Us
            </a>
          </div>

          <div class="share-section">
            <span class="share-label">Share this item:</span>
            <div class="share-buttons">
              <a href="#" class="share-btn whatsapp" onclick="shareProduct('${product.id}', 'whatsapp')">
                <i class="fab fa-whatsapp"></i>
                WhatsApp
              </a>
              <a href="#" class="share-btn facebook" onclick="shareProduct('${product.id}', 'facebook')">
                <i class="fab fa-facebook-f"></i>
                Facebook
              </a>
              <a href="#" class="share-btn telegram" onclick="shareProduct('${product.id}', 'telegram')">
                <i class="fab fa-telegram-plane"></i>
                Telegram
              </a>
            </div>
          </div>

          <a href="${BASE_URL}" class="back-link">
            <i class="fas fa-arrow-left"></i>
            Back to all items
          </a>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <p>&copy; 2025 MovingOutTLV • A Family Sale with Love</p>
        <div class="social-share">
          <span>Share with friends:</span>
          <a href="#" class="share-btn whatsapp" onclick="shareProduct('${product.id}', 'whatsapp')">
            <i class="fab fa-whatsapp"></i>
          </a>
          <a href="#" class="share-btn facebook" onclick="shareProduct('${product.id}', 'facebook')">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" class="share-btn telegram" onclick="shareProduct('${product.id}', 'telegram')">
            <i class="fab fa-telegram-plane"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Share functionality for product pages
    function shareProduct(productId, platform) {
      const productUrl = \`${BASE_URL}/product/\${productId}/\`;
      const text = \`Check out this amazing deal: ${title} for only ₪${price}!\`;

      switch(platform) {
        case 'whatsapp':
          window.open(\`https://wa.me/?text=\${encodeURIComponent(text + '\\n\\n' + productUrl)}\`, '_blank');
          break;
        case 'facebook':
          window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(productUrl)}\`, '_blank');
          break;
        case 'telegram':
          window.open(\`https://t.me/share/url?url=\${encodeURIComponent(productUrl)}&text=\${encodeURIComponent(text)}\`, '_blank');
          break;
      }
    }
  </script>
</body>
</html>`;
}

function main() {
  const products = productsData.data || productsData;
  if (!Array.isArray(products)) {
    console.error('No products found in metatagRequest.js');
    process.exit(1);
  }
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  products.forEach(product => {
    const dir = path.join(OUTPUT_DIR, product.id);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const html = buildProductHtml(product);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`Generated: product/${product.id}/index.html`);
  });
}

main();