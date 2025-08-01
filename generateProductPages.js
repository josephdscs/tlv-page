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

function buildImageTag(url, title) {
  const [base, query] = url.split('?');
  const suffix = query ? `?${query}` : '';
  let primary = url;
  let fallback = '';

  if (/\.jpg$/i.test(base)) {
    fallback = `${base.slice(0, -4)}.jpeg${suffix}`;
  } else if (/\.jpeg$/i.test(base)) {
    fallback = `${base.slice(0, -5)}.jpg${suffix}`;
  } else {
    primary = `${base}.jpeg${suffix}`;
    fallback = `${base}.jpg${suffix}`;
  }

  const fallbackAttr = fallback ? ` data-fallback="${fallback}" onerror="handleImageError(this)"` : '';
  return `<img src="${primary}" alt="${escapeHtml(title)}"${fallbackAttr}>`;
}

function buildProductHtml(product) {
  const url = `${BASE_URL}/product/${product.id}/`;
  const image = product.mediaGallery && product.mediaGallery.length > 0 ? product.mediaGallery[0] : `${BASE_URL}/public/poster.jpg`;
  const title = escapeHtml(product.title);
  const description = escapeHtml(product.description || 'Quality item for sale in Tel Aviv!');
  const category = escapeHtml(product.category || '');
  const price = product.price;
  const originalPrice = product.originalPrice || product.price;

  const imgTag = buildImageTag(image, title);

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
  <link rel="stylesheet" href="/styles.css">
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
            ${imgTag}
          </div>
        </div>

        <div class="product-info-section">
          <h1 class="product-title">${title}</h1>
          <p class="product-description">${description}</p>
          <div class="product-price">₪${price}</div>
          <div class="product-category"><strong>Category:</strong> ${category}</div>

          <div class="product-actions">
            <button onclick="openWhatsApp('Hi! I\\'m interested in the ${title.replace(/'/g, "\\'")} for ₪${price}. Can I schedule a viewing?')" class="btn-whatsapp">
              <i class="fab fa-whatsapp"></i>
              Schedule Viewing
            </button>
            <button onclick="openWhatsApp('Hi! I want to buy the ${title.replace(/'/g, "\\'")} for ₪${price}. Can you send me the pickup details?')" class="btn-primary">
              <i class="fas fa-shopping-cart"></i>
              Buy Now
            </button>
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
    function handleImageError(img) {
      if (img.dataset.fallback) {
        img.onerror = null;
        img.src = img.dataset.fallback;
        img.removeAttribute('data-fallback');
      }
    }
    // Enhanced WhatsApp integration for mobile
    function openWhatsApp(message = '') {
      const encodedMessage = encodeURIComponent(message);
      let whatsappLink = \`https://wa.me/972584162884\`;

      if (message) {
        whatsappLink += \`?text=\${encodedMessage}\`;
      }

      // Enhanced mobile detection and WhatsApp opening
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isMobile) {
        // For mobile devices, try to open WhatsApp app directly
        if (isIOS) {
          // iOS: Try WhatsApp app first, then fallback to wa.me
          const whatsappAppLink = \`whatsapp://send?phone=972584162884\${message ? \`&text=\${encodedMessage}\` : ''}\`;
          
          // Try to open WhatsApp app
          window.location.href = whatsappAppLink;
          
          // Fallback to wa.me after a short delay if app doesn't open
          setTimeout(() => {
            window.open(whatsappLink, '_blank');
          }, 1500);
        } else if (isAndroid) {
          // Android: Try app intent first
          const whatsappAppLink = \`intent://send?phone=972584162884\${message ? \`&text=\${encodedMessage}\` : ''}#Intent;scheme=whatsapp;package=com.whatsapp;end\`;
          
          try {
            window.location.href = whatsappAppLink;
          } catch (e) {
            // Fallback to wa.me
            window.open(whatsappLink, '_blank');
          }
        } else {
          // Other mobile browsers
          window.open(whatsappLink, '_blank');
        }
      } else {
        // Desktop: Use wa.me
        window.open(whatsappLink, '_blank');
      }
    }

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