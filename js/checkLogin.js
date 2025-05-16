import { showToast } from './toast.js';

document.addEventListener("DOMContentLoaded", () => {
    const checkout = document.getElementById("checkout");
    checkout.addEventListener("click", (e) => {
        e.preventDefault();
        const userId = sessionStorage.getItem('userId');

        if (!userId || userId === 'guest') {
            showToast("You need to log in before checking out.", "danger");
            return;
        }
        else {
            window.location.href = "/checkout.html";
        }
    });
});