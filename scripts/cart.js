// Shopping cart functionality
let cart = [];

function initCart() {
    console.log('Cart module initialized');
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('oudEireCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    
    // Cart toggle functionality
    const cartIcon = document.querySelector('.nav-icons a[href="#"]:has(.fa-shopping-bag)');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCloseBtn = document.querySelector('.cart-close-btn');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', closeCart);
    }
    
    // Close cart with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
            closeCart();
        }
    });
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.product-actions button') && e.target.closest('button').textContent.includes('Add to Cart')) {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('€', ''));
            const productImage = productCard.querySelector('.product-image img')?.src || '';
            
            addToCart({
                id: Date.now(), // Simple ID generation
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
    });
    
    // Initialize cart display
    updateCartDisplay();
}

function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
    
    // Show notification
    showCartNotification(`${product.name} added to cart`);
    
    // Open cart automatically if it's the first item
    if (cart.length === 1) {
        setTimeout(() => openCart(), 500);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
    
    if (cart.length === 0) {
        showCartNotification('Item removed from cart');
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        
        // Remove item if quantity becomes 0
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartDisplay();
            saveCartToStorage();
        }
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartSubtotal = document.querySelector('.cart-subtotal-amount');
    const cartTotal = document.querySelector('.cart-total-amount');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    if (cart.length === 0) {
        if (cartItems) cartItems.classList.remove('active');
        if (cartEmpty) cartEmpty.style.display = 'flex';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        if (cartItems) cartItems.classList.add('active');
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = false;
        
        // Update cart items
        if (cartItems) {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        ${item.image ? 
                            `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : 
                            ''
                        }
                        <div class="cart-item-placeholder" style="${item.image ? 'display: none;' : ''}">
                            <i class="fas fa-wine-bottle"></i>
                        </div>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `€${subtotal.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `€${subtotal.toFixed(2)}`;
}

function saveCartToStorage() {
    localStorage.setItem('oudEireCart', JSON.stringify(cart));
}

function showCartNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('active');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Make functions globally available for onclick attributes
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;