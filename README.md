# MovingOutTLV.com - Designer Home Sale Website

A high-converting, addictive one-page website for a family's pop-up sale in Tel Aviv. Built with pure HTML, CSS, and JavaScript for maximum performance and compatibility.

## 🎯 Project Overview

MovingOutTLV is a boutique-style flash sale website designed to create urgency, drive engagement, and convert visitors into buyers. The site combines Scandinavian minimalism with flash-sale energy to create an irresistible shopping experience.

## ✨ Key Features

### 🛒 E-commerce Features
- **Full product grid** on homepage (no unnecessary clicks)
- **High-quality images** with smooth hover effects
- **Quick action buttons** - Schedule Viewing & Buy Now
- **Price comparison** with original prices and discount percentages
- **Urgency badges** (🔥 Almost Gone, ⭐ Staff Pick, ⚡ Last One)
- **Product modals** for detailed views without page refresh
- **Favorites system** with local storage persistence
- **Deep linking** for individual product sharing

### 💬 Communication & Social
- **WhatsApp integration** for instant contact
- **Social sharing** (WhatsApp, Facebook, Telegram) for every item
- **Email signup** with timed popup for notifications
- **Share buttons** in footer for viral spread
- **Copy direct links** to clipboard

### 🎨 Design & UX
- **Scandinavian color palette**: Beige base, sage green accents, charcoal contrast
- **Boutique aesthetic** like upscale Facebook Marketplace
- **Responsive design** optimized for mobile and desktop
- **Smooth animations** and micro-interactions
- **Category filters** with emoji indicators
- **Grid/List view** toggle options

### ⚡ Technical Features
- **Pure vanilla JavaScript** - no dependencies
- **Modular structure** - products separated for easy management
- **Optimized performance** with lazy loading images
- **Local storage** for favorites persistence
- **Real-time updates** simulation (sold items counter)
- **Intersection Observer** for scroll animations
- **Touch-friendly** mobile interface

## 🎨 Color Palette

```css
Beige Base: #f8f6f3
Off-White: #fefefe
Sage Green: #a8b5a0
Charcoal: #3a3a3a
Warm Yellow: #f4d35e (CTAs)
```

## 📱 Pages & Sections

### Homepage Layout
1. **Sticky Header** - Logo, search, favorites counter
2. **Hero Section** - Emotional messaging, urgency badges, live stats
3. **Email Signup Bar** - Timed popup with shimmer effect
4. **Category Filters** - Visual category selection with emoji
5. **Products Grid** - All items displayed immediately
6. **Contact & FAQ** - Quick questions and how it works
7. **Footer** - Social sharing and family message

### Interactive Elements
- **Product Cards** - Click to open modal, heart to favorite, quick buttons
- **Floating Action Buttons** - WhatsApp chat and favorites access
- **Success Toast** - Feedback for user actions
- **Animated Counters** - Live stats that create urgency

## 🛠 Sample Products Included

The website comes with 12 realistic sample products across categories:

- **Furniture**: Scandinavian oak dining table, vintage leather armchair
- **Kitchen**: Designer knife set, ceramic dinnerware, espresso machine
- **Electronics**: MacBook Pro, modern appliances
- **Baby & Kids**: Premium stroller with accessories
- **Clothing**: Designer clothing lots
- **Decor**: Plants, modern floor lamp
- **Tools**: Professional drill set
- **Other**: Pet accessories

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in any modern web browser
3. **Customize** the content:
   - Replace sample products in `products.js`
   - Update WhatsApp number in `openWhatsApp()` function in `script.js`
   - Modify contact information
   - Add real product images

## 📁 File Structure

```
MovingOutTLV/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # Main JavaScript functionality
├── products.js         # Product data (separate for easy management)
└── README.md           # Documentation
```

## 📋 Customization Guide

### Adding Products
Edit the `productData` array in `products.js`:

```javascript
{
    id: 13,
    title: "Your Product Name",
    description: "Product description...",
    price: 500,
    originalPrice: 750,
    category: "furniture", // furniture, kitchen, baby, clothing, electronics, decor, tools, other
    images: ["image-url"],
    badges: ["staff-pick"], // urgent, staff-pick, almost-gone
    condition: "Like New"
}
```

### Updating Contact Info
1. **WhatsApp Number**: Line 651 in `script.js`
2. **Phone Number**: Line 131 in `index.html`
3. **Location**: Update pickup location text

### Payment Integration
For real payment processing, integrate with:
- **Paybox** (Israel)
- **Bit** (Israel)

Replace the `buyItem()` function with actual payment gateway calls.

## 📱 Mobile Optimization

- **Touch-friendly** buttons and interactions
- **Optimized images** for mobile bandwidth
- **Responsive grid** adapts to screen size
- **Swipe-friendly** category filters
- **Large touch targets** for easy tapping

## 🔧 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Safari
- ✅ Firefox
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Conversion Optimization Features

### Urgency & FOMO
- Live sold counter with animations
- Limited stock badges
- "Almost gone" indicators
- 24-hour reservation window

### Social Proof
- Staff pick badges
- Real-time updates
- Family story messaging
- Share functionality for viral growth

### Friction Reduction
- One-page design (no navigation)
- Instant product viewing
- Quick Reserve/Buy buttons
- WhatsApp for immediate support

## 🎭 Psychology & UX

### Emotional Triggers
- **Personal story** (family moving away)
- **Treasure hunt** feeling with varied items
- **Boutique quality** perception
- **Limited time** urgency

### Visual Hierarchy
- **Large hero** with emotional messaging
- **Price prominence** with clear savings
- **Action buttons** in warm yellow (high contrast)
- **Clean spacing** for premium feel

## 📞 Support & Contact

The website includes multiple contact methods:
- **WhatsApp**: Instant messaging for quick questions
- **Phone**: Direct calling option
- **Email**: Newsletter signup for updates

## 🔄 Future Enhancements

Potential additions for scaling:
- **Payment gateway** integration
- **Inventory management** system
- **Admin panel** for adding products
- **Analytics** tracking
- **Multi-language** support (Hebrew/English)
- **Real-time chat** widget

## 📄 License

This is a custom-built solution for MovingOutTLV. Modify as needed for your specific use case.

---

**Built with ❤️ for a family's new adventure**

*Perfect for pop-up sales, moving sales, estate sales, or any limited-time retail event.*