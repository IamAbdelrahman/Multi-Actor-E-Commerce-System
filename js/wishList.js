// Wishlist System with Robust Error Handling
let wishlistItems = [];

// ================== CORE FUNCTIONS ==================

function updateWishlistCount() {
    const totalItems = wishlistItems.length;
    const wishlistElement = document.getElementById("wishlistCount");
    if (wishlistElement) wishlistElement.textContent = totalItems;
}

function getCurrentUserId() {
    try {
        const userLoggedIn = JSON.parse(sessionStorage.getItem('userLoggedIn'));
        return userLoggedIn ? userLoggedIn.id : 'guest';
    } catch (e) {
        console.error("Error parsing user data:", e);
        return 'guest';
    }
}

function getAppData() {
    try {
        const storedData = localStorage.getItem('data');
        // Initialize with all required sections
        return storedData ? JSON.parse(storedData) : { 
            users: [], 
            products: [], 
            orders: [], 
            cart: [],
            wishlists: [] 
        };
    } catch (e) {
        console.error("Error parsing app data:", e);
        return {
            users: [], 
            products: [], 
            orders: [], 
            cart: [],
            wishlists: []
        };
    }
}

function saveCurrentWishlist() {
    try {
        const data = getAppData();
        const userId = getCurrentUserId();

        // Ensure wishlists array exists
        if (!Array.isArray(data.wishlists)) {
            data.wishlists = [];
        }

        // Remove any existing wishlist for current user
        data.wishlists = data.wishlists.filter(w => w.userId !== userId);

        // Only save if wishlist has items
        if (wishlistItems.length > 0) {
            data.wishlists.push({
                userId: userId,
                products: JSON.parse(JSON.stringify(wishlistItems)) // Deep clone
            });
        }

        localStorage.setItem('data', JSON.stringify(data));
    } catch (e) {
        console.error("Error saving wishlist:", e);
    }
}

// ================== WISHLIST OPERATIONS ==================

function toggleWishlist() {
    try {
        const wishlistSlider = document.getElementById("wishlistSlider");
        const wishlistOverlay = document.getElementById("wishlistOverlay");

        if (!wishlistSlider || !wishlistOverlay) {
            console.error("Wishlist elements not found");
            return;
        }

        if (wishlistSlider.classList.contains("show")) {
            wishlistSlider.classList.remove("show");
            wishlistOverlay.classList.remove("show");
            document.removeEventListener("click", handleWishlistOutsideClick);
        } else {
            wishlistSlider.classList.add("show");
            wishlistOverlay.classList.add("show");
            renderWishlistItems();

            setTimeout(() => {
                document.addEventListener("click", handleWishlistOutsideClick);
            }, 0);
        }
    } catch (e) {
        console.error("Error toggling wishlist:", e);
    }
}

function handleWishlistOutsideClick(event) {
    try {
        const wishlistSlider = document.getElementById("wishlistSlider");
        const wishlistOverlay = document.getElementById("wishlistOverlay");

        if (!wishlistSlider || !wishlistOverlay) return;

        const isClickInsideWishlist = event.target.closest('#wishlistSlider') ||
            event.target.closest('.btn-outline-secondary') ||
            event.target.closest('.btn-danger');

        if (!isClickInsideWishlist) {
            wishlistSlider.classList.remove("show");
            wishlistOverlay.classList.remove("show");
            document.removeEventListener("click", handleWishlistOutsideClick);
        }
    } catch (e) {
        console.error("Error handling outside click:", e);
    }
}

function renderWishlistItems() {
    try {
        const wishlistItemsContainer = document.getElementById("wishlistItems");

        if (!wishlistItemsContainer) {
            console.error("Wishlist container not found");
            return;
        }

        wishlistItemsContainer.innerHTML = '';

        if (!Array.isArray(wishlistItems)) {
            console.warn("Wishlist items is not an array, resetting");
            wishlistItems = [];
        }

        if (wishlistItems.length === 0) {
            wishlistItemsContainer.innerHTML = '<p class="text-center">Your wishlist is empty</p>';
            return;
        }

        wishlistItems.forEach((item, index) => {
            if (!item) return;

            const itemName = item.name || 'Unknown Product';
            const itemImage = item.image || '';
            const itemPrice = typeof item.price === 'number' ? item.price : 0;

            const wishlistItem = document.createElement("div");
            wishlistItem.className = "d-flex justify-content-between align-items-center mb-3 p-2 border-bottom wishlist-item";
            wishlistItem.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <a href="product-details.html?id=${item.id}" class="text-decoration-none">
                        <img src="${itemImage}" alt="${itemName}" style="width: 55px; height: 75px; object-fit: cover;">
                    </a>
                    <div>
                        <a href="product-details.html?id=${item.id}" class="text-decoration-none text-dark">
                            <h6 class="mb-1">${itemName}</h6>
                        </a>
                        <p class="mb-1">$${itemPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-warning btn-sm" onclick="addToCartFromWishlist(${index}, event)">
                        <i class="bi bi-cart-plus"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="removeFromWishlist(${index}, event)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            wishlistItemsContainer.appendChild(wishlistItem);
        });
    } catch (e) {
        console.error("Error rendering wishlist items:", e);
    }
}

function addToWishlist(product) {
    try {
        if (!product?.id) {
            console.error('Invalid product data', product);
            showWishlistMessage('Failed to add item to wishlist');
            return;
        }

        // Initialize data structure if needed
        const data = getAppData();
        if (!Array.isArray(data.wishlists)) {
            data.wishlists = [];
            localStorage.setItem('data', JSON.stringify(data));
        }

        const existingItem = wishlistItems.find(item => item && item.id === product.id);

        if (!existingItem) {
            wishlistItems.push({
                id: product.id,
                name: product.name || 'Unknown Product',
                price: product.price || 0,
                image: product.image || ''
            });

            saveCurrentWishlist();
            updateWishlistCount();
            showWishlistMessage(`${product.name || 'Item'} added to wishlist`);
        } else {
            showWishlistMessage(`${product.name || 'Item'} is already in your wishlist`);
        }
    } catch (e) {
        console.error("Error adding to wishlist:", e);
        showWishlistMessage('Failed to add item to wishlist');
    }
}

function addToCartFromWishlist(index, event) {
    try {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        if (index < 0 || index >= wishlistItems.length || !wishlistItems[index]) {
            console.error("Invalid wishlist index");
            return;
        }

        const item = wishlistItems[index];
        if (window.addToCart) {
            window.addToCart(item);
            showWishlistMessage(`${item.name || 'Item'} added to cart`);
        } else {
            console.error("addToCart function not available");
        }
    } catch (e) {
        console.error("Error adding to cart from wishlist:", e);
    }
}

function removeFromWishlist(index, event) {
    try {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        if (index < 0 || index >= wishlistItems.length || !wishlistItems[index]) {
            console.error("Invalid wishlist index");
            return;
        }

        const item = wishlistItems[index];
        const itemName = item.name || 'Item';

        showWishlistMessage(`${itemName} removed from wishlist`);

        const wishlistItemElements = document.querySelectorAll('#wishlistItems > div');
        if (wishlistItemElements[index]) {
            wishlistItemElements[index].classList.add('removing');
            setTimeout(() => {
                wishlistItems.splice(index, 1);
                saveCurrentWishlist();
                updateWishlistCount();
                renderWishlistItems();
            }, 300);
        }
    } catch (e) {
        console.error("Error removing from wishlist:", e);
    }
}

function moveAllToCart() {
    try {
        if (wishlistItems.length === 0) {
            showWishlistMessage('Your wishlist is empty');
            return;
        }

        if (window.addToCart) {
            wishlistItems.forEach(item => {
                if (item) {
                    window.addToCart(item);
                }
            });
            showWishlistMessage(`All items moved to cart`);
        } else {
            console.error("addToCart function not available");
            return;
        }

        wishlistItems = [];
        saveCurrentWishlist();
        updateWishlistCount();
        renderWishlistItems();
    } catch (e) {
        console.error("Error moving all to cart:", e);
    }
}

function showWishlistMessage(message) {
    try {
        // Remove any existing wishlist messages
        const existingMessages = document.querySelectorAll('.wishlist-message');
        existingMessages.forEach(msg => msg.remove());

        if (!message) return;

        // Create message element
        const warning = document.createElement('div');
        warning.className = 'wishlist-message';
        warning.innerHTML = `
            <i class="bi bi-heart-fill text-danger me-2"></i>
            ${message}
        `;

        // Add to DOM
        document.body.appendChild(warning);

        // Auto-remove after delay
        setTimeout(() => {
            warning.style.opacity = '0';
            setTimeout(() => warning.remove(), 300);
        }, 2000);
    } catch (e) {
        console.error("Error showing wishlist message:", e);
    }
}

function loadWishlistForCurrentUser() {
    try {
        const userId = getCurrentUserId();
        const data = getAppData();
        
        // Ensure wishlists array exists
        if (!Array.isArray(data.wishlists)) {
            data.wishlists = [];
            localStorage.setItem('data', JSON.stringify(data));
        }

        const userWishlist = data.wishlists.find(w => w && w.userId === userId);
        wishlistItems = userWishlist?.products ? JSON.parse(JSON.stringify(userWishlist.products)) : [];
        updateWishlistCount();
        renderWishlistItems();
    } catch (e) {
        console.error("Error loading wishlist:", e);
        wishlistItems = [];
        updateWishlistCount();
    }
}

// Initialize wishlist message styles
const initializeWishlistStyles = () => {
    const styleId = 'wishlist-message-styles';
    if (!document.getElementById(styleId)) {
        const wishlistMessageStyle = document.createElement('style');
        wishlistMessageStyle.id = styleId;
        wishlistMessageStyle.textContent = `
            .wishlist-message {
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
                border-left: 4px solid #dc3545;
                max-width: 300px;
                transition: opacity 0.3s ease;
                opacity: 1;
            }
            
            .wishlist-message i {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(wishlistMessageStyle);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeWishlistStyles();
        
        // Initialize user state
        if (!sessionStorage.getItem('userId')) {
            sessionStorage.setItem('userId', 'guest');
        }

        // Load wishlist
        loadWishlistForCurrentUser();

        // Add click handler to heart icon in navbar
        document.querySelector('.heart-toggle')?.addEventListener('click', (e) => {
            e.preventDefault();
            toggleWishlist();
        });

        // Watch for auth changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'userLoggedIn') {
                loadWishlistForCurrentUser();
            }
        });
    } catch (e) {
        console.error("Error initializing wishlist:", e);
    }
});

// Expose public functions
window.toggleWishlist = toggleWishlist;
window.addToWishlist = addToWishlist;
window.addToCartFromWishlist = addToCartFromWishlist;
window.removeFromWishlist = removeFromWishlist;
window.moveAllToCart = moveAllToCart;