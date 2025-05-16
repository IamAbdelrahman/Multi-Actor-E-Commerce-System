import StorageManager from "../modules/StorageModule.js";
import UserManager from "../modules/UserModule.js";
import { showToast } from './toast.js';

document.addEventListener("DOMContentLoaded", () => {
    const userLoggedIn = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    const userId = userLoggedIn?.id;

    if (userId) {
        if (userId == "guest") {
            sessionStorage.setItem('wasGuest', 'true');
        }

        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('userLoggedInStatus', 'true');
        const users = StorageManager.LoadSection("users");
        const currentUser = users.find(user => user.id === userId);
        if (currentUser) {
            document.getElementById("profileName").value = currentUser.name || "";
            document.getElementById("profileEmail").value = currentUser.email || "";
            document.getElementById("profileStreet").value = currentUser.Address.street || "";
            document.getElementById("profileCity").value = currentUser.Address.city || "";
            document.getElementById("profileZip").value = currentUser.Address.zipCode || "";
            document.getElementById("profilePhone").value = currentUser.phone || "";
        }
    }
    window.updateProfile = function (event) {
        event.preventDefault();

        const name = document.getElementById("profileName").value.trim();
        const email = document.getElementById("profileEmail").value.trim();
        const street = document.getElementById("profileStreet").value.trim();
        const city = document.getElementById("profileCity").value.trim();
        const zipCode = document.getElementById("profileZip").value.trim();
        const phone = document.getElementById("profilePhone").value.trim();

        if (!userId) {
            showToast("No user logged in", "warning");
            return;
        }
        const updated = UserManager.UpdateUser(userId, name, email, street, city, zipCode, phone);

        if (updated) {
            showToast("Profile updated successfully!", "success");
        }
    };
});