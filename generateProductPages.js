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
  <link rel="stylesheet" href="${BASE_URL}/styles.css">
</head>
<body>
  <header class="sticky-header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <h1><a href="${BASE_URL}" style="text-decoration:none;color:inherit;">MovingOut<span class="tlv">TLV</span></a></h1>
        </div>
      </div>
    </div>
  </header>
  <main class="product-main">
    <div class="container">
      <div class="product-detail">
        <h2>${title}</h2>
        <div class="product-gallery">
          <img src="${image}" alt="${title}" style="max-width:400px;width:100%;border-radius:12px;">
        </div>
        <div class="product-info">
          <p class="product-desc">${description}</p>
          <p class="product-price"><strong>Price:</strong> ₪${product.price}</p>
          <p class="product-category"><strong>Category:</strong> ${escapeHtml(product.category || '')}</p>
          <a href="${BASE_URL}" class="back-link">← Back to all items</a>
        </div>
      </div>
    </div>
  </main>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <p>&copy; 2025 MovingOutTLV • A Family Sale with Love</p>
      </div>
    </div>
  </footer>
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