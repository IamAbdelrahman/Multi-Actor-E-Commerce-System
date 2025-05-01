import StorageManager from '../modules/StorageModule.js';

async function StoreJSON() {
  if (!localStorage.getItem("data")) {
    fetch('./data/data.json')
      .then(response => response.json())
      .then(data => {
        // Initialize the data structure with empty carts
        const initializedData = {
          ...data,
          userCarts: {} // This will store user-specific carts
        };
        StorageManager.Save('data', initializedData);
        console.log("JSON data loaded to localStorage for the first time.");
      })
      .catch(err => console.error("Failed to load JSON:", err));
  } else {
    console.log("Data already in localStorage. Skipping JSON fetch.");
    
    // Ensure existing data has the userCarts structure
    const existingData = StorageManager.Load('data');
    if (!existingData.userCarts) {
      const updatedData = {
        ...existingData,
        userCarts: {}
      };
      StorageManager.Save('data', updatedData);
    }
  }
}

// Function to get or create user cart
function getUserCart(userId) {
  const data = StorageManager.Load('data');
  if (!data.userCarts) {
    data.userCarts = {};
  }
  
  if (!data.userCarts[userId]) {
    data.userCarts[userId] = [];
    StorageManager.Save('data', data);
  }
  
  return data.userCarts[userId];
}

// Function to save user cart
function saveUserCart(userId, cartItems) {
  const data = StorageManager.Load('data');
  data.userCarts[userId] = cartItems;
  StorageManager.Save('data', data);
}

// Function to handle guest cart
function getGuestCart() {
  const data = StorageManager.Load('data');
  if (!data.guestCart) {
    data.guestCart = [];
    StorageManager.Save('data', data);
  }
  return data.guestCart;
}

function saveGuestCart(cartItems) {
  const data = StorageManager.Load('data');
  data.guestCart = cartItems;
  StorageManager.Save('data', data);
}

// Function to get the current cart (user or guest)
function getCurrentCart() {
  const userLoggedIn = JSON.parse(sessionStorage.getItem("userLoggedIn"));
  const userId = userLoggedIn?.id;
  
  if (userId) {
    return getUserCart(userId);
  } else {
    return getGuestCart();
  }
}

// Function to merge guest cart with user cart when logging in
function mergeGuestCartWithUser(userId) {
  const data = StorageManager.Load('data');
  
  if (data.guestCart && data.guestCart.length > 0) {
    const userCart = data.userCarts[userId] || [];
    
    data.guestCart.forEach(guestItem => {
      const existingItem = userCart.find(item => item.id === guestItem.id);
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        userCart.push({...guestItem});
      }
    });
    
    data.userCarts[userId] = userCart;
    delete data.guestCart;
    StorageManager.Save('data', data);
  }
}
// Get the product details by its id
export function getProductById(id) {
  const data = StorageManager.Load('data');
  const product = data.products.find(p => p.id === parseInt(id));
  return product ? product : null;
}

export function getProductsByCategory(category) {
  const data = StorageManager.Load('data');
  return data.products.filter(p => p.category === category);
}
await StoreJSON();

// Export the new cart-related functions
export {
  getUserCart,
  saveUserCart,
  getGuestCart,
  saveGuestCart,
  mergeGuestCartWithUser,
  getCurrentCart 
};