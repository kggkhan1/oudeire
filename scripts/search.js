// Search functionality
class SearchSystem {
    constructor() {
        this.products = [];
        this.searchResults = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.setupSearchInput();
    }

    loadProducts() {
        // Use the products from main.js or fetch from API
        this.products = window.products || [];
    }

    setupEventListeners() {
        // Search icon click
        const searchIcon = document.querySelector('.nav-icons a[href="#"]:has(.fa-search)');
        const searchSidebar = document.getElementById('search-sidebar');
        const searchOverlay = document.getElementById('search-overlay');
        const searchCloseBtn = document.querySelector('.search-close-btn');
        const searchClearBtn = document.querySelector('.search-clear-btn');

        if (searchIcon) {
            searchIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSearch();
            });
        }

        if (searchCloseBtn) {
            searchCloseBtn.addEventListener('click', () => {
                this.closeSearch();
            });
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', () => {
                this.closeSearch();
            });
        }

        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Suggestion tags
        document.querySelectorAll('.suggestion-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const query = tag.getAttribute('data-query');
                this.performSearch(query);
            });
        });

        // Category suggestions
        document.querySelectorAll('.category-suggestion').forEach(category => {
            category.addEventListener('click', () => {
                const categoryType = category.getAttribute('data-category');
                this.searchByCategory(categoryType);
            });
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSearch();
            }
        });
    }

    setupSearchInput() {
        const searchInput = document.getElementById('search-input');
        const searchClearBtn = document.querySelector('.search-clear-btn');

        if (searchInput) {
            // Real-time search
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                this.handleSearchInput(query);
            });

            // Enter key to search
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        this.performSearch(query);
                    }
                }
            });

            // Focus on open
            searchInput.addEventListener('focus', () => {
                const query = searchInput.value.trim();
                if (query) {
                    this.showSearchResults();
                }
            });
        }
    }

    handleSearchInput(query) {
        const searchClearBtn = document.querySelector('.search-clear-btn');
        
        // Show/hide clear button
        if (searchClearBtn) {
            searchClearBtn.style.display = query ? 'flex' : 'none';
        }

        if (query.length === 0) {
            this.showSuggestions();
            return;
        }

        if (query.length < 2) {
            this.showTypingIndicator();
            return;
        }

        this.showLoading();
        this.debouncedSearch(query);
    }

    debouncedSearch = this.debounce((query) => {
        this.performSearch(query);
    }, 300);

    debounce(func, wait) {
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

    performSearch(query) {
        if (!query) {
            this.showSuggestions();
            return;
        }

        this.showLoading();

        // Simulate API call delay
        setTimeout(() => {
            const results = this.searchProducts(query);
            this.displayResults(results, query);
        }, 500);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        
        return this.products.filter(product => {
            const searchableText = `
                ${product.name} 
                ${product.description}
                ${product.badge || ''}
            `.toLowerCase();

            return searchableText.includes(searchTerm);
        });
    }

    searchByCategory(category) {
        let results = [];
        
        switch(category) {
            case 'bestsellers':
                results = this.products.filter(product => product.badge === 'Bestseller');
                break;
            case 'new':
                results = this.products.filter(product => product.badge === 'New');
                break;
            case 'premium':
                results = this.products.filter(product => product.badge === 'Premium' || product.price > 90);
                break;
            default:
                results = this.products;
        }
        
        this.displayResults(results, category);
    }

    displayResults(results, query) {
        this.searchResults = results;
        this.hideLoading();
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = query;
        }

        if (results.length === 0) {
            this.showNoResults(query);
        } else {
            this.showSearchResults();
        }
    }

    showSearchResults() {
        const resultsContainer = document.querySelector('.search-results');
        const suggestions = document.querySelector('.search-suggestions');
        const emptyState = document.querySelector('.search-empty');
        const resultsCount = document.querySelector('.search-results-count');

        // Hide other states
        suggestions.classList.add('hidden');
        emptyState.style.display = 'none';

        // Show results
        resultsContainer.classList.add('active');

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = `${this.searchResults.length} product${this.searchResults.length !== 1 ? 's' : ''} found`;
        }

        // Render results
        resultsContainer.innerHTML = `
            <div class="search-results-header">
                <div class="search-results-count">${this.searchResults.length} product${this.searchResults.length !== 1 ? 's' : ''} found</div>
                <button class="search-results-clear" onclick="searchSystem.clearSearch()">Clear</button>
            </div>
            ${this.searchResults.map(product => `
                <div class="search-result-item" onclick="searchSystem.navigateToProduct('${product.name}')">
                    <div class="search-result-image">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : 
                            ''
                        }
                        <div class="search-result-placeholder" style="${product.image ? 'display: none;' : ''}">
                            <i class="fas fa-wine-bottle"></i>
                        </div>
                    </div>
                    <div class="search-result-details">
                        <div class="search-result-name">
                            ${product.name}
                            ${product.badge ? `<span class="search-result-badge">${product.badge}</span>` : ''}
                        </div>
                        <div class="search-result-description">${product.description}</div>
                        <div class="search-result-price">€${product.price.toFixed(2)}</div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    showNoResults(query) {
        const resultsContainer = document.querySelector('.search-results');
        const suggestions = document.querySelector('.search-suggestions');
        const emptyState = document.querySelector('.search-empty');

        suggestions.classList.add('hidden');
        emptyState.style.display = 'none';
        resultsContainer.classList.add('active');

        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>No results found for "${query}"</p>
                <span>Try different keywords or browse our categories</span>
            </div>
        `;
    }

    showSuggestions() {
        const resultsContainer = document.querySelector('.search-results');
        const suggestions = document.querySelector('.search-suggestions');
        const emptyState = document.querySelector('.search-empty');

        resultsContainer.classList.remove('active');
        suggestions.classList.remove('hidden');
        emptyState.style.display = 'flex';
    }

    showLoading() {
        const loading = document.querySelector('.search-loading');
        const resultsContainer = document.querySelector('.search-results');
        const suggestions = document.querySelector('.search-suggestions');
        const emptyState = document.querySelector('.search-empty');

        resultsContainer.classList.remove('active');
        suggestions.classList.add('hidden');
        emptyState.style.display = 'none';
        loading.classList.add('active');
    }

    hideLoading() {
        const loading = document.querySelector('.search-loading');
        loading.classList.remove('active');
    }

    showTypingIndicator() {
        const resultsContainer = document.querySelector('.search-results');
        const suggestions = document.querySelector('.search-suggestions');
        const emptyState = document.querySelector('.search-empty');

        resultsContainer.classList.remove('active');
        suggestions.classList.add('hidden');
        emptyState.style.display = 'none';
    }

    clearSearch() {
        const searchInput = document.getElementById('search-input');
        const searchClearBtn = document.querySelector('.search-clear-btn');

        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }

        if (searchClearBtn) {
            searchClearBtn.style.display = 'none';
        }

        this.showSuggestions();
    }

    openSearch() {
        const searchSidebar = document.getElementById('search-sidebar');
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('search-input');

        if (searchSidebar && searchOverlay) {
            searchSidebar.classList.add('active');
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;

            // Focus input after animation
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        }
    }

    closeSearch() {
        const searchSidebar = document.getElementById('search-sidebar');
        const searchOverlay = document.getElementById('search-overlay');

        if (searchSidebar && searchOverlay) {
            searchSidebar.classList.remove('active');
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            this.isOpen = false;

            // Clear search when closing
            this.clearSearch();
        }
    }

    navigateToProduct(productName) {
        // Navigate to product page or show product details
        console.log('Navigating to product:', productName);
        
        // For demo purposes, just close search and show a notification
        this.closeSearch();
        this.showProductNotification(productName);
    }

    showProductNotification(productName) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Viewing ${productName}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('active');
        }, 100);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
}

// Initialize search system
let searchSystem;

document.addEventListener('DOMContentLoaded', function() {
    searchSystem = new SearchSystem();
});

// Make search system globally available
window.searchSystem = searchSystem;