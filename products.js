// Product data for MovingOutTLV
let productData = [];

// Function to fetch products from Wix API
async function fetchProducts() {
    try {
        const response = await fetch('https://3joseph3.wixsite.com/movingouttlv/_functions/products');
        const result = await response.json();

        if (result.success) {
            productData = result.data;
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