// Product data for MovingOutTLV
let productData = [];

// Ensure image URLs end with .jpeg if they don't already have an extension
function ensureJpegExtension(url) {
    if (!url) return url;
    const [base, query] = url.split('?');
    if (!/\.(jpe?g|png|webp|gif|svg)$/i.test(base)) {
        return `${base}.jpeg${query ? `?${query}` : ''}`;
    }
    return url;
}

// Normalize product image URLs so they won't break on the website
function sanitizeProductImages(products) {
    products.forEach(p => {
        if (Array.isArray(p.mediaGallery)) {
            p.mediaGallery = p.mediaGallery.map(ensureJpegExtension);
        }
        if (typeof p.images === 'string') {
            p.images = ensureJpegExtension(p.images);
        }
    });
}

// Function to fetch products from Wix API
async function fetchProducts() {
    try {
        const response = await fetch('https://3joseph3.wixsite.com/movingouttlv/_functions/products');
        const result = await response.json();

        if (result.success) {
            productData = result.data;
            sanitizeProductImages(productData);
            // Dispatch an event to notify that products are loaded
            window.dispatchEvent(new CustomEvent('productsLoaded'));
        } else {
            console.error('Failed to fetch products:', result.error);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Fetch products when the page loads
fetchProducts();

// Export the productData array
window.productData = productData;