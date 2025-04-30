import Validate from "../modules/ValidationModule.js";




 
  const submit = document.getElementById("submit");

  submit.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const street = document.getElementById("streetAddress").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
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