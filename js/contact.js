import StorageManager from "../modules/StorageModule.js";
import Validate from "../modules/ValidationModule.js";

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendMessage");

  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    if (!user) {
      alert("Please log in before sending a message.");
      return;
    }

    const nameInput = document.querySelector("[name='contactName']");
    const emailInput = document.querySelector("[name='contactEmail']");
    const subjectInput = document.querySelector("[name='contactSubject']");
    const messageInput = document.querySelector("[name='contactDescription']");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }
    
    if (!Validate.isNameValid(name)) {
      alert("Please enter a valid name.");
      return;
    }

    if (!Validate.isEmailValid(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!Validate.isProductNameValid(subject)) {
      alert("Please enter a valid subject (min 3 characters).");
      return;
    }

    if (!Validate.isDescriptionValid(message)) {
      alert("Please enter a valid message (min 15 characters).");
      return;
    }
    const messages = StorageManager.LoadSection("messages") || [];
    const newMessage = {
      id:GenerateNextID(),
      userId: user.id,
      userName: name,
      userEmail: email,
      messageSubject: subject,
      messageDescription: message,
      status:false
    };

    messages.push(newMessage);
    StorageManager.SaveSection("messages", messages);
    nameInput.value = "";
    emailInput.value = "";
    subjectInput.value = "";
    messageInput.value = "";
  });
});
function GenerateNextID() {
    const messages = StorageManager.LoadSection("messages") || [];
    const ids = messages.map(messages => messages.id);
    return Math.max(...ids) + 1;
    }