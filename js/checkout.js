import Validate from "../modules/ValidationModule.js";
import StorageManager from "../modules/StorageModule.js";

document.addEventListener("DOMContentLoaded", () => {

const userLoggedIn = JSON.parse(sessionStorage.getItem("userLoggedIn"));
const userId = userLoggedIn?.id;
if(userId){
  const users=StorageManager.LoadSection("users");
  const currentUser = users.find(user => user.id === userId);
  if(currentUser){
    document.getElementById("checkout-name").value = currentUser.name || "";
    document.getElementById("checkout-email").value = currentUser.email || "";
    document.getElementById("checkout-streetAddress").value = currentUser.Address.street || "";
    document.getElementById("checkout-city").value = currentUser.Address.city || "";
    document.getElementById("checkout-zip").value = currentUser.Address.zipCode || "";
    document.getElementById("checkout-phone").value = currentUser.phone || "";
  }
}

const submit = document.getElementById("submit");

  submit.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.getElementById("checkout-name").value.trim();
    const street = document.getElementById("checkout-streetAddress").value.trim();
    const city = document.getElementById("checkout-city").value.trim();
    const state = document.getElementById("checkout-state").value.trim();
    const zip = document.getElementById("checkout-zip").value.trim();
    const phone = document.getElementById("checkout-phone").value.trim();
    const email = document.getElementById("checkout-email").value.trim();
    if (!name || !street || !city || !state || !zip || !phone || !email) {
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
    if (!Validate.isAddressValid(address)) errors.push("Invalid address");
    if (!Validate.isStateValid(state)) errors.push("Invalid state");

    if (errors.length > 0) {
      alert(errors.join("\n"));
    } else {
      alert("Validation successful!");
    }
  });
});