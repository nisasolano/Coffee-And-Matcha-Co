// Menu Data
const menuItems = [
    {
        id: 1,
        name: "Espresso",
        category: "coffee",
        price: 3.50,
        description: "Rich and bold Italian espresso",
        emoji: "☕"
    },
    {
        id: 2,
        name: "Cappuccino",
        category: "coffee",
        price: 4.50,
        description: "Espresso with steamed milk and foam",
        emoji: "☕"
    },
    {
        id: 3,
        name: "Latte",
        category: "coffee",
        price: 4.75,
        description: "Smooth espresso with steamed milk",
        emoji: "☕"
    },
    {
        id: 4,
        name: "Americano",
        category: "coffee",
        price: 3.75,
        description: "Espresso diluted with hot water",
        emoji: "☕"
    },
    {
        id: 5,
        name: "Mocha",
        category: "coffee",
        price: 5.00,
        description: "Espresso with chocolate and steamed milk",
        emoji: "☕"
    },
    {
        id: 6,
        name: "Cold Brew",
        category: "coffee",
        price: 4.25,
        description: "Smooth cold-steeped coffee",
        emoji: "🧊"
    },
    {
        id: 7,
        name: "Traditional Matcha",
        category: "matcha",
        price: 5.50,
        description: "Ceremonial grade matcha tea",
        emoji: "🍵"
    },
    {
        id: 8,
        name: "Matcha Latte",
        category: "matcha",
        price: 5.75,
        description: "Matcha with steamed milk",
        emoji: "🍵"
    },
    {
        id: 9,
        name: "Iced Matcha",
        category: "matcha",
        price: 5.50,
        description: "Refreshing iced matcha drink",
        emoji: "🧊"
    },
    {
        id: 10,
        name: "Matcha Frappe",
        category: "matcha",
        price: 6.25,
        description: "Blended matcha with ice and milk",
        emoji: "🍵"
    },
    {
        id: 11,
        name: "Croissant",
        category: "pastries",
        price: 3.50,
        description: "Buttery, flaky French pastry",
        emoji: "🥐"
    },
    {
        id: 12,
        name: "Blueberry Muffin",
        category: "pastries",
        price: 3.75,
        description: "Fresh-baked with real blueberries",
        emoji: "🧁"
    },
    {
        id: 13,
        name: "Chocolate Chip Cookie",
        category: "pastries",
        price: 2.50,
        description: "Warm, gooey chocolate chip cookie",
        emoji: "🍪"
    },
    {
        id: 14,
        name: "Almond Biscotti",
        category: "pastries",
        price: 3.00,
        description: "Crunchy Italian cookie",
        emoji: "🍪"
    }
];

// Storage Keys
const STORAGE_KEYS = {
    CART: 'coffee_matcha_cart',
    FAVORITES: 'coffee_matcha_favorites',
    REWARDS: 'coffee_matcha_rewards'
};

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'menu.html' || currentPage === '') {
        initMenuPage();
    } else if (currentPage === 'order.html') {
        initOrderPage();
    } else if (currentPage === 'rewards.html') {
        initRewardsPage();
    } else if (currentPage === 'favorites.html') {
        initFavoritesPage();
    }
});

// Menu Page Initialization
function initMenuPage() {
    displayMenuItems();
    setupCategoryFilters();
}

// Display menu items
function displayMenuItems(category = 'all') {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    menuContainer.innerHTML = filteredItems.map(item => createMenuItemHTML(item)).join('');
    
    // Add event listeners to buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            addToCart(itemId);
        });
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const itemId = parseInt(btn.dataset.itemId);
        updateFavoriteButton(btn, itemId);
        
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            toggleFavorite(itemId);
            updateFavoriteButton(this, itemId);
        });
    });
}

// Create menu item HTML
function createMenuItemHTML(item) {
    return `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image">${item.emoji}</div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-actions">
                    <button class="add-to-cart-btn" data-item-id="${item.id}">Add to Cart</button>
                    <button class="favorite-btn" data-item-id="${item.id}">❤️</button>
                </div>
            </div>
        </div>
    `;
}

// Setup category filters
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            displayMenuItems(category);
        });
    });
}

// Cart Management
function getCart() {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const cart = getCart();
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification(`${item.name} added to cart!`);
    
    // Update cart display if on order page
    if (window.location.pathname.split('/').pop() === 'order.html') {
        displayCart();
    }
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    displayCart();
}

function updateQuantity(itemId, change) {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart(cart);
            displayCart();
        }
    }
}

// Order Page Initialization
function initOrderPage() {
    displayOrderMenuItems();
    displayCart();
    setupCategoryFilters();
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

function displayOrderMenuItems(category = 'all') {
    const menuContainer = document.getElementById('order-menu-items');
    if (!menuContainer) return;
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    menuContainer.innerHTML = filteredItems.map(item => createMenuItemHTML(item)).join('');
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            addToCart(itemId);
        });
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const itemId = parseInt(btn.dataset.itemId);
        updateFavoriteButton(btn, itemId);
        
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            toggleFavorite(itemId);
            updateFavoriteButton(this, itemId);
        });
    });
}

function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotalElement) cartTotalElement.textContent = '0.00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    if (cartTotalElement) cartTotalElement.textContent = total.toFixed(2);
    if (checkoutBtn) checkoutBtn.disabled = false;
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) return;
    
    alert('Order placed successfully! Total: $' + cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));
    
    // Clear cart
    localStorage.removeItem(STORAGE_KEYS.CART);
    updateCartCount();
    displayCart();
}

// Favorites Management
function getFavorites() {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

function toggleFavorite(itemId) {
    let favorites = getFavorites();
    const index = favorites.indexOf(itemId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Removed from favorites');
    } else {
        favorites.push(itemId);
        const item = menuItems.find(i => i.id === itemId);
        showNotification(`${item.name} added to favorites!`);
    }
    
    saveFavorites(favorites);
}

function isFavorite(itemId) {
    const favorites = getFavorites();
    return favorites.includes(itemId);
}

function updateFavoriteButton(button, itemId) {
    if (isFavorite(itemId)) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
}

// Favorites Page
function initFavoritesPage() {
    displayFavorites();
}

function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const emptyState = document.getElementById('empty-favorites');
    
    if (!favoritesContainer) return;
    
    const favorites = getFavorites();
    const favoriteItems = menuItems.filter(item => favorites.includes(item.id));
    
    if (favoriteItems.length === 0) {
        favoritesContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    favoritesContainer.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    favoritesContainer.innerHTML = favoriteItems.map(item => createMenuItemHTML(item)).join('');
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            addToCart(itemId);
        });
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const itemId = parseInt(btn.dataset.itemId);
        updateFavoriteButton(btn, itemId);
        
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            toggleFavorite(itemId);
            displayFavorites(); // Refresh the display
        });
    });
}

// Rewards Page
function initRewardsPage() {
    const rewards = getRewards();
    const form = document.getElementById('rewards-form');
    const statusDiv = document.getElementById('rewards-status');
    const successDiv = document.getElementById('signup-success');
    
    if (rewards) {
        // User is already signed up
        if (statusDiv) {
            statusDiv.innerHTML = `
                <h2>Welcome back, ${rewards.name}! 🎉</h2>
                <div class="points-display">${rewards.points || 0} Points</div>
                <p>Keep earning points with every purchase!</p>
            `;
            statusDiv.style.display = 'block';
        }
        
        if (form) form.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    } else {
        if (statusDiv) statusDiv.style.display = 'none';
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                birthday: document.getElementById('birthday').value,
                points: 0,
                signupDate: new Date().toISOString()
            };
            
            saveRewards(formData);
            
            form.style.display = 'none';
            successDiv.style.display = 'block';
            
            // Show status after 2 seconds
            setTimeout(() => {
                location.reload();
            }, 2000);
        });
    }
}

function getRewards() {
    const rewards = localStorage.getItem(STORAGE_KEYS.REWARDS);
    return rewards ? JSON.parse(rewards) : null;
}

function saveRewards(rewards) {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
}

// Notification System
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #6f4e37;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
