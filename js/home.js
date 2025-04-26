// ------------------------------slider Start------------------------------
var myCarousel = new bootstrap.Carousel(document.querySelector('#myCarousel'), {
    interval: 3000, // 3 seconds
    ride: 'carousel'
});

// ------------------------------slider End------------------------------



// ------------------------------Register/Login Start------------------------------
import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js';

// Add Static ADMIN in Local Storage in Section Users and whenn open even not there are users will reload local storage with admin
const users = StorageManager.LoadSection("users") || [];
const adminExists = users.some(user => user.id === 0 && user.role === "admin");

if (!adminExists) {
    const staticAdmin = {
        id: 0,
        name: "Admin User",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin"
    };
    users.push(staticAdmin);
    StorageManager.SaveSection("users", users);
    console.log("Static admin added.");
}

// Show and hide modal
const modal = document.getElementById("registerModal");
const icon = document.getElementById("Register-Icon");
const closeBtn = document.getElementById("closePopup");

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
window.onclick = (e) => {
    if (e.target === modal) modal.classList.add('d-none');
}

// Password eyeIcon
const eyeIcon = document.getElementById("eyeIcon");
const password = document.getElementById("password");
eyeIcon.onclick = () => {
    if (password.type == "password") {
        password.type = "text";
        eyeIcon.src = "./images/eye-open.png";
    } else {
        password.type = "password";
        eyeIcon.src = "./images/eye-close.png";
    }
};

const loginEyeIcon = document.getElementById("loginEyeIcon");
const loginPassword = document.getElementById("loginPassword");
loginEyeIcon.onclick = () => {
    if (loginPassword.type == "password") {
        loginPassword.type = "text";
        loginEyeIcon.src = "./images/eye-open.png";
    } else {
        loginPassword.type = "password";
        loginEyeIcon.src = "./images/eye-close.png";
    }
};

window.Save = function (event) {
    event.preventDefault();

    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim().toLowerCase();
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;




    // Add New Users with Incremental IDs
    const newId = UserManager.GenerateNextID();
    UserManager.CreateUser(newId, name, email, password, role);
}

window.Login = function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = StorageManager.LoadSection("users") || [];

    const LoginUser = users.find(user => user.email === email && user.password === password);

    if (LoginUser) {
        // alert(`Welcome back, ${LoginUser.name}! You are logged in as ${LoginUser.role}.`);

        switch (LoginUser.role) {
            case "customer":
                window.location.href = "home.html";
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
    } else {
        alert("Invalid email or password. Please try again.");
    }
};
// ------------------------------Register/Login End------------------------------
