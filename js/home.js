
// ------------------------------Register/Login Start------------------------------
import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js';

// Add Static ADMIN in Local Storage in Section Users and whenn open even not there are users will reload local storage with admin
const users = StorageManager.LoadSection("users") || [];
const adminExists = users.some(user => user.id === 0 && user.role === "admin");

// if (!adminExists) {
//     const staticAdmin = {
//         id: 0,
//         name: "Admin User",
//         email: "admin@gmail.com",
//         password: "admin123",
//         role: "admin"
//     };
//     users.push(staticAdmin);
//     StorageManager.SaveSection("users", users);
//     console.log("Static admin added.");
// }

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

    // Add New Users with Incremental IDs
    UserManager.AddUser(name, email, password);
    UserManager.AddUser(name, email, password);
}

window.Login = function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = StorageManager.LoadSection("users") || [];

    const LoginUser = users.find(user => user.email === email && user.password === password);

    if (LoginUser) {
        //repair
        // alert(Welcome back, ${LoginUser.name}! You are logged in as ${LoginUser.role}.);

        switch (LoginUser.role) {
            case "customer":
                sessionStorage.setItem('userLoggedIn', JSON.stringify(LoginUser));
                document.getElementById("Register-Icon").classList.add("d-none");
                const userDropdown = document.getElementById("userDropdown");
                if (userDropdown) {
                    userDropdown.classList.remove("d-none");
                }

                const modal = document.getElementById("registerModal");
                if (modal) {
                    modal.classList.add("d-none");
                }
                document.getElementById("homeContent");
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

    if (loggedInUser && loggedInUser.role === 'customer') {
        document.getElementById("Register-Icon")?.classList.add("d-none");
        document.getElementById("userDropdown")?.classList.remove("d-none");
    } else {
        document.getElementById("Register-Icon")?.classList.remove("d-none");
        document.getElementById("userDropdown")?.classList.add("d-none");
    }
});


document.getElementById("logout")?.addEventListener("click", () => {
    sessionStorage.removeItem("userLoggedIn");
    location.reload();
});