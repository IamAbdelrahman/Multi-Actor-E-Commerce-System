import StorageManager from "../modules/StorageModule.js";
import ProductManager from "../modules/ProductModule.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
  const orders = StorageManager.LoadSection("orders") || [];
  const userOrders = orders.filter(order => order.userId === user.id);

  if (userOrders.length === 0) {
    document.getElementById("order-history").innerHTML += `<p class="alert alert-success fs-4 text-center">No orders.</p>`;
    return;
  }

  userOrders.reverse().forEach(order => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 mb-4 rounded order-card";

    card.innerHTML = `
      <h5 class="fw-semibold text-success h4 mx-3 py-3"> ${order.status}</h5>
      <div class="row my-3">
        <div class="col-md-8" id="order-products-${order.id}"></div>
        <div class="col-md-4 d-flex flex-column justify-content-center">
          <a href="#" class="btn my-3 btn-outline-dark p-2">Track Order <i class="fa-solid fa-arrow-right"></i></a>
          <a href="#" class="btn btn-outline-dark p-2">View Order Details <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    `;

    document.getElementById("order-history").appendChild(card);

    const productContainer = card.querySelector(`#order-products-${order.id}`);

    order.products.forEach(item => {
      const product = ProductManager.GetProductById(item.id);
      if (product) {
        const entry = document.createElement("div");
        entry.className = "order-entry d-flex align-items-center gap-3";
        entry.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <div class="fs-5 fw-semibold">${product.name}</div>
            <div class="text-muted fs-5 text-center">Quantity: ${item.quantity}</div>
          </div>
        `;
        productContainer.appendChild(entry);
      }
    });
  });
});
