// Main initialization script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Oud Éire website initialized');
    
    // Initialize all modules
    initNavigation();
    initProducts();
    initCart();
    
    // Load products
    loadHomePageProducts();
    loadShopPageProducts();
});

// Make products available globally for search
window.products = [
    {
        id: 1,
        name: "Yara - Lataffa",
        description: "A rich, woody scent with hints of amber and spice.",
        price: 30.00,
        image: "images/perfume1.jpg",
        placeholder: "fas fa-wine-bottle",
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Cherry Gold - Brandy Designs",
        description: "Warm amber notes blended with Irish moss and oud.",
        price: 25.00,
        image: "images/perfume2.jpg",
        placeholder: "fas fa-wine-bottle",
        badge: "New"
    },
    {
        id: 3,
        name: "Yara Tous - Lattafa",
        description: "Fresh green notes with a deep oud base.",
        price: 30.00,
        image: "images/perfume3.jpg",
        placeholder: "fas fa-wine-bottle",
        badge: "Premium"
    },
    {
        id: 4,
        name: "Badee al Oud - Lattafa",
        description: "Floral rose notes intertwined with smoky oud.",
        price: 30.00,
        image: "images/perfume4.jpg",
        placeholder: "fas fa-wine-bottle"
    },
    {
        id: 5,
        name: "Omnery - Brandy",
        description: "Deep woody notes with hints of leather and spice.",
        price: 28.00,
        image: "images/perfume5.jpg",
        placeholder: "fas fa-wine-bottle"
    },
    {
        id: 6,
        name: "Oud Najdia - Lattafa",
        description: "Exotic saffron blended with precious oud.",
        price: 25.00,
        image: "images/perfume6.jpg",
        placeholder: "fas fa-wine-bottle",
        badge: "Luxury"
    }
];

// Main initialization script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Oud Éire website initialized');
    
    // Initialize all modules
    initNavigation();
    initProducts();
    initCart();
    
    // Load initial page content
    loadHomePageProducts();
});

function initProducts() {
    console.log('Products module initialized');
}

function loadHomePageProducts() {
    const productsGrid = document.querySelector('#home-page .products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = window.products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-image-placeholder">
                        <i class="${product.placeholder}"></i>
                    </div>
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">€${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button><i class="fas fa-heart"></i> Wishlist</button>
                        <button><i class="fas fa-shopping-bag"></i> Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        initializeProductImages();
    }
}

function initializeProductImages() {
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        const placeholder = img.nextElementSibling;
        
        img.onload = () => {
            img.style.opacity = '1';
            if (placeholder) placeholder.style.display = 'none';
        };
        
        img.onerror = () => {
            if (placeholder) placeholder.style.display = 'flex';
            img.style.display = 'none';
        };
        
        if (img.complete) {
            img.style.opacity = '1';
            if (placeholder) placeholder.style.display = 'none';
        }
    });
}