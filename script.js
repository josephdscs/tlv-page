// Global variables
let products = [];
let filteredProducts = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentView = 'grid';
let currentFilter = 'all';
let showSoldItems = false;

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch('https://3joseph3.wixsite.com/movingouttlv/_functions/products');
        const data = await response.json();
        if (data.success && data.data) {
            products = data.data;
            // Dispatch event when products are loaded
            window.dispatchEvent(new Event('productsLoaded'));
        } else {
            console.error('Failed to load products:', data.error);
            showToast('Failed to load products. Please refresh the page.');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        showToast('Error loading products. Please refresh the page.');
    }
}

// URL and deep linking functions
function updateURL(productId = null) {
    const url = new URL(window.location);
    if (productId) {
        url.searchParams.set('product', productId);
    } else {
        url.searchParams.delete('product');
    }
    window.history.pushState({}, '', url);
}

function getProductFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('product');
}

function updateMetaTags(product = null) {
    if (product) {
        // Get the first image URL and add size parameters for social sharing
        const firstImageUrl = product.images ? product.images.replace('~mv2', '~mv2_d_1200_630_s_2') : '';

        // Update meta tags for specific product
        document.title = `${product.title} - ₪${product.price} | MovingOutTLV`;
        document.querySelector('meta[name="description"]').content = `${product.description} Only ₪${product.price} (was ₪${product.originalPrice}). ${product.condition} condition. Pickup in Tel Aviv.`;

        // Update Open Graph tags
        document.querySelector('meta[property="og:title"]').content = `${product.title} - ₪${product.price} | MovingOutTLV`;
        document.querySelector('meta[property="og:description"]').content = `${product.description} Only ₪${product.price} (was ₪${product.originalPrice}). ${product.condition} condition.`;
        document.querySelector('meta[property="og:image"]').content = firstImageUrl;
        document.querySelector('meta[property="og:url"]').content = `${window.location.origin}${window.location.pathname}?product=${product.id}`;

        // Update Twitter tags
        document.querySelector('meta[property="twitter:title"]').content = `${product.title} - ₪${product.price} | MovingOutTLV`;
        document.querySelector('meta[property="twitter:description"]').content = `${product.description} Only ₪${product.price} (was ₪${product.originalPrice}). ${product.condition} condition.`;
        document.querySelector('meta[property="twitter:image"]').content = firstImageUrl;
        document.querySelector('meta[property="twitter:url"]').content = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    } else {
        // Reset to default meta tags
        document.title = 'MovingOutTLV - Designer Home Sale | Everything Must Go!';
        document.querySelector('meta[name="description"]').content = 'Exclusive pop-up sale in Tel Aviv! Designer furniture, home goods, and more at unbeatable prices. Pickup only - limited time!';

        // Reset Open Graph tags
        document.querySelector('meta[property="og:title"]').content = 'MovingOutTLV - Designer Home Sale | Everything Must Go!';
        document.querySelector('meta[property="og:description"]').content = 'Exclusive pop-up sale in Tel Aviv! Designer furniture, home goods, and more at unbeatable prices. Pickup only - limited time!';
        document.querySelector('meta[property="og:image"]').content = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200';
        document.querySelector('meta[property="og:url"]').content = `${window.location.origin}${window.location.pathname}`;

        // Reset Twitter tags
        document.querySelector('meta[property="twitter:title"]').content = 'MovingOutTLV - Designer Home Sale | Everything Must Go!';
        document.querySelector('meta[property="twitter:description"]').content = 'Exclusive pop-up sale in Tel Aviv! Designer furniture, home goods, and more at unbeatable prices. Pickup only - limited time!';
        document.querySelector('meta[property="twitter:image"]').content = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200';
        document.querySelector('meta[property="twitter:url"]').content = `${window.location.origin}${window.location.pathname}`;
    }
}

function handleURLChange() {
    const productId = getProductFromURL();
    if (productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            updateMetaTags(product);
            openProductModal(product);
        }
    } else {
        updateMetaTags();
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const productId = getProductFromURL();
    if (productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            openProductModal(product);
        }
    } else {
        closeModal();
    }
});

// Initialize the website
function initializeSite() {
    // Apply initial filter (hide sold items by default)
    applyCurrentFilter();

    initializeEventListeners();
    updateCartCounts();
    updateStats();
    updateSoldCount();

    // Check for deep link on page load
    handleURLChange();

    // Show email bar after 3 seconds
    setTimeout(() => {
        document.getElementById('emailBar').style.display = 'block';
    }, 3000);

    // Animate hero stats
    animateStats();
}

// Start fetching products when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
});

// Listen for products to be loaded
window.addEventListener('productsLoaded', initializeSite);

function updateSoldCount() {
    const soldCount = products.filter(p => p.sold).length;
    const soldCountElement = document.querySelector('.sold-count');
    if (soldCountElement) {
        soldCountElement.textContent = soldCount;
    }
}

// Event listeners
function initializeEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        if (!btn.classList.contains('sold-toggle')) {
            btn.addEventListener('click', handleViewChange);
        }
    });

    // Sold toggle
    document.getElementById('soldToggle').addEventListener('click', handleSoldToggle);

    // Email signup
    document.getElementById('subscribeBtn').addEventListener('click', handleEmailSignup);
    document.getElementById('closeEmailBar').addEventListener('click', closeEmailBar);

    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });

    // Floating buttons
    document.getElementById('floatingWhatsApp').addEventListener('click', openWhatsApp);
    document.getElementById('floatingCart').addEventListener('click', showFavorites);

    // Search
    document.getElementById('searchBtn').addEventListener('click', toggleSearch);

    // Search input events
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(performSearch, 300)); // Real-time search with debouncing
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Cart button
    document.getElementById('cartBtn').addEventListener('click', showFavorites);

    // Social sharing
    document.getElementById('shareWhatsApp').addEventListener('click', shareOnWhatsApp);
    document.getElementById('shareFacebook').addEventListener('click', shareOnFacebook);
    document.getElementById('shareTelegram').addEventListener('click', shareOnTelegram);

    // WhatsApp contact
    document.getElementById('whatsappBtn').addEventListener('click', openWhatsApp);
}

// Sold toggle functionality
function handleSoldToggle() {
    showSoldItems = !showSoldItems;
    const soldBtn = document.getElementById('soldToggle');
    const icon = soldBtn.querySelector('i');

    if (showSoldItems) {
        icon.className = 'fas fa-eye';
        soldBtn.classList.add('active');
        soldBtn.title = 'Hide Sold Items';
    } else {
        icon.className = 'fas fa-eye-slash';
        soldBtn.classList.remove('active');
        soldBtn.title = 'Show Sold Items';
    }

    // Re-apply current filter with new sold visibility
    applyCurrentFilter();
}

function applyCurrentFilter() {
    // Start with all products or filter by category
    let baseProducts = currentFilter === 'all' ? [...products] : products.filter(product => product.category === currentFilter);

    // Apply sold filter
    if (!showSoldItems) {
        baseProducts = baseProducts.filter(product => !product.sold);
    }

    filteredProducts = baseProducts;
    renderProducts();
}

// Filter functionality
function handleFilterClick(e) {
    const category = e.target.dataset.category;
    currentFilter = category;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Apply filter with sold status consideration
    applyCurrentFilter();
}

// View change functionality
function handleViewChange(e) {
    const view = e.target.closest('.view-btn').dataset.view;
    currentView = view;

    // Update active view button
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    e.target.closest('.view-btn').classList.add('active');

    // Update grid class for different view
    const grid = document.getElementById('productsGrid');
    if (view === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

// Render products
function renderProducts() {
    const grid = document.getElementById('productsGrid');

    // Preserve current view class
    const isListView = grid.classList.contains('list-view');
    grid.className = `products-grid ${isListView ? 'list-view' : ''}`;

    grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');

    // Add event listeners to product cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        const product = filteredProducts[index];

        // Only add click handlers for non-sold items
        if (!product.sold) {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-buy') && !e.target.closest('.btn-view') && !e.target.closest('.btn-contact-seller') && !e.target.closest('.favorite-btn')) {
                    openProductModal(product);
                }
            });

            // Favorite button
            const favoriteBtn = card.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                });
            }

            // View button
            const viewBtn = card.querySelector('.btn-view');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    viewItem(product);
                });
            }

            // Buy button
            const buyBtn = card.querySelector('.btn-buy');
            if (buyBtn) {
                buyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    buyItem(product);
                });
            }

            // Contact seller button
            const contactBtn = card.querySelector('.btn-contact-seller');
            if (contactBtn) {
                contactBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    contactSeller(product);
                });
            }
        } else {
            // For sold items, show sold toast instead of modal
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.share-product')) {
                    showToast(`This item has been sold on ${formatSoldDate(product.soldDate)}`);
                }
            });
        }
    });

    // Animate cards
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }, 100);
}

// Create product card HTML
function createProductCard(product) {
    const isFavorite = favorites.includes(product.id);
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    const isSold = product.sold;

    const badges = product.badges.map(badge => {
        let text = '';
        switch(badge) {
            case 'urgent': text = '🔥 Almost Gone'; break;
            case 'staff-pick': text = '⭐ Staff Pick'; break;
            case 'almost-gone': text = '⚡ Last One'; break;
            case 'viewing-now': text = '👀 Viewing Now'; break;
        }
        return `<span class="product-badge ${badge}">${text}</span>`;
    }).join('');

    // Add sold badge if item is sold
    const soldBadge = isSold ? '<span class="product-badge sold">✅ SOLD</span>' : '';

    // Get the first valid image URL from mediaGallery for larger display, or use a default placeholder
    const defaultImageUrl = 'public/placeholder.webp';
    const firstImageUrl = (product.mediaGallery && product.mediaGallery.length > 0) ? product.mediaGallery[0] : defaultImageUrl;

    return `
        <div class="product-card ${isSold ? 'sold-item' : ''}">
            <div class="product-image">
                <img src="${firstImageUrl}" alt="${product.title}" loading="lazy">
                <div class="product-badges">
                    ${soldBadge}
                    ${!isSold ? badges : ''}
                </div>
                ${!isSold ? `<button class="favorite-btn ${isFavorite ? 'active' : ''}">
                    <i class="fas fa-heart"></i>
                </button>` : ''}
                ${isSold ? '<div class="sold-overlay"><span>SOLD</span></div>' : ''}
                ${product.mediaGallery && product.mediaGallery.length > 1 ? `
                <div class="image-counter">
                    <i class="fas fa-images"></i> ${product.mediaGallery.length}
                </div>` : ''}
            </div>
            <div class="product-content">
                <div class="product-info">
                    <h4 class="product-title">${product.title}</h4>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="current-price ${isSold ? 'sold-price' : ''}">₪${product.price}</span>
                        <span class="original-price">₪${product.originalPrice}</span>
                        <span class="discount">-${discount}%</span>
                        ${isSold ? `<span class="sold-date">Sold ${formatSoldDate(product.soldDate)}</span>` : ''}
                    </div>
                </div>
                ${!isSold ? `
                <div class="product-actions">
                    <button class="btn-view">📅 Schedule Viewing</button>
                    <button class="btn-buy">💳 Buy Now</button>
                </div>` : `
                <div class="sold-actions">
                    <button class="btn-sold" disabled>
                        ✅ This item has been sold
                    </button>
                </div>`}
                ${!isSold ? `
                <div class="contact-seller">
                    <button class="btn-contact-seller">
                        <i class="fab fa-whatsapp"></i>
                        Chat with Seller
                    </button>
                </div>` : ``}
                <div class="share-product">
                    <span>Share:</span>
                    <button class="share-btn copy-link" onclick="copyProductLink(${product.id})" title="Copy direct link">
                        <i class="fas fa-link"></i>
                    </button>
                    <a href="#" class="share-btn whatsapp" onclick="shareProduct(${product.id}, 'whatsapp')">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <a href="#" class="share-btn facebook" onclick="shareProduct(${product.id}, 'facebook')">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="share-btn telegram" onclick="shareProduct(${product.id}, 'telegram')">
                        <i class="fab fa-telegram-plane"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function formatSoldDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

// Product modal
function openProductModal(product) {
    // Don't open modal for sold items
    if (product.sold) {
        showToast(`This item has been sold on ${formatSoldDate(product.soldDate)}`);
        return;
    }

    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);

    // Update URL and meta tags for deep linking and social sharing
    updateURL(product.id);
    updateMetaTags(product);

    // Get the first valid image URL from mediaGallery for larger display, or use a default placeholder
    const defaultImageUrl = 'public/placeholder.webp';
    const firstImageUrl = (product.mediaGallery && product.mediaGallery.length > 0) ? product.mediaGallery[0] : defaultImageUrl;

    modalBody.innerHTML = `
        <div style="padding: 30px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start;">
                <div>
                    ${product.mediaGallery && product.mediaGallery.length > 0 ? `
                    <div class="product-gallery">
                        <div class="main-image">
                            <img src="${firstImageUrl}" alt="${product.title}"
                                 style="width: 100%; border-radius: 12px; object-fit: cover;">
                        </div>
                        ${product.mediaGallery.length > 1 ? `
                        <div class="thumbnail-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 10px; margin-top: 10px;">
                            ${product.mediaGallery.map((img, index) => `
                                <img src="${img}" alt="${product.title} - Image ${index + 1}"
                                     onclick="updateMainImage(this.src)"
                                     style="width: 100%; height: 60px; object-fit: cover; border-radius: 6px; cursor: pointer;">
                            `).join('')}
                        </div>` : ''}
                    </div>` : `
                    <img src="${defaultImageUrl}" alt="No image available"
                         style="width: 100%; border-radius: 12px; object-fit: cover;">`}
                </div>
                <div>
                    <h2 style="margin-bottom: 15px; color: var(--color-soft-black);">${product.title}</h2>
                    <p style="color: var(--color-gray-dark); margin-bottom: 20px; line-height: 1.6;">${product.description}</p>

                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                        <span style="font-size: 2rem; font-weight: 700; color: var(--color-sage);">₪${product.price}</span>
                        <span style="text-decoration: line-through; color: var(--color-gray-dark);">₪${product.originalPrice}</span>
                        <span style="background: var(--color-red); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">-${discount}%</span>
                    </div>

                    <div style="background: var(--color-gray-light); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p><strong>Condition:</strong> ${product.condition}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Pickup:</strong> Tel Aviv location (sent after payment or viewing appointment)</p>
                        <p style="color: var(--color-sage); font-weight: 600; margin-top: 10px;">
                            <i class="fas fa-calendar-check"></i> Schedule a viewing appointment - same day available!
                        </p>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <button onclick="viewItem(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                                style="padding: 15px; background: var(--color-sage); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem;">
                            📅 Schedule Viewing
                        </button>
                        <button onclick="buyItem(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                                style="padding: 15px; background: var(--color-warm-yellow); border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem;">
                            💳 Buy Now
                        </button>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <button onclick="contactSeller(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                                style="width: 100%; padding: 15px; background: #25d366; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fab fa-whatsapp"></i>
                            Chat with Seller
                        </button>
                    </div>

                    <div style="text-align: center;">
                        <p style="color: var(--color-gray-dark); font-size: 0.9rem; margin-bottom: 10px;">Share this specific item:</p>
                        <div style="display: flex; justify-content: center; gap: 10px;">
                            <button onclick="shareProduct(${product.id}, 'whatsapp')"
                                    style="background: #25d366; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                            <button onclick="shareProduct(${product.id}, 'facebook')"
                                    style="background: #1877f2; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">
                                <i class="fab fa-facebook-f"></i>
                            </button>
                            <button onclick="shareProduct(${product.id}, 'telegram')"
                                    style="background: #0088cc; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">
                                <i class="fab fa-telegram-plane"></i>
                            </button>
                            <button onclick="copyProductLink(${product.id})"
                                    style="background: var(--color-charcoal); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;"
                                    title="Copy direct link">
                                <i class="fas fa-link"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Update URL and meta tags to remove product-specific info
    updateURL();
    updateMetaTags();
}

// Favorites functionality
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Removed from favorites');
    } else {
        favorites.push(productId);
        showToast('Added to favorites!');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateCartCounts();
    renderProducts();
}

function showFavorites() {
    const favoriteProducts = products.filter(p => favorites.includes(p.id));

    if (favoriteProducts.length === 0) {
        showToast('No favorites yet! Heart some items to save them.');
        return;
    }

    // Create a modal to show favorites
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div style="padding: 30px;">
            <h2 style="margin-bottom: 20px; text-align: center;">Your Favorites ❤️</h2>
            <div style="display: grid; gap: 15px;">
                ${favoriteProducts.map(product => {
                    // Get the first image URL and add size parameters for thumbnail
                    const firstImageUrl = product.images ? product.images.replace('~mv2', '~mv2_d_80_80_s_2') : '';
                    return `
                    <div style="display: flex; gap: 15px; padding: 15px; background: var(--color-gray-light); border-radius: 8px;">
                        <img src="${firstImageUrl}" alt="${product.title}"
                             style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                        <div style="flex: 1;">
                            <h4 style="margin-bottom: 5px;">${product.title}</h4>
                            <p style="color: var(--color-gray-dark); font-size: 0.9rem; margin-bottom: 10px;">${product.description.substring(0, 80)}...</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 600; color: var(--color-sage);">₪${product.price}</span>
                                <button onclick="toggleFavorite(${product.id}); showFavorites();"
                                        style="background: var(--color-red); color: white; border: none; border-radius: 4px; padding: 5px 10px; font-size: 0.8rem;">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="openWhatsApp()"
                        style="background: #25d366; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
                    Contact us about these items
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Purchase actions
function viewItem(product) {
    showToast(`Scheduling viewing appointment for ${product.title}... 📅`);
    setTimeout(() => {
        openWhatsApp(`Hi! I'd like to schedule a viewing appointment for: ${product.title} (₪${product.price}). What times work best for you today or tomorrow?`);
    }, 1000);
}

function buyItem(product) {
    showToast(`Connecting you to purchase ${product.title}... 💳`);
    // In a real app, this would open payment gateway
    setTimeout(() => {
        openWhatsApp(`Hi! I want to buy: ${product.title} (₪${product.price}). Ready to pay now!`);
    }, 1000);
}

function contactSeller(product) {
    showToast(`Opening chat about ${product.title}... 💬`);
    setTimeout(() => {
        openWhatsApp(`Hi! I have questions about: ${product.title} (₪${product.price}). Can you tell me more?`);
    }, 1000);
}

// WhatsApp integration
function openWhatsApp(message = '') {
    const defaultMessage = message || 'Hi! I saw your sale on MovingOutTLV and I\'m interested in some items. Can you help me?';
    const phoneNumber = '972584162884'; // Updated phone number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
}

// Social sharing
function shareProduct(productId, platform) {
    const product = products.find(p => p.id === productId);
    const productUrl = `${window.location.origin}${window.location.pathname}?product=${productId}`;
    const text = `Check out this amazing deal: ${product.title} for only ₪${product.price}! (was ₪${product.originalPrice})`;

    switch(platform) {
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + productUrl)}`, '_blank');
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
            break;
        case 'telegram':
            window.open(`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(text)}`, '_blank');
            break;
    }
}

function copyProductLink(productId) {
    const productUrl = `${window.location.origin}${window.location.pathname}?product=${productId}`;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(productUrl).then(() => {
            showToast('Product link copied to clipboard! 📋');
        }).catch(() => {
            fallbackCopyTextToClipboard(productUrl);
        });
    } else {
        fallbackCopyTextToClipboard(productUrl);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showToast('Product link copied to clipboard! 📋');
    } catch (err) {
        showToast('Failed to copy link. Please copy manually.');
        prompt('Copy this link:', text);
    }

    document.body.removeChild(textArea);
}

function shareOnWhatsApp() {
    const url = window.location.href;
    const text = 'Amazing home sale in Tel Aviv! Designer furniture, electronics, and more at incredible prices. Everything must go!';
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
}

function shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
}

function shareOnTelegram() {
    const text = 'Amazing home sale in Tel Aviv! Designer furniture, electronics, and more at incredible prices.';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
}

// Email signup
function handleEmailSignup() {
    const email = document.getElementById('emailInput').value;
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address');
        return;
    }

    // Simulate API call
    showToast('Thanks! We\'ll notify you when new items arrive! 📧');
    document.getElementById('emailInput').value = '';

    // Hide the email bar after successful signup
    setTimeout(() => {
        closeEmailBar();
    }, 2000);
}

function closeEmailBar() {
    document.getElementById('emailBar').style.display = 'none';
}

// Search functionality
function toggleSearch() {
    // Focus on search input when search button is clicked
    const searchInput = document.getElementById('searchInput');
    searchInput.focus();

    // Perform search if there's already text
    if (searchInput.value.trim()) {
        performSearch();
    }
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();

    if (searchTerm === '') {
        // If search is empty, apply current filter
        applyCurrentFilter();
        return;
    }

    // Filter products based on search term
    let searchResults = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.condition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply category filter if not "all"
    if (currentFilter !== 'all') {
        searchResults = searchResults.filter(product => product.category === currentFilter);
    }

    // Apply sold filter
    if (!showSoldItems) {
        searchResults = searchResults.filter(product => !product.sold);
    }

    filteredProducts = searchResults;
    renderProducts();

    if (filteredProducts.length === 0) {
        showToast(`No items found for "${searchTerm}". Try a different search term.`);
    } else {
        showToast(`Found ${filteredProducts.length} item(s) matching "${searchTerm}"`);
    }
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    // Reset to current filter
    if (currentFilter === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === currentFilter);
    }
    renderProducts();
}

// Utility functions
function updateCartCounts() {
    const count = favorites.length;
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartCountFloat').textContent = count;
}

function updateStats() {
    document.getElementById('totalItems').textContent = products.length;
    // Simulate sold items animation
    animateNumber(document.getElementById('soldToday'), 23);
}

function animateStats() {
    const totalItems = document.getElementById('totalItems');
    const soldToday = document.getElementById('soldToday');

    animateNumber(totalItems, products.length);
    setTimeout(() => {
        animateNumber(soldToday, 23);
    }, 500);
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 50);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
setTimeout(() => {
    document.querySelectorAll('.product-card, .contact-section, .footer').forEach(el => {
        observer.observe(el);
    });
}, 1000);

// Simulate real-time updates
setInterval(() => {
    const soldElement = document.getElementById('soldToday');
    const currentSold = parseInt(soldElement.textContent);
    if (Math.random() < 0.3) { // 30% chance every 10 seconds
        soldElement.textContent = currentSold + 1;
        soldElement.classList.add('highlight-animation');
        setTimeout(() => {
            soldElement.classList.remove('highlight-animation');
        }, 500);
    }
}, 10000);

// Image gallery functions
function updateMainImage(src) {
    const mainImage = document.querySelector('.main-image img');
    if (mainImage) {
        mainImage.src = src;
    }
}

// Make functions globally available for inline onclick handlers
window.shareProduct = shareProduct;
window.buyItem = buyItem;
window.viewItem = viewItem;
window.contactSeller = contactSeller;
window.toggleFavorite = toggleFavorite;
window.showFavorites = showFavorites;
window.openWhatsApp = openWhatsApp;
window.copyProductLink = copyProductLink;
window.updateMainImage = updateMainImage;

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}