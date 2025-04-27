// -------------------------------Cart-Slider functions start
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product, quantity = 1) {
    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({
            ...product,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    
    // Show cart slider when adding an item
    const cartSlider = document.getElementById("cartSlider");
    if (!cartSlider.classList.contains("show")) {
        toggleCart();
    }
}

function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart").textContent = totalItems;
}

function toggleCart() {
    const cartSlider = document.getElementById("cartSlider");
    const overlay = document.getElementById("overlay");

    if (cartSlider.classList.contains("show")) {
        cartSlider.classList.remove("show");
        overlay.classList.remove("show");
    } else {
        cartSlider.classList.add("show");
        overlay.classList.add("show");
        renderCartItems();
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById("cartItems");
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty</p>';
        document.getElementById("cartTotal").textContent = '$0.00';
        return;
    }

    cartItems.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "d-flex justify-content-between align-items-center mb-3 p-2 border-bottom";
        cartItem.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;">
                <div>
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="mb-1">$${item.price.toFixed(2)}</p>
                    <div class="input-group input-group-sm" style="width: 120px;">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                        <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById("cartTotal").textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(index, change) {
    const newQuantity = cartItems[index].quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    cartItems[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cartItems));
    renderCartItems();
    updateCartCount();
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    renderCartItems();
}

// Initialize cart count on page load
updateCartCount();

// Add event listener for cart icon
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.bi-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
});
//-----------------------------------------Cart-Slider functions End