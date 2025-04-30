import StorageManager from "../modules/StorageModule.js";
import UserManager from "../modules/UserModule.js";

document.addEventListener("DOMContentLoaded", () => {
    const userLoggedIn = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    const userId = userLoggedIn?.id;

    if (userId) {
        const users = StorageManager.LoadSection("users");
        const currentUser = users.find(user => user.id === userId);
        if (currentUser) {
            document.getElementById("profileName").value = currentUser.name || "";
            document.getElementById("profileEmail").value = currentUser.email || "";
                        // document.getElementById("profileStreet").value = currentUser.Address.street || "";
            // document.getElementById("City").value = currentUser.Address.city || "";
            // document.getElementById("Zip").value = currentUser.Address.zipCode || "";
            // document.getElementById("profilePhone").value = currentUser.phone || "";
        }
    }
});

// Add logout functionality to clear session but preserve cart (ya rab tRUN)
document.getElementById("logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("userLoggedIn");
    window.location.href = "home.html";
=======
            document.getElementById("profileStreet").value = currentUser.Address.street || "";
            document.getElementById("profileCity").value = currentUser.Address.city || "";
            document.getElementById("profileZip").value = currentUser.Address.zipCode || "";
            document.getElementById("profilePhone").value = currentUser.phone || "";
        }
    }
    window.updateProfile = function (event) {

        const name = document.getElementById("profileName").value.trim();
        const email = document.getElementById("profileEmail").value.trim();
        const street = document.getElementById("profileStreet").value.trim();
        const city = document.getElementById("profileCity").value.trim();
        const zipCode = document.getElementById("profileZip").value.trim();
        const phone = document.getElementById("profilePhone").value.trim();

        if (!userId) return alert("No user logged in");

        const updated = UserManager.UpdateUser(userId, name, email, street, city, zipCode, phone);

        if (updated) {
            alert("Profile updated successfully!");
        }
        // Else: alert already shown inside UpdateUser in case of failure
    };
});