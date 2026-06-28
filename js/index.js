document.addEventListener('DOMContentLoaded', () => {
    const USD_TO_INR = 83;
    // DOM Elements
    const productsGrid = document.getElementById('products-grid');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const retryBtn = document.getElementById('retry-btn');
    const navbar = document.getElementById('navbar');

    // App State
    let products = [];
    let activeSearch = '';
    let activeCategory = '';

    // Scroll listener for navbar scrolled styling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initialize application
    initApp();

    async function initApp() {
        showLoader();
        hideError();
        hideEmptyState();
        productsGrid.innerHTML = '';
        
        try {
            await fetchProducts();
            populateCategories();
            renderProducts();
            setupEventListeners();
        } catch (error) {
            console.error('Initialization Error:', error);
            showError();
        } finally {
            hideLoader();
        }
    }

    // Fetch products from DummyJSON
    async function fetchProducts() {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        products = data.products || [];
    }

    // Populate category filter dropdown dynamically
    function populateCategories() {
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        const uniqueCategories = [...new Set(products.map(p => p.category))].sort();
        
        uniqueCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            categoryFilter.appendChild(option);
        });
    }

    // Set up search and filter events
    function setupEventListeners() {
        searchInput.addEventListener('input', (e) => {
            activeSearch = e.target.value.trim().toLowerCase();
            renderProducts();
        });

        categoryFilter.addEventListener('change', (e) => {
            activeCategory = e.target.value;
            renderProducts();
        });

        retryBtn.addEventListener('click', initApp);
    }

    // Render products to grid
    function renderProducts() {
        productsGrid.innerHTML = '';

        const filteredProducts = products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(activeSearch);
            const matchesCategory = activeCategory === '' || product.category === activeCategory;
            return matchesSearch && matchesCategory;
        });

        if (filteredProducts.length === 0) {
            showEmptyState();
            return;
        }

        hideEmptyState();

        filteredProducts.forEach(product => {
            const card = createProductCard(product);
            productsGrid.appendChild(card);
        });
    }

    // Generate product card element
    function createProductCard(product) {
        const cardDiv = document.createElement('article');
        cardDiv.className = 'product-card';

        // Setup rating stars
        const rating = Math.round(product.rating || 0);
        let starHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starHTML += '<i class="fa-solid fa-star"></i>';
            } else {
                starHTML += '<i class="fa-regular fa-star"></i>';
            }
        }

        // Kept simple: Product Image, Title, Category, Price, Rating, and View Details button
        cardDiv.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${product.thumbnail || 'https://via.placeholder.com/300'}" alt="${product.title}" class="card-img" loading="lazy">
            </div>
            <div class="card-content">
                <span class="card-category">${product.category}</span>
                <h3 class="card-title" title="${product.title}">${product.title}</h3>
                
                <div class="rating-container">
                    <span class="stars">${starHTML}</span>
                    <span class="rating-value">(${product.rating?.toFixed(1) || '0.0'})</span>
                </div>

                <div class="price-container">
                    <span class="discounted-price">₹${(product.price * USD_TO_INR).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <button class="btn-card-details" data-id="${product.id}">
                    <span>View Details</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `;

        // Click handler to view product details
        const detailsBtn = cardDiv.querySelector('.btn-card-details');
        detailsBtn.addEventListener('click', () => {
            const prodId = detailsBtn.getAttribute('data-id');
            localStorage.setItem('productId', prodId);
            window.location.href = 'product.html';
        });

        return cardDiv;
    }

    function showLoader() { loader.classList.remove('hidden'); }
    function hideLoader() { loader.classList.add('hidden'); }
    function showError() { errorMessage.classList.remove('hidden'); }
    function hideError() { errorMessage.classList.add('hidden'); }
    function showEmptyState() { emptyState.classList.remove('hidden'); }
    function hideEmptyState() { emptyState.classList.add('hidden'); }
});
