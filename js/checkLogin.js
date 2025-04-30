document.addEventListener("DOMContentLoaded", () => {
    const checkout = document.getElementById("checkout");
checkout.addEventListener("click", (e) => {
  e.preventDefault();
  if (!sessionStorage.getItem("userLoggedIn")) {
    alert("You need to log in before checking out.");
    window.location.href = "/home.html"; 
    return; 
  }
  else{
    window.location.href = "/checkout.html"; 
  }

});
});