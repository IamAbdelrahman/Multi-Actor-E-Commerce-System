import Validate from "../modules/ValidationModule.js";
import StorageManager from "../modules/StorageModule.js";
import ProductManager from "../modules/ProductModule.js";
import { showToast } from './toast.js';

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

    if (userCart && Array.isArray(userCart.products) && userCart.products.length > 0) {
        const cartItemsContainer = document.getElementById("cart-items-container");
        let total = 0;

        userCart.products.forEach(cartItem => {
            const productData = ProductManager.GetProductById(cartItem.id);
            if (!productData) return;

            const itemTotal = productData.price * cartItem.quantity;
            total += itemTotal;
            productData.stock -= cartItem.quantity;
            const productElement = document.createElement("div");
            productElement.classList.add("cart-item");
            productElement.innerHTML = `
                <div class="row align-items-center mb-4">
                    <div class="col-auto">
                        <img src="${productData.image}" alt="${productData.name}" class="img-fluid" style="max-width: 80px;">
                    </div>
                    <div class="col">
                        <p>${productData.name} (x${cartItem.quantity})</p>
                        <p>Price: $${itemTotal.toFixed(2)}</p>

                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(productElement);
        });

        document.getElementById("total-amount").innerHTML = `$${total.toFixed(2)}`;
        document.getElementById("subtotal-amount").innerHTML = `$${total.toFixed(2)}`;
    } else {
        const cartItemsContainer = document.getElementById("cart-items-container");
        cartItemsContainer.innerHTML = "<p class='text-muted'>Your cart is empty.</p>";
        document.getElementById("total-amount").innerHTML = "$0.00";
        document.getElementById("subtotal-amount").innerHTML = "$0.00";
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
            showToast("Please fill in all fields.", "warning");
            return;
        }

        const errors = [];
        if (!Validate.isNameValid(name)) errors.push("Invalid name");
        if (!Validate.isEmailValid(email)) errors.push("Invalid email");
        if (!Validate.isPhoneValid(phone)) errors.push("Invalid phone");
        if (!Validate.isCityValid(city)) errors.push("Invalid city");
        if (!Validate.isZipCodeValid(zip)) errors.push("Invalid zipcode");
        if (!Validate.isStreetValid(street)) errors.push("Invalid street");

        if (errors.length > 0) {
            showToast(errors.join("\n"), "warning");
            return;
        }

        if (!userCart || !Array.isArray(userCart.products) || userCart.products.length === 0) {
            showToast("Your cart is empty", "warning");
            return;
        }

        const total = userCart.products.reduce((sum, item) => {
            const product = ProductManager.GetProductById(item.id);
            return sum + (product.price * item.quantity);
        }, 0);

        userCart.products.forEach(cartItem => {
            const product = ProductManager.GetProductById(cartItem.id);
            if (product) {
                product.stock -= cartItem.quantity;
            }
        });

        const newOrder = {
            id: GenerateNextID(),
            userId: userId,
            products: userCart.products,
            totalAmount: total,
            status: "pending",
            orderDate: new Date().toISOString(),
            PaymentMethod: paymentMethod,
            phone: phone,
            email: email,
            shippingAddress: { street, city, zip }
        };

        const orders = StorageManager.LoadSection("orders") || [];
        orders.push(newOrder);
        StorageManager.SaveSection("orders", orders);

        const updatedProducts = StorageManager.LoadSection("products").map(product => {
            const cartItem = userCart.products.find(item => item.id === product.id);
            if (cartItem) {
                const updatedProduct = { ...product, stock: product.stock - cartItem.quantity };
                return updatedProduct;
            }
            return product;
        });
        StorageManager.SaveSection("products", updatedProducts);

        const updatedCart = cart.filter(cartItem => cartItem.userId !== userId);
        StorageManager.SaveSection("cart", updatedCart);

        window.location.href = "/orderHistory.html";
    });
});

function GenerateNextID() {
    const orders = StorageManager.LoadSection("orders") || [];
    const ids = orders.map(order => order.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}