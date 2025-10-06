// Main initialization script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Oud Éire website initialized');
    
    // Initialize all modules
    initNavigation();
    initProducts();
    initCart();
    
    // Load products based on current page
    if (document.querySelector('#home-page')) {
        loadHomePageProducts();
    }
    if (document.querySelector('#shop-page')) {
        loadShopPageProducts();
    }
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

function initNavigation() {
    console.log('Navigation initialized');
    // Add navigation logic here
}

function initProducts() {
    console.log('Products module initialized');
}

function initCart() {
    console.log('Cart module initialized');
    // Add cart logic here
}

function loadHomePageProducts() {
    const productsGrid = document.querySelector('#home-page .products-grid');
    if (productsGrid) {
        // Show only featured products on home page (first 3)
        const featuredProducts = window.products.slice(0, 3);
        renderProducts(productsGrid, featuredProducts);
    }
}

function loadShopPageProducts() {
    const productsGrid = document.querySelector('#shop-page .products-grid');
    if (productsGrid) {
        // Show all products on shop page
        renderProducts(productsGrid, window.products);
        initFilters();
    }
}

function renderProducts(container, products) {
    container.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
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
                    <button class="wishlist-btn"><i class="fas fa-heart"></i> Wishlist</button>
                    <button class="add-to-cart-btn"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
    
    initializeProductImages();
    attachProductEvents();
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

function attachProductEvents() {
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId);
            const product = window.products.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
                showNotification(`${product.name} added to cart!`);
            }
        });
    });
    
    // Wishlist functionality
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId);
            const product = window.products.find(p => p.id === productId);
            
            if (product) {
                toggleWishlist(product);
            }
        });
    });
}

function initFilters() {
    console.log('Filters initialized');
    // Add filter logic here
    const filtersSidebar = document.querySelector('.filters-sidebar');
    if (filtersSidebar) {
        filtersSidebar.innerHTML = `
            <div class="filter-group">
                <h4>Price Range</h4>
                <div class="price-filter">
                    <input type="range" id="price-range" min="20" max="50" value="50" class="slider">
                    <div class="price-values">
                        <span>€20</span>
                        <span id="current-price">€50</span>
                    </div>
                </div>
            </div>
            <div class="filter-group">
                <h4>Brand</h4>
                <label><input type="checkbox" value="Lattafa" checked> Lattafa</label>
                <label><input type="checkbox" value="Brandy" checked> Brandy Designs</label>
            </div>
            <button class="apply-filters-btn">Apply Filters</button>
        `;
        
        // Add filter event listeners
        const priceRange = document.getElementById('price-range');
        const currentPrice = document.getElementById('current-price');
        
        if (priceRange && currentPrice) {
            priceRange.addEventListener('input', function() {
                currentPrice.textContent = `€${this.value}`;
            });
        }
        
        document.querySelector('.apply-filters-btn').addEventListener('click', applyFilters);
    }
}

function applyFilters() {
    const priceRange = document.getElementById('price-range');
    const maxPrice = priceRange ? parseInt(priceRange.value) : 50;
    
    const brandCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    const selectedBrands = Array.from(brandCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    
    const filteredProducts = window.products.filter(product => {
        const priceMatch = product.price <= maxPrice;
        const brandMatch = selectedBrands.some(brand => product.name.includes(brand));
        return priceMatch && brandMatch;
    });
    
    const productsGrid = document.querySelector('#shop-page .products-grid');
    if (productsGrid) {
        renderProducts(productsGrid, filteredProducts);
    }
}

function addToCart(product) {
    console.log('Adding to cart:', product.name);
    // Implement cart logic here
}

function toggleWishlist(product) {
    console.log('Toggling wishlist for:', product.name);
    // Implement wishlist logic here
}

function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c1810;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add some basic CSS for the new elements
const style = document.createElement('style');
style.textContent 
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("account-modal");
  const userIcon = document.querySelector(".fa-user");
  const closeBtn = modal.querySelector(".close-btn");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  // Open modal on user icon click
  userIcon.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });

  // Close modal
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Switch forms
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });
});
// Add to your existing main.js
function initNavigation() {
    console.log('Navigation initialized');
    
    // Fix contact page navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateToPage(targetPage);
        });
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}

function navigateToPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
    
    // Load page-specific content
    loadPageContent(pageName);
}

function loadPageContent(pageName) {
    switch(pageName) {
        case 'home':
            loadHomePageProducts();
            break;
        case 'shop':
            loadShopPageProducts();
            break;
        case 'contact':
            // Contact system will handle this
            if (window.contactSystem) {
                window.contactSystem.loadContactPage();
            }
            break;
        case 'about':
            // About page content is static
            break;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

