// Cart System with Guaranteed Guest-to-User Migration
let cartItems = [];

// ================== CORE FUNCTIONS ==================

function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    const cartElement = document.getElementById("cartCount");
    if (cartElement) cartElement.textContent = totalItems;
    
    const cartTotalElement = document.getElementById("cartTotal");
    if (cartTotalElement) {
        const total = cartItems.reduce((sum, item) => {
            const itemPrice = typeof item.price === 'number' ? item.price : 0;
            const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 1;
            return sum + (itemPrice * itemQuantity);
        }, 0);
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function getCurrentUserId() {
    const userLoggedIn = JSON.parse(sessionStorage.getItem('userLoggedIn'));
    // return userLoggedIn ? sessionStorage.getItem('userId') : 'guest';
    return userLoggedIn ? userLoggedIn.id : 'guest';
}

function getAppData() {
    const storedData = localStorage.getItem('data');
    return storedData ? JSON.parse(storedData) : { users: [], products: [], orders: [], cart: [] };
}

function saveCurrentCart() {
    const data = getAppData();
    const userId = getCurrentUserId();

    // Remove any existing cart for current user
    data.cart = data.cart.filter(c => c.userId !== userId);

    // Only save if cart has items
    if (cartItems.length > 0) {
        data.cart.push({
            userId: userId,
            products: JSON.parse(JSON.stringify(cartItems)) // Deep clone
        });
    }

    localStorage.setItem('data', JSON.stringify(data));
}

// ================== MIGRATION SYSTEM ==================

 function transferGuestCartToUser(userId) {
    const data = getAppData();
    const guestCartIndex = data.cart.findIndex(c => c.userId === 'guest');

    if (guestCartIndex === -1) return false;

    const guestCart = data.cart[guestCartIndex];

    // Remove any existing cart for this user
    data.cart = data.cart.filter(c => c.userId !== userId);

    // Create new cart with user's ID and guest's items
    data.cart.push({
        userId: userId,
        products: JSON.parse(JSON.stringify(guestCart.products))
    });

    // Remove guest cart
    data.cart.splice(guestCartIndex, 1);
    localStorage.setItem('data', JSON.stringify(data));
    updateCartCount();
    return true;
}

function handleUserLogin() {
    const userId = sessionStorage.getItem('userId');
    console.l
    if (!userId || userId === 'guest') return;

    // Migrate cart if needed
    if (sessionStorage.getItem('wasGuest') === 'true') {
        const didTransfer = transferGuestCartToUser(userId);
        if (didTransfer) {
            showWarningMessage('Your guest cart items have been transferred');
        }
        sessionStorage.removeItem('wasGuest');
    }

    // Reload cart for the current user
    loadCartForCurrentUser();
}

function loadCartForCurrentUser() {
    const userId = getCurrentUserId();
    const data = getAppData();
    const userCart = data.cart.find(c => c.userId === userId);

    cartItems = userCart?.products ? JSON.parse(JSON.stringify(userCart.products)) : [];
    updateCartCount();
    renderCartItems();
}

// ================== CART OPERATIONS ==================

function addToCart(product, quantity = 1) {
    if (!product?.id) {
        console.error('Invalid product data');
        return;
    }

    const availableStock = (typeof product.stock === 'number') ? product.stock : 50;
    const safeQuantity = Math.max(1, Math.min(quantity, availableStock));
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
        const newQuantity =  safeQuantity;
        if (newQuantity > availableStock) {
            showWarningMessage(`Only ${availableStock} available in stock`);
            return;
        }
        existingItem.quantity = newQuantity;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name || 'Unknown Product',
            price: product.price || 0,
            image: product.image || '',
            stock: availableStock,
            quantity: safeQuantity
        });
    }

    saveCurrentCart();
    updateCartCount();
    showWarningMessage(`${safeQuantity} ${product.name || 'item'} added to cart`);

    // Auto-open cart if closed
    const cartSlider = document.getElementById("cartSlider");
    if (cartSlider && !cartSlider.classList.contains("show")) {
        toggleCart();
    }
}

function toggleCart() {
    const cartSlider = document.getElementById("cartSlider");
    const overlay = document.getElementById("overlay");

    if (!cartSlider || !overlay) return;

    if (cartSlider.classList.contains("show")) {
        cartSlider.classList.remove("show");
        overlay.classList.remove("show");
        document.removeEventListener("click", handleOutsideClick);
    } else {
        cartSlider.classList.add("show");
        overlay.classList.add("show");
        renderCartItems();

        setTimeout(() => {
            document.addEventListener("click", handleOutsideClick);
        }, 0);
    }
}

function handleOutsideClick(event) {
    const cartSlider = document.getElementById("cartSlider");
    const overlay = document.getElementById("overlay");

    if (!cartSlider || !overlay) return;

    const isClickInsideCart = event.target.closest('#cartSlider') ||
        event.target.closest('.btn-outline-secondary') ||
        event.target.closest('.btn-danger');

    if (!isClickInsideCart) {
        cartSlider.classList.remove("show");
        overlay.classList.remove("show");
        document.removeEventListener("click", handleOutsideClick);
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElement = document.getElementById("cartTotal");

    if (!cartItemsContainer || !cartTotalElement) return;

    cartItemsContainer.innerHTML = '';

    if (!Array.isArray(cartItems)) {
        cartItems = [];
    }

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    cartItems.forEach((item, index) => {
        const itemName = item.name || 'Unknown Product';
        const itemImage = item.image || '';
        const itemPrice = typeof item.price === 'number' ? item.price : 0;
        const itemStock = typeof item.stock === 'number' ? item.stock : 50;
        const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 1;

        const cartItem = document.createElement("div");
        cartItem.className = "d-flex justify-content-between align-items-center mb-3 p-2 border-bottom";
        cartItem.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <img src="${itemImage}" alt="${itemName}" style="width: 55px; height: 75px; object-fit: cover;">
                <div>
                    <h6 class="mb-1">${itemName}</h6>
                    <p class="mb-1">$${itemPrice.toFixed(2)}</p>
                    <small class="text-muted d-block">Max: ${itemStock}</small>
                    <div class="input-group input-group-sm" style="width: 120px;">
                        <button class="btn btn-outline-secondary" 
                                onclick="updateQuantity(${index}, -1, event)"
                                ${itemQuantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="text" class="form-control text-center" value="${itemQuantity}" readonly>
                        <button class="btn btn-outline-secondary" 
                                onclick="updateQuantity(${index}, 1, event)"
                                ${itemQuantity >= itemStock ? 'disabled' : ''}>+</button>
                    </div>
                </div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index}, event)">
                <i class="bi bi-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    const total = cartItems.reduce((sum, item) => {
        const itemPrice = typeof item.price === 'number' ? item.price : 0;
        const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
        return sum + (itemPrice * itemQuantity);
    }, 0);

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(index, change, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    if (index < 0 || index >= cartItems.length) return;

    const item = cartItems[index];
    const currentQuantity = typeof item.quantity === 'number' ? item.quantity : 1;
    const newQuantity = currentQuantity + change;
    const availableStock = typeof item.stock === 'number' ? item.stock : 50;

    if (change > 0 && newQuantity > availableStock) {
        showWarningMessage(`Only ${availableStock} available in stock`);
        return;
    }

    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }

    item.quantity = newQuantity;
    saveCurrentCart();
    renderCartItems();
    updateCartCount();
}

function removeFromCart(index, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    if (index < 0 || index >= cartItems.length) return;

    const item = cartItems[index];
    const itemName = item.name || 'item';

    showWarningMessage(`${itemName} removed from cart`);

    const cartItemElements = document.querySelectorAll('#cartItems > div');
    if (cartItemElements[index]) {
        cartItemElements[index].classList.add('removing');
        setTimeout(() => {
            cartItems.splice(index, 1);
            saveCurrentCart();
            updateCartCount();
            renderCartItems();
        }, 300);
    }
}

function showWarningMessage(message) {
    // Remove any existing warning messages
    const existingMessages = document.querySelectorAll('.warning-message');
    existingMessages.forEach(msg => msg.remove());

    if (!message) return;

    // Create message element
    const warning = document.createElement('div');
    warning.className = 'warning-message';
    warning.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
      ${message}
  `;

    // Add to DOM
    document.body.appendChild(warning);

    // Auto-remove after delay
    setTimeout(() => {
        warning.style.opacity = '0';
        setTimeout(() => warning.remove(), 300);
    }, 2000);
}

const warningStyle = document.createElement('style');
warningStyle.textContent = `
  .warning-message {
      position: fixed;
      top: 70px;
      right: 20px;
      background-color: #202529;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 1200;
      display: flex;
      align-items: center;
      border-left: 4px solid #ffc107;
      max-width: 300px;
      transition: opacity 0.3s ease;
      opacity: 1;
  }
  
  .warning-message i {
      font-size: 1.2rem;
  }
`;
document.head.appendChild(warningStyle);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize user state
    if (!sessionStorage.getItem('userId')) {
        sessionStorage.setItem('userId', 'guest');
    }

    // Handle current auth state
    if (sessionStorage.getItem('userLoggedInStatus') === 'true') {
        handleUserLogin();
    } else {
        loadCartForCurrentUser(); // Load guest cart
    }

    // Watch for auth changes from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'userLoggedInStatus') {
            if (e.newValue === 'true') {
                handleUserLogin();
            } else {
                // User logged out - switch to guest cart
                loadCartForCurrentUser();
                updateCartCount();
            }
        }
    });
});

// Expose public functions
window.transferGuestCartToUser = transferGuestCartToUser;
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
