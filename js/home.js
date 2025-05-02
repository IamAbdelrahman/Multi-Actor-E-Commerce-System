// ------------------------------Register/Login Start------------------------------
import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js';

// Show and hide modal
const modal = document.getElementById("registerModal");
const icon = document.getElementById("Register-Icon");
const closeBtn = document.getElementById("closePopup");

function getRandomValues(min, max) {
    return ((Math.floor(Math.random() * (max - min + 1)) + min));
}

document.getElementById('toggleToLogin').onclick = function () {
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
};

document.getElementById('toggleToSignUp').onclick = function () {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signUpForm').style.display = 'block';
};

icon.onclick = () => modal.classList.remove('d-none');
closeBtn.onclick = () => modal.classList.add('d-none');

// Password eyeIcon
const eyeIcon = document.getElementById("eyeIcon");
const password = document.getElementById("password");
eyeIcon.onclick = () => {
    if (password.type == "password") {
        password.type = "text";
        eyeIcon.src = "./images/Others/eye-open.png";
    } else {
        password.type = "password";
        eyeIcon.src = "./images/Others/eye-close.png";
    }
};

const loginEyeIcon = document.getElementById("loginEyeIcon");
const loginPassword = document.getElementById("loginPassword");
loginEyeIcon.onclick = () => {
    if (loginPassword.type == "password") {
        loginPassword.type = "text";
        loginEyeIcon.src = "./images/Others/eye-open.png";
    } else {
        loginPassword.type = "password";
        loginEyeIcon.src = "./images/Others/eye-close.png";
    }
};

window.Save = function (event) {
    event.preventDefault();

    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim().toLowerCase();
    let password = document.getElementById("password").value;

    UserManager.AddUser(name, email, password);
}

window.Login = function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = StorageManager.LoadSection("users") || [];

    const LoginUser = users.find(user => user.email === email);
    if (!LoginUser) {
        alert("Email does not exist. Please register first.");
    } else if (LoginUser.password !== password) {
        alert("Incorrect password. Please try again.");
    }
    else {
        //repair
        // alert(Welcome back, ${LoginUser.name}! You are logged in as ${LoginUser.role}.);

        // Handle different user roles
        switch (LoginUser.role) {
            case "customer":
                location.reload();
                document.getElementById("Register-Icon").classList.add("d-none");
                const userDropdown = document.getElementById("userDropdown");
                if (userDropdown) {
                    userDropdown.classList.remove("d-none");
                }
                const modal = document.getElementById("registerModal");
                if (modal) {
                    modal.classList.add("d-none");
                }
                break;
            case "admin":
                window.location.href = "admin-panel.html";
                break;
            case "seller":
                window.location.href = "seller-dashboard.html";
                break;
            default:
                alert("Invalid role. Please try again.");
        }
    }

};
// ------------------------------Register/Login End------------------------------

window.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('userLoggedIn'));

    // Set up UI based on login status
    if (loggedInUser) {
        document.getElementById("Register-Icon")?.classList.add("d-none");
        document.getElementById("userDropdown")?.classList.remove("d-none");

        // Ensure cart has the correct user ID even after page refresh
        if (!sessionStorage.getItem('userId')) {
            sessionStorage.setItem('userId', loggedInUser.id);
            sessionStorage.setItem('userRole', loggedInUser.role);
        }
    } else {
        document.getElementById("Register-Icon")?.classList.remove("d-none");
        document.getElementById("userDropdown")?.classList.add("d-none");

        // Set guest ID for cart if no user is logged in
        if (!sessionStorage.getItem('userId')) {
            sessionStorage.setItem('userId', 'guest');
        }
    }
    CreateFeaturedPrducts(StorageManager.LoadSection("products"));
});

document.getElementById("logout")?.addEventListener("click", (e) => {
    e.preventDefault();

    // Clear all user session data
    sessionStorage.removeItem("userLoggedIn");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userRole");

    // Set guest ID for cart after logout
    sessionStorage.setItem('userId', 'guest');

    location.reload();
});


function CreateFeaturedPrducts(products) {
    var content = document.getElementById("Featured-Products-Container");
    const row = document.createElement("div");
    row.className = "row g-4";
    var count = 9;
    do {
        var product = products[getRandomValues(1, 25)];
        console.log(product.id);
        const card = document.createElement("div");
        card.className = "col-12 col-sm-6 col-lg-3 mb-4";
        card.innerHTML = `
          <div class="card h-100 position-relative text-center p-3">

            <!-- Buttons for heart and eye icons -->
            <div class="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
              <button class="btn btn-light rounded-circle shadow-sm">
                <i class="bi bi-heart"></i>
              </button>
              <a href="product-details.html?id=${product.id}" class="text-decoration-none">
              <button class="btn btn-light rounded-circle shadow-sm">
                <i class="bi bi-eye"></i>
              </button>
              </a>
            </div>
            
            <a href="product-details.html?id=${product.id}" class="text-decoration-none">
              <img src="${product.image}" class="card-img-top  mx-auto" style="max-width: 60%; height:200px">
                <div class="card-body d-flex flex-column justify-content-between ">
                <h5 class="card-title fw-semibold mb-2  ">${product.name}</h5>
                <p class="text-muted small">${product.description}</p>
            </div>
            </a>

            <!-- Card Footer with Price and Add to Cart Button -->
            <div class="card-footer bg-white border-0">
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">$${product.price}</span>
                <button class="btn btn-outline-dark btn-sm text-body-emphasis p-2 fw-semibold" 
                        onclick="addToCart({
                          id: ${product.id}, 
                          name: '${product.name}', 
                          price: ${product.price}, 
                          image: '${product.image}'
                        })">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
       `;

        row.appendChild(card);
        content.appendChild(row);
    } while (count--);

}
// Initialize cart for current user
document.addEventListener('DOMContentLoaded', function () {
    // Ensure cart has a user ID (logged in or guest)
    if (!sessionStorage.getItem('userId')) {
        const loggedInUser = JSON.parse(sessionStorage.getItem('userLoggedIn'));
        sessionStorage.setItem('userId', loggedInUser ? loggedInUser.id : 'guest');
    }
});

