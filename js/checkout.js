import Validate from "../modules/ValidationModule.js";
import StorageManager from "../modules/StorageModule.js";
import userManagerID from "../modules/UserModule.js"

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
    
    const cart = StorageManager.LoadSection("cart");
    const userCart = cart.find(cartItem => cartItem.userId === userId);
    if (userCart) {
        const cartItemsContainer = document.getElementById("cart-items-container");
        userCart.products.forEach(product => {
            const productData = StorageManager.LoadSection("products").find(p => p.id === product.productId);
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
        });

        const totalAmountContainer = document.getElementById("total-amount");
        totalAmountContainer.innerHTML = `$${userCart.totalAmount.toFixed(2)}`;
        const subtotalAmountContainer = document.getElementById("subtotal-amount");
        subtotalAmountContainer.innerHTML = `$${userCart.totalAmount.toFixed(2)}`;
        
    }

    const submit = document.getElementById("submit");

    submit.addEventListener("click", (e) => {
        e.preventDefault();

        const selectedPaymentInput = document.querySelector('input[name="payment"]:checked');
        const paymentMethod = selectedPaymentInput ? selectedPaymentInput.nextElementSibling.textContent.trim() : "Not selected";
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

            const newOrder = { 
                id: GenerateNextID(),
                id: userId+10,
                userId: userId,
                products: userCart.products,
                totalAmount: userCart.totalAmount,
                status: "processing",
                orderDate: new Date().toISOString(),
                PaymentMethod: paymentMethod, 
                shippingAddress: {
                    street: street,
                    city: city,
                    zipCode: zip,
                },
            };

            const orders = StorageManager.LoadSection("orders") || [];
            orders.push(newOrder);

            StorageManager.SaveSection("orders", orders);

            const updatedCart = cart.filter(cartItem => cartItem.userId !== userId);
            StorageManager.SaveSection("cart", updatedCart);

            window.location.href = "/home.html";  
        }
    });
});

function GenerateNextID() {
    const orders = StorageManager.LoadSection("orders") || [];
    const ids = orders.map(order => order.id);
    return Math.max(...ids) + 1;
    }