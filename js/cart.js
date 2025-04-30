// -------------------------------Cart-Slider functions start
import { 
  getCurrentCart,
  saveUserCart,
  saveGuestCart,
  mergeGuestCartWithUser
} from './utils.js';

let cartItems = [];

// Helper function to save the current cart
function saveCurrentCart() {
  const userLoggedIn = JSON.parse(sessionStorage.getItem("userLoggedIn"));
  const userId = userLoggedIn?.id;
  
  if (userId) {
    saveUserCart(userId, cartItems);
  } else {
    saveGuestCart(cartItems);
  }
}

// Initialize cart
function initCart() {
  cartItems = getCurrentCart();
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartElement = document.getElementById("cart");
  if (cartElement) {
    cartElement.textContent = totalItems;
  }
}

function toggleCart() {
  const cartSlider = document.getElementById("cartSlider");
  const overlay = document.getElementById("overlay");

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
  if (!cartItemsContainer) return;
  
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
        <img src="${item.image}" alt="${item.name}" style="width: 55px; height: 75px; object-fit: cover;">
        <div>
          <h6 class="mb-1">${item.name}</h6>
          <p class="mb-1">$${item.price.toFixed(2)}</p>
          <div class="input-group input-group-sm" style="width: 120px;">
            <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, -1, event)">-</button>
            <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
            <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, 1, event)">+</button>
          </div>
        </div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index}, event)">
        <i class="bi bi-trash"></i>
      </button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById("cartTotal").textContent = `$${total.toFixed(2)}`;
}

function addToCart(product, quantity = 1) {
  const existingItem = cartItems.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({
      ...product,
      quantity: quantity
    });
  }

  saveCurrentCart();
  updateCartCount();

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

  const newQuantity = cartItems[index].quantity + change;

  if (newQuantity < 1) {
    removeFromCart(index);
    return;
  }

  cartItems[index].quantity = newQuantity;
  saveCurrentCart();
  renderCartItems();
  updateCartCount();
}

function removeFromCart(index, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const item = cartItems[index];
  
  // Show warning message
  const warning = document.createElement('div');
  warning.className = 'warning-message';
  warning.innerHTML = `<i class="bi bi-exclamation-triangle-fill text-warning me-2"></i> ${item.name} removed from cart`;
  document.body.appendChild(warning);
  
  setTimeout(() => {
    warning.remove();
  }, 2300);
  
  // Animate removal
  const cartItemElement = document.querySelectorAll('#cartItems > div')[index];
  if (cartItemElement) {
    cartItemElement.classList.add('removing');
    setTimeout(() => {
      cartItems.splice(index, 1);
      saveCurrentCart();
      updateCartCount();
      renderCartItems();
      
      if (cartItems.length === 0) {
        document.getElementById("cartItems").innerHTML = '<p class="text-center">Your cart is empty</p>';
        document.getElementById("cartTotal").textContent = '$0.00';
      }
    }, 300);
  }
}

// Expose necessary functions to global scope
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
  initCart();
  
  // Handle login/logout changes
  window.addEventListener('storage', function(e) {
    if (e.key === 'userLoggedIn') {
      const userLoggedIn = JSON.parse(sessionStorage.getItem("userLoggedIn"));
      if (userLoggedIn) {
        mergeGuestCartWithUser(userLoggedIn.id);
      }
      initCart();
      renderCartItems();
    }
  });
});

// Add CSS dynamically for transitions
const style = document.createElement('style');
style.textContent = `
  .cart-item-remove {
    transition: all 0.3s ease;
    opacity: 1;
    transform: translateX(0);
  }
  
  .cart-item-remove.removing {
    opacity: 0;
    transform: translateX(100%);
  }
  
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
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
//----------------------------------------- Cart-Slider functions End