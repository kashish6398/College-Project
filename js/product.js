document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const detailsWrapper = document.getElementById('product-details-wrapper');
    
    // Media & Info Elements
    const mainProductImg = document.getElementById('main-product-img');
    const productCategory = document.getElementById('product-category');
    const productTitle = document.getElementById('product-title');
    const ratingStars = document.getElementById('rating-stars');
    const ratingValue = document.getElementById('rating-value');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    
    // Buttons
    const btnBack = document.getElementById('btn-back');
    const btnBuy = document.getElementById('btn-buy');

    // App State
    let productDetails = null;

    initProductPage();

    async function initProductPage() {
        const productId = localStorage.getItem('productId');
        if (!productId) {
            console.warn('No product ID found in LocalStorage, redirecting to catalog.');
            window.location.href = 'index.html';
            return;
        }

        showLoader();
        hideError();
        detailsWrapper.classList.add('hidden');

        try {
            await fetchProductDetails(productId);
            renderProductDetails();
            setupEventListeners();
        } catch (error) {
            console.error('Failed to load product details:', error);
            showError();
        } finally {
            hideLoader();
        }
    }

    // Fetch product details
    async function fetchProductDetails(id) {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch product details. Status: ${response.status}`);
        }
        productDetails = await response.json();
    }

    // Render detailed content
    function renderProductDetails() {
        if (!productDetails) return;

        // Image
        mainProductImg.src = productDetails.thumbnail || 'https://via.placeholder.com/600';
        mainProductImg.alt = productDetails.title;

        // Meta text mapping
        productCategory.textContent = productDetails.category;
        productTitle.textContent = productDetails.title;
        
        // Stars rendering
        const roundedRating = Math.round(productDetails.rating || 0);
        let starHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                starHTML += '<i class="fa-solid fa-star"></i>';
            } else {
                starHTML += '<i class="fa-regular fa-star"></i>';
            }
        }
        ratingStars.innerHTML = starHTML;
        ratingValue.textContent = `${productDetails.rating?.toFixed(1) || '0.0'} Out of 5`;

        // Price mapping (direct product price)
        productPrice.textContent = `$${productDetails.price.toFixed(2)}`;

        // Description
        productDescription.textContent = productDetails.description || 'No description available for this item.';

        // Reveal contents
        detailsWrapper.classList.remove('hidden');
    }

    // Set up button actions
    function setupEventListeners() {
        btnBack.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        btnBuy.addEventListener('click', () => {
            if (!productDetails) return;
            
            // Save the complete product object into LocalStorage and redirect to bill.html
            localStorage.setItem('selectedProduct', JSON.stringify(productDetails));
            window.location.href = 'bill.html';
        });
    }

    function showLoader() { loader.classList.remove('hidden'); }
    function hideLoader() { loader.classList.add('hidden'); }
    function showError() { errorMessage.classList.remove('hidden'); }
    function hideError() { errorMessage.classList.add('hidden'); }
});
