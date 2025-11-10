// Product Data
const products = [
    {
        id: 1,
        name: "Nike Air Max 270",
        category: "sneakers",
        price: 1899000,
        description: "Sepatu sneakers dengan cushioning maksimal untuk kenyamanan sepanjang hari",
        icon: "👟"
    },
    {
        id: 2,
        name: "Adidas Ultraboost",
        category: "running",
        price: 2499000,
        description: "Sepatu running dengan teknologi Boost untuk performa maksimal",
        icon: "🏃"
    },
    {
        id: 3,
        name: "Converse Chuck Taylor",
        category: "casual",
        price: 899000,
        description: "Sepatu casual klasik yang timeless dan stylish",
        icon: "👟"
    },
    {
        id: 4,
        name: "Puma RS-X",
        category: "sneakers",
        price: 1599000,
        description: "Sepatu sneakers dengan desain retro futuristic yang eye-catching",
        icon: "👟"
    },
    {
        id: 5,
        name: "New Balance 574",
        category: "casual",
        price: 1299000,
        description: "Sepatu casual dengan comfort dan style yang seimbang",
        icon: "👟"
    },
    {
        id: 6,
        name: "Asics Gel-Kayano",
        category: "running",
        price: 2199000,
        description: "Sepatu running dengan stabilitas dan support terbaik",
        icon: "🏃"
    },
    {
        id: 7,
        name: "Vans Old Skool",
        category: "casual",
        price: 799000,
        description: "Sepatu casual dengan desain ikonik dan versatile",
        icon: "👟"
    },
    {
        id: 8,
        name: "Reebok Classic Leather",
        category: "casual",
        price: 1099000,
        description: "Sepatu casual dengan material leather premium",
        icon: "👟"
    },
    {
        id: 9,
        name: "Under Armour HOVR",
        category: "running",
        price: 1799000,
        description: "Sepatu running dengan teknologi HOVR untuk energy return",
        icon: "🏃"
    },
    {
        id: 10,
        name: "Nike Air Jordan 1",
        category: "sneakers",
        price: 2799000,
        description: "Sepatu sneakers legendaris dengan heritage basketball",
        icon: "🏀"
    },
    {
        id: 11,
        name: "Adidas Stan Smith",
        category: "casual",
        price: 1199000,
        description: "Sepatu casual minimalis yang elegant dan clean",
        icon: "👟"
    },
    {
        id: 12,
        name: "Clarks Desert Boot",
        category: "formal",
        price: 1699000,
        description: "Sepatu formal casual dengan material suede premium",
        icon: "👞"
    },
    {
        id: 13,
        name: "Dr. Martens 1460",
        category: "formal",
        price: 2299000,
        description: "Sepatu boots dengan durability dan style yang iconic",
        icon: "🥾"
    },
    {
        id: 14,
        name: "Skechers Go Walk",
        category: "casual",
        price: 899000,
        description: "Sepatu casual ultra ringan untuk walking sehari-hari",
        icon: "👟"
    },
    {
        id: 15,
        name: "Mizuno Wave Rider",
        category: "running",
        price: 1899000,
        description: "Sepatu running dengan wave technology untuk smooth ride",
        icon: "🏃"
    },
    {
        id: 16,
        name: "Nike Tiempo Legend",
        category: "sport",
        price: 2199000,
        description: "Sepatu futsal/soccer dengan touch dan control sempurna",
        icon: "⚽"
    },
    {
        id: 17,
        name: "Adidas Predator",
        category: "sport",
        price: 2499000,
        description: "Sepatu soccer dengan teknologi untuk power dan precision",
        icon: "⚽"
    },
    {
        id: 18,
        name: "Bata Formal Oxford",
        category: "formal",
        price: 799000,
        description: "Sepatu formal klasik untuk acara resmi",
        icon: "👞"
    }
];

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const checkoutBtn = document.getElementById('checkoutBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

// Initialize
function init() {
    renderProducts();
    updateCartUI();
    attachEventListeners();
}

// Render Products
function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchesCategory = currentFilter === 'all' || product.category === currentFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-light);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">😔</div>
                <h3>Produk tidak ditemukan</h3>
                <p>Coba kata kunci atau kategori lain</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">Rp ${formatPrice(product.price)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Tambah
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showNotification('Produk ditambahkan ke keranjang! 🎉');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderCart();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
            renderCart();
        }
    }
}

// Render Cart
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Keranjang Kosong</h3>
                <p>Belum ada produk di keranjang Anda</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Rp ${formatPrice(item.price)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update Cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    totalPrice.textContent = `Rp ${formatPrice(total)}`;
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Format Price
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Attach Event Listeners
function attachEventListeners() {
    // Cart Modal
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        renderCart();
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            renderProducts();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Keranjang masih kosong! 🛒');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        alert(`Terima kasih telah berbelanja! 🎉\n\nTotal: Rp ${formatPrice(total)}\nJumlah item: ${itemCount}\n\nPesanan Anda akan segera diproses.`);
        
        cart = [];
        saveCart();
        updateCartUI();
        cartModal.classList.remove('active');
    });

    // Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navMenu.classList.remove('active');
            }
        });
    });
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize App
init();
