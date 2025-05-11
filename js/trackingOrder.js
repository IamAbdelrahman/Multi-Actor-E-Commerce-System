import StorageManager from "../modules/StorageModule.js";

document.addEventListener("DOMContentLoaded", () => {
  const orderId = parseInt(sessionStorage.getItem("orderId"));
  const orders = StorageManager.LoadSection("orders") || [];
  const order = orders.find(o => o.id === orderId);
  getStatus(order.status);

  switch (order.status) {
    case "pending":
      pendingSection(order);
      break;
    case "processing":
      processingSection(order, orders);
      break;
    case "ready":
        readySection(order);
      break;
    case "delivered":
        deliveredSection();
      break;
  }
});

function getStatus(status) {
  const steps = ["pending", "processing", "ready", "delivered"];
  const stepIndex = steps.indexOf(status);
  for (let i = 0; i <= stepIndex; i++) {
    document.getElementById(`step${i + 1}`).classList.add("active");
  }
}

function pendingSection(order) {
  const container = document.getElementById("orderContent");
  const { street, city, zip } = order.shippingAddress;
  const totalProducts = order.products.reduce((sum, item) => sum + item.quantity, 0);

  container.innerHTML = `
    <div class="my-3">
      <div class="fs-4"> 
      <span class="fw-semibold"> Street</span> ${street}
      <br>
      <span class="fw-semibold"> City</span> ${city}
      <br>
      <span class="fw-semibold"> Zip Code</span> ${zip}
      <br>
      <span class="fw-semibold">phone number</span> ${order.phone}
      <br>
      <span class="fw-semibold">E-mail</span> ${order.email}
      </div>
    </div>
    <div class="alert alert-success p-3 fs-5 text-center">
      <span class="fw-semibold">Order Summary:</span> ${totalProducts} products Total: $${order.totalAmount}
    </div>
  `;

}

function processingSection(order, orders) {
  const container = document.getElementById("orderContent");

  container.innerHTML = `
    <div>
      <h4><span class="fw-semibold">Payment Method:</span> ${order.PaymentMethod}</h4>
      <div class="mb-3">
        ${order.PaymentMethod.toLowerCase().includes("pay-pal")
          ? `<label>PayPal Email: <input type="email" class="form-control" id="paypal-email" /></label>`
          : `<label>Card Number: <input type="text" class="form-control" id="card-number" /></label>`
        }
      </div>
      <button class="btn btn-success" id="submit-payment">Confirm Payment</button>
    </div>
  `;

  document.getElementById("submit-payment").addEventListener("click", () => {
    const inputId = order.PaymentMethod.toLowerCase();
    const input = document.getElementById("card-number").value||document.getElementById("paypal-email").value;

    if (input === ""||!input) {
      alert("Please enter valid payment information.");
      return;
    }else if(input.length<16){
      alert("Invalid number.");
    }

    order.status = "ready";
    const index = orders.findIndex(o => o.id === order.id);
    orders[index] = order;
    StorageManager.SaveSection("orders", orders);
    readySection(order);
  });
}

function readySection(order) {
  const container = document.getElementById("orderContent");
  const { street, city, zip } = order.shippingAddress;

  container.innerHTML = `
    <h4 class="my-3 h3">Order Summary</h4>
    <ul class="list-group my-3">
      ${order.products.map(item =>
        `<li class="list-group-item">Product ID: ${item.id} | Quantity: ${item.quantity} | Price ${item.price}</li>`
      ).join("")}
    </ul>
    <p><span class="fw-semibold fs-4">Total:</span> $${order.totalAmount.toFixed(2)}</p>
    <h4 class="h3 fw-semibold fs-4">Shipping Info</h4>
     <div class="my-3">
      <div class="fs-4"> 
      <span> Street</span> ${street}
      <br>
      <span> City</span> ${city}
      <br>
      <span> Zip Code</span> ${zip}
      <br>
      <span>phone number</span> ${order.phone}
      <br>
      <span>E-mail</span> ${order.email}
      </div>
    </div>
    <h4 class="h3 fw-semibold">Payment Method</h4>
    <p>${order.PaymentMethod}</p>
  `;
}

function deliveredSection() {
  const container = document.getElementById("orderContent");
  container.innerHTML = `
    <div class="text-center">
      <h4 class="text-success my-3"> Your order has been delivered successfully!</h4>
      <a href="contact.html" class="btn btn-outline-dark">Contact Support</a>
    </div>
  `;
}
