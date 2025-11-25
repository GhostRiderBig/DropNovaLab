// ============================================================================
// DROPNOVA LAB - MAIN APPLICATION
// ============================================================================

const DropNovaApp = {
    // Configuration
    config: {
        headerSelector: '#dropnova-lab',
        menuToggleSelector: '#menuToggle',
        navMenuSelector: '#navMenu',
        themeToggleSelector: '#themeToggle',
        scrollThreshold: 50,
        storageKey: 'dropnova-theme',
    },

    // State
    state: {
        menuOpen: false,
        currentTheme: 'light',
        scrolled: false,
    },

    // Initialize the application
    init() {
        this.setupTheme();
        this.setupHeader();
        this.setupMenuToggle();
        this.setupThemeToggle();
        this.setupScrollListener();
        this.setupSmoothScroll();
    },

    // ========================================================================
    // THEME MANAGEMENT
    // ========================================================================

    setupTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem(this.config.storageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.state.currentTheme = savedTheme || (prefersDark ?  'dark' : 'light');
        this.applyTheme(this.state.currentTheme);
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.state.currentTheme = theme;
        localStorage.setItem(this.config.storageKey, theme);
    },

    toggleTheme() {
        const newTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    },

    setupThemeToggle() {
        const themeToggle = document.querySelector(this.config.themeToggleSelector);
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    // ========================================================================
    // HEADER MANAGEMENT
    // ========================================================================

    setupHeader() {
        const header = document.querySelector(this.config.headerSelector);
        if (!header) return;

        // Add scroll listener for header shadow
        window.addEventListener('scroll', () => {
            if (window.scrollY > this.config.scrollThreshold) {
                if (!this.state.scrolled) {
                    header.classList.add('scrolled');
                    this.state.scrolled = true;
                }
            } else {
                if (this.state.scrolled) {
                    header.classList.remove('scrolled');
                    this.state.scrolled = false;
                }
            }
        });
    },

    // ========================================================================
    // MOBILE MENU MANAGEMENT
    // ========================================================================

    setupMenuToggle() {
        const menuToggle = document.querySelector(this.config.menuToggleSelector);
        const navMenu = document.querySelector(this.config.navMenuSelector);

        if (!menuToggle || !navMenu) return;

        // Toggle menu on button click
        menuToggle.addEventListener('click', () => {
            this.toggleMenu(menuToggle, navMenu);
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu(menuToggle, navMenu);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest(this.config.headerSelector)) {
                this.closeMenu(menuToggle, navMenu);
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu(menuToggle, navMenu);
            }
        });
    },

    toggleMenu(menuToggle, navMenu) {
        this.state.menuOpen ? this.closeMenu(menuToggle, navMenu) : this.openMenu(menuToggle, navMenu);
    },

    openMenu(menuToggle, navMenu) {
        this.state.menuOpen = true;
        menuToggle.classList.add('active');
        navMenu.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    },

    closeMenu(menuToggle, navMenu) {
        this.state.menuOpen = false;
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    },

    // ========================================================================
    // SCROLL MANAGEMENT
    // ========================================================================

    setupScrollListener() {
        window.addEventListener('scroll', () => {
            // Additional scroll-based functionality can be added here
        });
    },

    // ========================================================================
    // SMOOTH SCROLL
    // ========================================================================

    setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            // Close mobile menu if open
            const menuToggle = document.querySelector(this.config.menuToggleSelector);
            const navMenu = document.querySelector(this.config.navMenuSelector);
            if (this.state.menuOpen) {
                this.closeMenu(menuToggle, navMenu);
            }

            // Scroll to target
            const headerHeight = document.querySelector(this.config.headerSelector)?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });
        });
    },

    // ========================================================================
    // HERO SECTION ANIMATIONS
    // ========================================================================

    setupHeroAnimations() {
        const heroSection = document.querySelector('#build-your-dropshipping-business-effortlessly');
        if (!heroSection) return;

        // Fade in hero content on page load
        const heroContent = heroSection.querySelector('.hero-content');
        const heroImage = heroSection.querySelector('.hero-image');

        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }

        if (heroImage) {
            heroImage.style.opacity = '0';
            heroImage.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                heroImage.style.transition = 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s';
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateY(0)';
            }, 100);
        }
    },

    // ========================================================================
    // HOW IT WORKS SECTION ANIMATIONS
    // ========================================================================

    setupHowItWorksAnimations() {
        const section = document.querySelector('#how-it-works-4-simple-steps');
        if (!section) return;

        const cards = section.querySelectorAll('.step-card');
        if (cards.length === 0) return;

        // Use Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Initialize cards with hidden state
        cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    },

    // ========================================================================
    // BENEFITS SECTION ANIMATIONS
    // ========================================================================

    setupBenefitsAnimations() {
        const section = document.querySelector('#key-benefits-why-choose-dropshipping');
        if (!section) return;

        const cards = section.querySelectorAll('.benefit-card');
        if (cards.length === 0) return;

        // Use Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Initialize cards with hidden state
        cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    },

    // ========================================================================
    // TRENDING PRODUCTS SECTION ANIMATIONS
    // ========================================================================

    setupTrendingProductsAnimations() {
        const section = document.querySelector('#trending-products-market-opportunities');
        if (!section) return;

        const cards = section.querySelectorAll('.product-card');
        if (cards.length === 0) return;

        // Use Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() =>  {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Initialize cards with hidden state
        cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    },

    // ========================================================================
    // EXPERT Q&A SECTION FUNCTIONALITY
    // ========================================================================

    setupExpertQA() {
        const qaItems = document.querySelectorAll('.qa-item');
        if (qaItems.length === 0) return;

        qaItems.forEach((item) => {
            const button = item.querySelector('.qa-question');
            const answer = item.querySelector('.qa-answer');

            if (!button || !answer) return;

            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                
                // Close all other items
                qaItems.forEach((otherItem) => {
                    if (otherItem !== item) {
                        const otherButton = otherItem.querySelector('.qa-question');
                        const otherAnswer = otherItem.querySelector('.qa-answer');
                        if (otherButton && otherAnswer) {
                            otherButton.setAttribute('aria-expanded', 'false');
                            otherAnswer.setAttribute('hidden', '');
                        }
                    }
                });

                // Toggle current item
                if (isExpanded) {
                    button.setAttribute('aria-expanded', 'false');
                    answer.setAttribute('hidden', '');
                } else {
                    button.setAttribute('aria-expanded', 'true');
                    answer.removeAttribute('hidden');
                }
            });

            // Keyboard navigation
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    },

    // ========================================================================
    // SUCCESS STORIES SECTION ANIMATIONS
    // ========================================================================

    setupSuccessStoriesAnimations() {
        const section = document.querySelector('#success-stories-real-results-from-real-entrepreneurs');
        if (!section) return;

        const cards = section.querySelectorAll('.story-card');
        if (cards.length === 0) return;

        // Use Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Initialize cards with hidden state
        cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    },
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DropNovaApp.init();
        DropNovaApp.setupHeroAnimations();
        DropNovaApp.setupHowItWorksAnimations();
        DropNovaApp.setupBenefitsAnimations();
        DropNovaApp.setupTrendingProductsAnimations();
        DropNovaApp.setupExpertQA();
        DropNovaApp.setupSuccessStoriesAnimations();
    });
} else {
    DropNovaApp.init();
    DropNovaApp.setupHeroAnimations();
    DropNovaApp.setupHowItWorksAnimations();
    DropNovaApp.setupBenefitsAnimations();
    DropNovaApp.setupTrendingProductsAnimations();
    DropNovaApp.setupExpertQA();
    DropNovaApp.setupSuccessStoriesAnimations();
}
