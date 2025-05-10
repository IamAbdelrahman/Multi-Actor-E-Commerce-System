import StorageManager from "../modules/StorageModule.js";
import ProductManager from "../modules/ProductModule.js";

document.addEventListener("DOMContentLoaded", () => {
    const orderId = sessionStorage.getItem("orderId");
    const orders = StorageManager.LoadSection("orders") || [];
    const order = orders.find(orderrs => orderrs.id == orderId); 
  
    document.getElementById("orderDate").textContent = new Date(order.orderDate).toLocaleDateString();
    document.getElementById("orderStatus").textContent = order.status;
    document.getElementById("id").textContent = order.id;
    document.getElementById("paymentMethod").textContent = order.PaymentMethod;
  
    const productContainer = document.querySelector(".col-md-6:nth-child(1)");
    order.products.forEach(item => {
      const product = ProductManager.GetProductById(item.id);
      const productDiv = document.createElement("div");
      productDiv.className = "order-item";
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <p class="fw-bold fs-5">${product.name}</p>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <div class="ms-auto text-end">
          <p class="mx-2 fw-semibold">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `;
      productContainer.appendChild(productDiv);
    });
  
    const summary = document.querySelector("#paymentSummary");

    const subtotal = order.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 30;
    const tax = 50;
    const discount = 20;
    const total = subtotal + shipping + tax - discount;
    
    summary.innerHTML = `

      <div class="d-flex justify-content-between"><span>Subtotal:</span> <span>$${subtotal.toFixed(2)}</span></div>
      <div class="d-flex justify-content-between"><span>Shipping:</span> <span>$${shipping.toFixed(2)}</span></div>
      <div class="d-flex justify-content-between"><span>Tax:</span> <span>$${tax.toFixed(2)}</span></div>
      <div class="d-flex justify-content-between"><span>Discount:</span> <span>$${discount.toFixed(2)}</span></div>
      <hr>
      <div class="d-flex justify-content-between fw-bold"><span>Total:</span> <span>$${total.toFixed(2)}</span></div>
    `;
    document.getElementById("shippingAddress").innerHTML = `
      <p class="pt-2"> <span class="fw-bold"> Address: </span> ${order.shippingAddress.street}</p>
      <p> <span class="fw-bold"> Phone: </span> ${order.phone}</p>
    `;
  });
  
