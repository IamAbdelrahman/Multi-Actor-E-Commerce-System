// -------------------------------Cart-Slider functions start
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(item) {
    cartItems.push(item);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
}

function updateCartCount() {
    document.getElementById("cart").textContent = cartItems.length;
}

function storeProduct(productId) {
    localStorage.setItem("selectedProduct", productId);
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
        return;
    }

    cartItems.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "d-flex justify-content-between align-items-center mb-3 p-2 border-bottom";
        cartItem.innerHTML = `
        <div>
          <h6>Product ${item}</h6>
          <p>$${(Math.random() * 100).toFixed(2)}</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
          <i class="bi bi-trash"></i>
        </button>
      `;
        cartItemsContainer.appendChild(cartItem);
    });

    document.getElementById("cartTotal").textContent = `$${(cartItems.length * 50).toFixed(2)}`;
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    renderCartItems();
}

document.querySelector('.bi-cart').addEventListener('click', function (e) {
    e.preventDefault();
    toggleCart();
});

//-----------------------------------------Cart-Slider functions End
