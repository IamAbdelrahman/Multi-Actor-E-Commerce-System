import Validate from "../modules/ValidationModule.js";
import StorageManager from "../modules/StorageModule.js";

document.addEventListener("DOMContentLoaded", () => {
    const userLoggedIn = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    const userId = userLoggedIn?.id;
    
    if (userId) {
        const users = StorageManager.LoadSection("users");
        const currentUser = users.find(user => user.id === userId);
        if (currentUser) {
            document.getElementById("checkout-name").value = currentUser.name || "";
            document.getElementById("checkout-email").value = currentUser.email || "";
            document.getElementById("checkout-streetAddress").value = currentUser.Address.street || "";
            document.getElementById("checkout-city").value = currentUser.Address.city || "";
            document.getElementById("checkout-zip").value = currentUser.Address.zipCode || "";
            document.getElementById("checkout-phone").value = currentUser.phone || "";
        }
    }
    
    // Load cart from storage
    const cart = StorageManager.LoadSection("cart") || [];
    const userCart = cart.find(item => item.userId === (userId || null));
    
    if (userCart) {
        const cartItemsContainer = document.getElementById("cart-items-container");
        const products = StorageManager.LoadSection("products");
        
        // Calculate total amount
        let totalAmount = 0;
        
        userCart.products.forEach(product => {
            const productData = products.find(p => p.id === product.productId);
            if (productData) {
                const productElement = document.createElement("div");
                productElement.classList.add("cart-item");
                productElement.innerHTML = `
                    <div class="row align-items-center mb-4">
                        <div class="col-auto">
                            <img
                              src="${productData.image}"
                              alt="${productData.name}"
                              class="img-fluid"
                              style="max-width: 80px;"
                            >
                        </div>
                        <div class="col">
                            <p>${productData.name} (x${product.quantity})</p>
                            <p>Price: $${(productData.price * product.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(productElement);
                totalAmount += productData.price * product.quantity;
            }
        });

        // Update total amounts
        document.getElementById("total-amount").innerHTML = `$${totalAmount.toFixed(2)}`;
        document.getElementById("subtotal-amount").innerHTML = `$${totalAmount.toFixed(2)}`;
    }

    const submit = document.getElementById("submit");

    submit.addEventListener("click", (e) => {
        e.preventDefault();

        const name = document.getElementById("checkout-name").value.trim();
        const street = document.getElementById("checkout-streetAddress").value.trim();
        const city = document.getElementById("checkout-city").value.trim();
        const zip = document.getElementById("checkout-zip").value.trim();
        const phone = document.getElementById("checkout-phone").value.trim();
        const email = document.getElementById("checkout-email").value.trim();

        if (!name || !street || !city || !zip || !phone || !email) {
            alert("Please fill in all fields");
            return;
        }

        const address = {
            street,
            city,
            zip,
        };

        const errors = [];

        if (!Validate.isNameValid(name)) errors.push("Invalid name (must be 3-15 characters long and contain only letters)");
        if (!Validate.isEmailValid(email)) errors.push("Invalid email");
        if (!Validate.isPhoneValid(phone)) errors.push("Invalid phone (expected format: +20XXXXXXXXXX)");
        if (!Validate.isAddressValid(address)) errors.push("Invalid address");

        if (errors.length > 0) {
            alert(errors.join("\n"));
        } else {
            // Get cart again in case it changed
            const cart = StorageManager.LoadSection("cart") || [];
            const userCart = cart.find(item => item.userId === (userId || null));
            
            if (!userCart) {
                alert("Your cart is empty");
                return;
            }

            // Create new order
            const newOrder = {
                id: Date.now(),  // Use timestamp as unique ID
                userId: userId || null,
                products: userCart.products,
                totalAmount: userCart.totalAmount,
                status: "processing",
                orderDate: new Date().toISOString(),
                PaymentMethod: "credit card", 
                shippingAddress: {
                    street: street,
                    city: city,
                    zipCode: zip,
                },
            };

            const orders = StorageManager.LoadSection("orders") || [];
            orders.push(newOrder);
            StorageManager.SaveSection("orders", orders);

            // Clear the cart after successful order
            const updatedCart = cart.filter(item => item.userId !== (userId || null));
            StorageManager.SaveSection("cart", updatedCart);

            // Redirect to confirmation page
            window.location.href = "/order-confirmation.html";  
        }
    });
});