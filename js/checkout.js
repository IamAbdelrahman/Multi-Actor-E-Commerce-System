// import Validate from "../modules/ValidationModule.js";
// import StorageManager from "../modules/StorageModule.js";

// document.addEventListener("DOMContentLoaded", () => {
//     const userLoggedIn = JSON.parse(sessionStorage.getItem("userLoggedIn"));
//     const userId = userLoggedIn?.id;
    
//     // Load the user's information if logged in
//     if (userId) {
//         const users = StorageManager.LoadSection("users");
//         const currentUser = users.find(user => user.id === userId);
//         if (currentUser) {
//             document.getElementById("checkout-name").value = currentUser.name || "";
//             document.getElementById("checkout-email").value = currentUser.email || "";
//             document.getElementById("checkout-streetAddress").value = currentUser.Address.street || "";
//             document.getElementById("checkout-city").value = currentUser.Address.city || "";
//             document.getElementById("checkout-zip").value = currentUser.Address.zipCode || "";
//             document.getElementById("checkout-phone").value = currentUser.phone || "";
//         }
//     }
    
//     // Display cart items if user is logged in
//     const cart = StorageManager.LoadSection("cart");
//     const userCart = cart.find(cartItem => cartItem.userId === userId);
//     if (userCart) {
//         const cartItemsContainer = document.getElementById("cart-items-container");
//         userCart.products.forEach(product => {
//             const productData = StorageManager.LoadSection("products").find(p => p.id === product.productId);
//             const productElement = document.createElement("div");
//             productElement.classList.add("cart-item");
//             productElement.innerHTML = `
//                 <p>${productData.name} (x${product.quantity})</p>
//                 <p>Price: $${(productData.price * product.quantity).toFixed(2)}</p>
//             `;
//             cartItemsContainer.appendChild(productElement);
//         });

//         // Display total amount
//         const totalAmountContainer = document.getElementById("total-amount");
//         totalAmountContainer.innerHTML = `Total: $${userCart.totalAmount.toFixed(2)}`;
//     }

//     const submit = document.getElementById("submit");

//     submit.addEventListener("click", (e) => {
//         e.preventDefault();

//         const name = document.getElementById("checkout-name").value.trim();
//         const street = document.getElementById("checkout-streetAddress").value.trim();
//         const city = document.getElementById("checkout-city").value.trim();
//         const state = document.getElementById("checkout-state").value.trim();
//         const zip = document.getElementById("checkout-zip").value.trim();
//         const phone = document.getElementById("checkout-phone").value.trim();
//         const email = document.getElementById("checkout-email").value.trim();

//         if (!name || !street || !city || !state || !zip || !phone || !email) {
//             alert("Please fill in all fields");
//             return;
//         }

//         const address = {
//             street,
//             city,
//             zip,
//         };

//         const errors = [];

//         if (!Validate.isNameValid(name)) errors.push("Invalid name (must be 3-15 characters long and contain only letters)");
//         if (!Validate.isEmailValid(email)) errors.push("Invalid email");
//         if (!Validate.isPhoneValid(phone)) errors.push("Invalid phone (expected format: +20XXXXXXXXXX)");
//         if (!Validate.isAddressValid(address)) errors.push("Invalid address");
//         if (!Validate.isStateValid(state)) errors.push("Invalid state");

//         if (errors.length > 0) {
//             alert(errors.join("\n"));
//         } else {
//             alert("Validation successful!");

//             // Create a new order
//             const newOrder = {
//                 id: new Date().getTime(),  // Generate a unique order ID
//                 userId: userId,
//                 products: userCart.products,
//                 totalAmount: userCart.totalAmount,
//                 status: "processing",
//                 orderDate: new Date().toISOString(),
//                 PaymentMethod: "credit card", // You can modify this depending on your payment method
//                 shippingAddress: {
//                     street: street,
//                     city: city,
//                     zipCode: zip,
//                 },
//             };

//             const orders = StorageManager.LoadSection("orders") || [];
//             orders.push(newOrder);

//             // Save new order to the orders section
//             StorageManager.SaveSection("orders", orders);

//             // Clear cart after order is placed
//             const updatedCart = cart.filter(cartItem => cartItem.userId !== userId);
//             StorageManager.SaveSection("cart", updatedCart);

//             alert("Order placed successfully!");
//             window.location.href = "/order-confirmation.html";  // Redirect to confirmation page (optional)
//         }
//     });
// });
