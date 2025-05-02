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
    
    const cart = StorageManager.LoadSection("cart") || [];
    const userCart = cart.find(item => item.userId === (userId || null));
    console.log(userCart);
    if (userCart) {
        const cartItemsContainer = document.getElementById("cart-items-container");
        const products = StorageManager.LoadSection("products");
        
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
        const PaymentMethod = document.querySelector('input[name="payment"]:checked')?.id;
        if (!name || !street || !city || !zip || !phone || !email||!PaymentMethod) {
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
        if (!Validate.isCityValid(city)) errors.push("Invalid city");
        if (!Validate.isStreetValid(street)) errors.push("Invalid street");
        if (!Validate.isZipCodeValid(zip)) errors.push("Invalid zipcode");


        if (errors.length > 0) {
            alert(errors.join("\n"));
        } else {
            const cart = StorageManager.LoadSection("cart") || [];
            const userCart = cart.find(item => item.userId === (userId || null));
            
            if (!userCart) {
                alert("Your cart is empty");
                return;
            }

            const newOrder = {
                id: GenerateNextID(),  
                userId: userId,
                products: userCart.products,
                totalAmount: userCart.totalAmount,
                status: "processing",
                orderDate: new Date().toISOString(),
                PaymentMethod: PaymentMethod, 
                shippingAddress: {
                    street: street,
                    city: city,
                    zipCode: zip,
                },
            };

            const orders = StorageManager.LoadSection("orders") || [];
            orders.push(newOrder);
            StorageManager.SaveSection("orders", orders);

            const updatedCart = cart.filter(item => item.userId !== (userId || null));
            StorageManager.SaveSection("cart", updatedCart);

            window.location.href = "../home.html";  
        }
    });
});

function GenerateNextID() {
    const orders = StorageManager.LoadSection("orders") || [];
    if (orders.length === 0) return 1;
    const ids = orders.map(order => order.id);
    return Math.max(...ids) + 1;
}