// ------------------------------Register/Login Start------------------------------
import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js';

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
    const LoginUser = users.find(user => user.email === email && user.password === password);

    if (LoginUser) {
        // Store user data for session management
        sessionStorage.setItem('userLoggedIn', JSON.stringify(LoginUser));
        // Store user ID for cart functionality
        sessionStorage.setItem('userId', LoginUser.id);
        sessionStorage.setItem('userRole', LoginUser.role);

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
    } else {
        alert("Invalid email or password. Please try again.");
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

// Initialize cart for current user
document.addEventListener('DOMContentLoaded', function() {
    // Ensure cart has a user ID (logged in or guest)
    if (!sessionStorage.getItem('userId')) {
        const loggedInUser = JSON.parse(sessionStorage.getItem('userLoggedIn'));
        sessionStorage.setItem('userId', loggedInUser ? loggedInUser.id : 'guest');
    }
});