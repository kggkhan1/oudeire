// Account and Authentication System
class AccountSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.checkCurrentSession();
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Modal functionality
        this.setupModalEvents();
        
        // Form submissions
        this.setupFormEvents();
        
        // Listen for auth state changes
        if (window.supabaseClient) {
            window.supabaseClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    this.currentUser = session.user;
                    this.updateUI();
                    this.closeModal();
                    Utils.showNotification('Successfully signed in!', 'success');
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    this.updateUI();
                    Utils.showNotification('Successfully signed out!', 'success');
                }
            });
        }
    }

    setupModalEvents() {
        const modal = document.getElementById('account-modal');
        const userIcon = document.querySelector('.fa-user');
        const closeBtn = modal?.querySelector('.close-btn');

        // Open modal on user icon click
        if (userIcon) {
            userIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }

        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close modal when clicking outside
        if (modal) {
            window.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Switch between login and register forms
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');

        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }
    }

    setupFormEvents() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async checkCurrentSession() {
        if (!window.supabaseClient) return;

        try {
            const { data: { session }, error } = await window.supabaseClient.auth.getSession();
            if (error) throw error;
            
            this.currentUser = session?.user || null;
        } catch (error) {
            console.error('Error checking session:', error);
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!window.supabaseClient) {
            Utils.showNotification('Authentication service not available', 'error');
            return;
        }

        try {
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Success handled by auth state change listener
        } catch (error) {
            console.error('Login error:', error);
            Utils.showNotification(error.message || 'Login failed', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const password = formData.get('password');

        if (!window.supabaseClient) {
            Utils.showNotification('Authentication service not available', 'error');
            return;
        }

        try {
            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                Utils.showNotification('Registration successful! Please check your email for verification.', 'success');
                this.showLoginForm();
            }
        } catch (error) {
            console.error('Registration error:', error);
            Utils.showNotification(error.message || 'Registration failed', 'error');
        }
    }

    async handleLogout() {
        if (!window.supabaseClient) return;

        try {
            const { error } = await window.supabaseClient.auth.signOut();
            if (error) throw error;
            
            // Success handled by auth state change listener
        } catch (error) {
            console.error('Logout error:', error);
            Utils.showNotification('Logout failed', 'error');
        }
    }

    openModal() {
        const modal = document.getElementById('account-modal');
        if (modal) {
            modal.style.display = 'flex';
            // Show login form by default
            this.showLoginForm();
        }
    }

    closeModal() {
        const modal = document.getElementById('account-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
    }

    showRegisterForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
    }

    updateUI() {
        const userIcon = document.querySelector('.fa-user');
        const authToggle = document.querySelector('.auth-toggle');
        
        if (this.currentUser) {
            // User is logged in
            if (userIcon) {
                userIcon.classList.remove('fa-user');
                userIcon.classList.add('fa-user-check');
            }
            
            // Update account modal to show user info
            this.updateAccountModal();
        } else {
            // User is logged out
            if (userIcon) {
                userIcon.classList.remove('fa-user-check');
                userIcon.classList.add('fa-user');
            }
        }
    }

    updateAccountModal() {
        const modal = document.getElementById('account-modal');
        if (!modal || !this.currentUser) return;

        const userEmail = this.currentUser.email;
        const userName = this.currentUser.user_metadata?.full_name || 'User';
        
        // Update modal content for logged-in state
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = `
                <span class="close-btn">&times;</span>
                <h2>Welcome, ${userName}!</h2>
                <div class="user-info">
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <div class="account-actions">
                        <button class="btn btn-outline" id="view-orders">View Orders</button>
                        <button class="btn btn-outline" id="view-wishlist">Wishlist</button>
                        <button class="btn btn-primary" id="logout-btn">Logout</button>
                    </div>
                </div>
            `;

            // Add event listeners for new buttons
            const logoutBtn = document.getElementById('logout-btn');
            const viewOrders = document.getElementById('view-orders');
            const viewWishlist = document.getElementById('view-wishlist');

            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.handleLogout());
            }

            if (viewOrders) {
                viewOrders.addEventListener('click', () => this.viewOrders());
            }

            if (viewWishlist) {
                viewWishlist.addEventListener('click', () => this.viewWishlist());
            }

            // Update close button listener
            const closeBtn = modalContent.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }
        }
    }

    viewOrders() {
        Utils.showNotification('Order history feature coming soon!', 'info');
        this.closeModal();
    }

    viewWishlist() {
        Utils.showNotification('Wishlist feature coming soon!', 'info');
        this.closeModal();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialize account system
document.addEventListener('DOMContentLoaded', function() {
    window.accountSystem = new AccountSystem();
});