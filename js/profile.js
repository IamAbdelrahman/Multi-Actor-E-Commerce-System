import StorageManager from "../modules/StorageModule.js";

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