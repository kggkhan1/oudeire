// Navigation functionality
function initNavigation() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
    
    // Page navigation
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target page
            const targetPage = this.getAttribute('data-page');
            
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show target page
            document.getElementById(`${targetPage}-page`).classList.add('active');
            menuToggle.classList.toggle("open");

            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Close mobile menu if open
            nav.classList.remove('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Load page-specific content
            loadPageContent(targetPage);
        });
    });
}

function loadPageContent(page) {
    switch(page) {
        case 'shop':
            loadShopPage();
            break;
        case 'about':
            loadAboutPage();
            break;
        case 'blog':
            loadBlogPage();
            break;
        case 'contact':
            loadContactPage();
            break;
    }
}

function loadShopPage() {
    const productsGrid = document.querySelector('#shop-page .products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <i class="${product.image}"></i>
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
    }
}

function loadAboutPage() {
    // About page specific content loading
    console.log('Loading about page content');
}

function loadContactPage() {
    // Contact page specific content loading
    console.log('Loading contact page content');
}
document.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.getElementById("explore-btn");
  const pages = document.querySelectorAll(".page");

  if (exploreBtn) {
    exploreBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Hide all pages
      pages.forEach(page => page.classList.remove("active"));

      // Show the shop page
      const shopPage = document.getElementById("shop-page");
      if (shopPage) {
        shopPage.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" }); // Optional smooth scroll
      }

      // Update nav link state if needed
      document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
      const shopNav = document.querySelector('.nav-link[data-page="shop"]');
      if (shopNav) shopNav.classList.add("active");
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");

  // Handle navigation clicks
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetPage = link.getAttribute("data-page");

      // Hide all pages
      pages.forEach(page => page.classList.remove("active"));

      // Show the selected page
      const target = document.getElementById(`${targetPage}-page`);
      if (target) target.classList.add("active");

      // Update active link styling
      navLinks.forEach(nav => nav.classList.remove("active"));
      link.classList.add("active");

      // Optional: scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Handle Explore Collection button
  const exploreBtn = document.getElementById("explore-btn");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector('.nav-link[data-page="shop"]').click();
    });
  }
});

