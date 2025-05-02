document.addEventListener("DOMContentLoaded", () => {
  const checkout = document.getElementById("checkout");
  checkout.addEventListener("click", (e) => {
      e.preventDefault();
      const userLoggedIn = sessionStorage.getItem("userLoggedIn");
      const userId = sessionStorage.getItem("userId");
      
      if (!userLoggedIn || !userId) {
          alert("You need to log in before checking out.");
          return;
      }
      else {
          // Ensure cart items belong to this user
          const data = JSON.parse(localStorage.getItem('data') || '{}');
          const userCart = data.cart?.find(c => c.userId === userId);
          if (!userCart || userCart.items.length === 0) {
              alert("Your cart is empty.");
              return;
          }
          window.location.href = "/checkout.html";
      }
  });
});