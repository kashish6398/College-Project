document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const invoiceDateEl = document.getElementById('invoice-date');
    const billProductImg = document.getElementById('bill-product-img');
    const billProductName = document.getElementById('bill-product-name');
    const billProductBrand = document.getElementById('bill-product-brand');
    const billProductCat = document.getElementById('bill-product-cat');
    
    // Calculation DOM fields
    const calcBasePrice = document.getElementById('calc-base-price');
    const calcDiscountPct = document.getElementById('calc-discount-pct');
    const calcDiscountAmt = document.getElementById('calc-discount-amt');
    const calcSubtotal = document.getElementById('calc-subtotal');
    const calcGst = document.getElementById('calc-gst');
    const calcShipping = document.getElementById('calc-shipping');
    const calcGrandTotal = document.getElementById('calc-grand-total');

    // Controls
    const btnBack = document.getElementById('btn-bill-back');
    const btnPlaceOrder = document.getElementById('btn-place-order');
    const successModal = document.getElementById('success-modal');
    const btnSuccessDismiss = document.getElementById('btn-success-dismiss');

    // State variable
    let selectedProduct = null;

    initBillPage();

    function initBillPage() {
        // Formatted Date setting
        const today = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        // Generate a random invoice sequence number
        const randomSequence = Math.floor(100000 + Math.random() * 900000);
        invoiceDateEl.textContent = `Invoice #INV-2026-${randomSequence} | Date: ${formattedDate}`;

        // Retrieve product details object from LocalStorage
        const storedProductStr = localStorage.getItem('selectedProduct');
        if (!storedProductStr) {
            console.warn('No product details found in LocalStorage, returning to catalog.');
            window.location.href = 'index.html';
            return;
        }

        try {
            selectedProduct = JSON.parse(storedProductStr);
            renderInvoice();
            setupInvoiceEvents();
        } catch (error) {
            console.error('Failed to parse selected product data from local storage:', error);
            window.location.href = 'index.html';
        }
    }

    // Process and display calculation breakdown
    function renderInvoice() {
        if (!selectedProduct) return;

        // Visual Product Elements mapping
        billProductImg.src = selectedProduct.thumbnail || 'https://via.placeholder.com/150';
        billProductImg.alt = selectedProduct.title;
        billProductName.textContent = selectedProduct.title;
        billProductBrand.textContent = `Brand: ${selectedProduct.brand || 'Generic'}`;
        billProductCat.textContent = selectedProduct.category;

        // Financial Calculation formulas:
        const originalPrice = selectedProduct.price || 0;
        const discountPct = selectedProduct.discountPercentage || 0;
        
        // 1. Discount calculations
        const discountAmt = originalPrice * (discountPct / 100);
        const subtotal = originalPrice - discountAmt;

        // 2. GST calculations (18% on the subtotal)
        const gstAmt = subtotal * 0.18;

        // 3. Shipping Charge ($40.00 flat rate)
        const shippingCharge = 40.00;

        // 4. Grand Total calculation: Subtotal + GST + Shipping
        const grandTotal = subtotal + gstAmt + shippingCharge;

        // Update calculations inside invoice table
        calcBasePrice.textContent = `$${originalPrice.toFixed(2)}`;
        calcDiscountPct.textContent = `${discountPct.toFixed(1)}%`;
        calcDiscountAmt.textContent = `-$${discountAmt.toFixed(2)}`;
        calcSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        calcGst.textContent = `$${gstAmt.toFixed(2)}`;
        calcShipping.textContent = `$${shippingCharge.toFixed(2)}`;
        calcGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
    }

    // Set up listeners for Checkout invoice flow
    function setupInvoiceEvents() {
        // Invoice Page Back Button logic: Return back to Product Detail page
        btnBack.addEventListener('click', () => {
            window.location.href = 'product.html';
        });

        // Place Order confirmation
        btnPlaceOrder.addEventListener('click', () => {
            // Display modal popup block
            successModal.classList.remove('hidden');
        });

        // Dismiss Modal order complete
        btnSuccessDismiss.addEventListener('click', () => {
            // Clear LocalStorage data
            localStorage.clear();
            
            // Redirect user back to catalog index page
            window.location.href = 'index.html';
        });
        
        // Optional: click outside modal-card on modal-overlay to dismiss checkout
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                localStorage.clear();
                window.location.href = 'index.html';
            }
        });
    }
});
