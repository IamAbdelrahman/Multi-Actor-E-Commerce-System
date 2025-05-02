// ------------------------------- Cart-Slider functions start
let cartItems = [];

// Helper function to get the full data object from localStorage
function getAppData() {
  const storedData = localStorage.getItem('data');
  return storedData ? JSON.parse(storedData) : { users: [], products: [], orders: [], cart: [] };
}

// Helper function to save the current cart
function saveCurrentCart() {
  const data = getAppData();
  data.cart = cartItems;
  localStorage.setItem('data', JSON.stringify(data));
}

// Initialize cart
function initCart() {
  const data = getAppData();
  cartItems = Array.isArray(data.cart) ? data.cart : [];
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const cartElement = document.getElementById("cart");
  if (cartElement) {
    cartElement.textContent = totalItems;
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
    // Safely handle item properties
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

function addToCart(product, quantity = 1) {
  if (!product || typeof product.id === 'undefined') {
    console.error('Invalid product data');
    return;
  }

  const availableStock = typeof product.stock === 'number' ? product.stock : 50;
  const safeQuantity = Math.max(1, Math.min(quantity, availableStock));
  
  const existingItem = cartItems.find(item => item.id === product.id);
  
  if (existingItem) {
    const requestedQty = existingItem.quantity + safeQuantity;
    if (requestedQty > availableStock) {
      showWarningMessage(`Only ${availableStock} available in stock`);
      return;
    }
    existingItem.quantity = requestedQty;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name || 'Unknown Product',
      price: typeof product.price === 'number' ? product.price : 0,
      image: product.image || '',
      stock: availableStock,
      quantity: safeQuantity
    });
  }

  saveCurrentCart();
  updateCartCount();
  showWarningMessage(`${safeQuantity} ${product.name || 'item'} added to cart`);

  const cartSlider = document.getElementById("cartSlider");
  if (cartSlider && !cartSlider.classList.contains("show")) {
    toggleCart();
  }
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
  const existingMessages = document.querySelectorAll('.warning-message');
  existingMessages.forEach(msg => msg.remove());

  if (!message) return;

  const warning = document.createElement('div');
  warning.className = 'warning-message';
  warning.innerHTML = `
    <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
    ${message}
  `;
  document.body.appendChild(warning);
  
  setTimeout(() => {
    warning.remove();
  }, 2300);
}

// Expose necessary functions to global scope
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
  initCart();
  
  window.addEventListener('storage', function(e) {
    if (e.key === 'userLoggedIn') {
      initCart();
      renderCartItems();
    }
  });
});

// Add CSS dynamically for transitions
const style = document.createElement('style');
style.textContent = `
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
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s forwards;
    border-left: 4px solid #ffc107;
    max-width: 300px;
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .removing {
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(style);
//----------------------------------------- Cart-Slider functions End