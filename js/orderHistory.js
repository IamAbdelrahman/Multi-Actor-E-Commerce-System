import StorageManager from "../modules/StorageModule.js";
import ProductManager from "../modules/ProductModule.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
  const orders = StorageManager.LoadSection("orders") || [];
  const userOrders = orders.filter(order => order.userId === user.id);

  const historyContainer = document.getElementById("order-history");

  if (!userOrders.length) {
    historyContainer.innerHTML = `<p class="alert alert-success fs-4 text-center">No orders.</p>`;
    return;
  }

  userOrders.reverse().forEach(order => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 mb-4 rounded order-card";

    const cardId = `order-products-${order.id}`;

    card.innerHTML = `
      <h5 class="fw-semibold text-success h4 mx-3 py-3">${order.status}</h5>
      <div class="row my-3">
        <div class="col-md-8" id="${cardId}"></div>
        <div class="col-md-4 d-flex flex-column justify-content-center">
          <a href="#" class="btn my-3 btn-outline-dark p-2">Track Order <i class="fa-solid fa-arrow-right"></i></a>
          <a href="#" class="btn btn-outline-dark p-2 view-details" data-order-id="${order.id}">View Order Details <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    `;

    historyContainer.appendChild(card);

    const productContainer = card.querySelector(`#${cardId}`);
    order.products.forEach(item => {
      const product = ProductManager.GetProductById(item.id);
      if (product) {
        const productCard = document.createElement("div");
        productCard.className = "order-entry d-flex align-items-center gap-3";
        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover;" />
          <div>
            <div class="fs-5 fw-semibold">${product.name}</div>
            <div class="text-muted fs-5 text-center">Quantity: ${item.quantity}</div>
          </div>
        `;
        productContainer.appendChild(productCard);
      }
    });

    const detailsButton = card.querySelector(".view-details");
    detailsButton.addEventListener("click", (e) => {
      e.preventDefault();
      const orderIdd = e.currentTarget.dataset.orderId;
      sessionStorage.setItem("orderId", orderIdd);
      window.location.href = "orderDetails.html";
    });
  });
});
