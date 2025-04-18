document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading delay
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 1500);

    // Sample Products with More Data
    const products = [
        {
            image: "https://m.media-amazon.com/images/I/71sBtM3Yi5L._AC_SX679_.jpg",
            title: "Wireless Noise Cancelling Headphones",
            price: 299.99,
            store: "Amazon",
            rating: 4,
            category: "electronics"
        },
        {
            image: "https://m.media-amazon.com/images/I/81K5Qd3V1CL._AC_UX679_.jpg",
            title: "Premium Leather Running Shoes",
            price: 129.99,
            store: "Nike",
            rating: 5,
            category: "fashion"
        },
        // Add more products...
    ];

    // Generate Product Cards
    const productGrid = document.getElementById('productGrid');
    
    const generateProductCard = (product) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" class="product-image">
            <button onclick="openARViewer('assets/models/${product.model}')">
                View in AR
            </button>
            <img src="${product.image}" class="product-image" alt="${product.title}" loading="lazy">
            <button class="wishlist-btn" onclick="toggleWishlist(this)">
                <i class="${isInWishlist(product) ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="rating">
                    ${Array(5).fill().map((_, i) => `
                        <i class="fas fa-star${i < product.rating ? '' : '-half-alt'}"></i>
                    `).join('')}
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-store">Sold by ${product.store}</p>
            </div>
        `;
        return card;
    };

    // Render Products
    products.forEach(product => {
        productGrid.appendChild(generateProductCard(product));
    });

    // Price Range Filter
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    priceRange.addEventListener('input', (e) => {
        const maxPrice = e.target.value;
        priceValue.textContent = `$0 - $${maxPrice}`;
        filterProducts();
    });

    // Category Filter
    document.querySelector('.filter-dropdown').addEventListener('change', filterProducts);

    // Search Functionality
    document.querySelector('.search-input').addEventListener('input', filterProducts);

    // Filter Products Function
    function filterProducts() {
        const searchTerm = document.querySelector('.search-input').value.toLowerCase();
        const maxPrice = parseFloat(priceRange.value);
        const category = document.querySelector('.filter-dropdown').value;

        document.querySelectorAll('.product-card').forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const price = parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
            const productCategory = card.dataset.category;

            const matchesSearch = title.includes(searchTerm);
            const matchesPrice = price <= maxPrice;
            const matchesCategory = category === 'all' || productCategory === category;

            card.style.display = (matchesSearch && matchesPrice && matchesCategory) ? 'block' : 'none';
        });
    }

    // Wishlist Functionality
    window.toggleWishlist = (btn) => {
        btn.classList.toggle('active');
        btn.querySelector('i').classList.toggle('far');
        btn.querySelector('i').classList.toggle('fas');
    };

    // Scroll to Top
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Check Wishlist Status
function isInWishlist(product) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.some(item => item.title === product.title);
}
// ---------- Firebase Integration ----------
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    // ... باقي الإعدادات
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// تسجيل الدخول
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log('تم التسجيل بنجاح:', result.user);
        }).catch((error) => {
            console.error('خطأ في التسجيل:', error);
        });
}

// ---------- AR Viewer ----------
function openARViewer(productModelUrl) {
    const arViewer = document.getElementById('arViewer');
    const arModel = document.getElementById('arModel');
    arModel.src = productModelUrl;
    arViewer.style.display = 'block';
}

function closeARViewer() {
    document.getElementById('arViewer').style.display = 'none';
}

// ---------- Loyalty System ----------
let loyaltyPoints = 0;

function updateLoyaltyPoints(points) {
    loyaltyPoints += points;
    document.getElementById('loyaltyPoints').textContent = `النقاط: ${loyaltyPoints}`;
    localStorage.setItem('loyaltyPoints', loyaltyPoints);
}

// ---------- PWA Setup ----------
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered');
            }).catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

 