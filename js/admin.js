/******************************************************************************
 * Copyright (C) 2025 by Abdelrahman Kamal - Admin Panel Page
 *****************************************************************************/

/*****************************************************************************
 * FILE DESCRIPTION
 * ----------------------------------------------------------------------------
 *	@file admin.js
 *	@brief This module contains all functionalities about the admin.
 *
 *	@details Single Admin account with a predefined email & password.
    Can block or activate customers and sellers.
    Has the exclusive ability to add new sellers.
    Can approve, or reject any product.
    Access to a dashboard displaying:
    Number of customers
    Sales statistics
 *****************************************************************************/

/*- INCLUDES
-----------------------------------------------------------------------*/
import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js'
import ProductManager from '../modules/ProductModule.js'
import SellerManager from '../modules/SellerModule.js';
import CustomerManager from '../modules/CustomerModule.js';
/*------------------------------------------------------------------------------*/

/*- CUSTOMER FUNCTIONS
-----------------------------------------------------------------------*/
function CreateCustomerHeader() {
  var Usersbtns = CreateModal("Customer", "Block", "Unblock");
  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = Usersbtns + table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");
  var attributes = ["Customer ID", "Name", "Email", "Password", "City", "Phone", "Status", "Delete"];
  for (var i = 0; i < attributes.length; i++) {
    var th = document.createElement("th");
    th.textContent = attributes[i];
    tr.appendChild(th);
  }
  head.appendChild(tr);
}

function CreateDataTable(type, ...args) {
  var tr = document.createElement("tr");
  for (var i = 0; i < args.length; i++) {
    var td = createCell();
    td.textContent = args[i];
    tr.appendChild(td);
  }
  td = createCell();
  td.appendChild(createDeleteIcon(args[0], type));
  tr.appendChild(td);
  return tr;
}

function ManageCustomers() {
  const modal = new bootstrap.Modal('#CustomerActionModal');
  let currentAction = '';
  document.querySelectorAll('[data-bs-target="#CustomerActionModal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAction = btn.dataset.action;
      document.getElementById('modalTitle').textContent =
        `${currentAction === 'Block' ? 'Block' : 'Unblock'} Customer`;
    });
  });

  document.getElementById('confirmAction').addEventListener('click', () => {
    const customerId = parseInt(document.getElementById('CustomerId').value);
    if (isNaN(customerId) || customerId < 0 || !customerId){
      alert('Please enter a valid ID');
      return;
    }
    const users = StorageManager.LoadSection("users");
    const customers = users.filter(user => user.role === "customer");
    const returnId = customers.find(c => c.id === customerId);
    if (!returnId){
      alert("ID doesn't exist")
      return;
    }
    if (currentAction === 'Block') {
      CustomerManager.BlockCustomer(customerId);
      alert(`Customer #${customerId} blocked successfully!`);
      location.reload();
    } else {
      CustomerManager.UnblockCustomer(customerId);
      alert(`Customer #${customerId} unblocked successfully!`);
      location.reload();
    }
    modal.hide();
    document.getElementById('customerId').value = '';
  });
}

function ShowCustomers() {
  DisplayNone();
  CreateCustomerHeader();
  ManageCustomers();
  const customers = CustomerManager.GetAllCustomers();
  var body = document.querySelector("tbody");
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    const status = customer.blocked ? "InActive" : "Active";
    body.appendChild(CreateDataTable("user", customer.id, customer.name, customer.email, customer.password, customer.Address.city, customer.phone, status));
  }
  
}

/*------------------------------------------------------------------------------*/

/*- SELLER FUNCTIONS
-----------------------------------------------------------------------*/
function CreateSellerHeader() {
  var Usersbtns = ` 
  <div class="my-4">
    <button class="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#sellerActionModal" data-action="add">
      Add Seller
    </button>
    <button class="btn btn-danger me-2" data-bs-toggle="modal" data-bs-target="#sellerActionModal" data-action="block">
      Block Seller
    </button>
    <button class="btn btn-info text-white" data-bs-toggle="modal" data-bs-target="#sellerActionModal" data-action="unblock">
      Unblock Seller
    </button>
  </div> 

  <div class="modal fade" id="sellerActionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">Manage Seller</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <!-- Add Seller Form -->
          <form id="sellerForm" class="d-flex flex-column d-none">
            <div class="row mb-3">
              <div class="col">
                <input type="text" id="name" class="form-control rounded" placeholder="First Name" required 
                  pattern="[A-Za-z]+" title="Please enter a valid name">
              </div>
            </div>

            <div class="mb-3">
              <input type="email" id="email" class="form-control rounded" placeholder="Email Address" required
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}"
                title="Please enter a valid email address">
            </div>

            <div class="mb-3">
              <input type="text" id="phone" class="form-control rounded" placeholder="Phone Number" required
                pattern="^01[0125][0-9]{8}$" title="Please enter a valid phone number">
            </div>

            <div class="row mb-3">
              <div class="col">
                <input type="text" id="street" class="form-control rounded" placeholder="Street" required
                  pattern="^[A-Za-z0-9\s]{3,50}$">
              </div>
              <div class="col">
                <input type="text" id="city" class="form-control rounded" placeholder="City" required
                  pattern="^[A-Za-z\\s]{2,30}$">
              </div>
              <div class="col">
                <input type="text" id="zip" class="form-control rounded" placeholder="ZIP Code" required
                  pattern="\\d{5}">
              </div>
            </div>

            <div class="d-grid">
              <button type="submit" class="btn btn-warning btn-lg rounded">Save Seller</button>
            </div>
          </form>

          <!-- Block / Unblock Seller Form -->
          <div id="blockUnblockForm" class="d-none">
            <input type="number" id="sellerId" class="form-control mb-3" placeholder="Enter Seller ID" required />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="confirmAction">Confirm</button>
        </div>
      </div>
    </div>
  </div>
`;

  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = Usersbtns + table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");
  var attributes = ["Seller ID", "Name", "Email", "Password", "City", "Phone", "Status", "Delete"];
  for (var i = 0; i < attributes.length; i++) {
    var th = document.createElement("th");
    th.textContent = attributes[i];
    tr.appendChild(th);
  }
  head.appendChild(tr);
}

function ManageSellers() {
  const modal = new bootstrap.Modal(document.getElementById('sellerActionModal'));
  let currentAction = '';

  document.querySelectorAll('[data-bs-target="#sellerActionModal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAction = btn.dataset.action;

      const title = currentAction === 'add' ? 'Add Seller' :
        currentAction === 'block' ? 'Block Seller' :
          'Unblock Seller';
      document.getElementById('modalTitle').textContent = title;

      document.getElementById('sellerForm').classList.toggle('d-none', currentAction !== 'add');
      document.getElementById('blockUnblockForm').classList.toggle('d-none', currentAction === 'add');
    });
  });

  document.getElementById('confirmAction').addEventListener('click', () => {
    if (currentAction === 'add') {
      const seller = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: GenerateSecurePassword(),
        phone: document.getElementById("phone").value,
        Address: {
          street: document.getElementById("street").value,
          city: document.getElementById("city").value,
          zipCode: document.getElementById("zip").value
        }
      };

      if(SellerManager.AddSeller(seller.name, seller.email, seller.password, seller.phone, seller.Address)) {
        alert("Seller added successfully!");
        var body = document.querySelector("tbody");
        var len = UserManager.GetUsersCount();
        var s = SellerManager.GetSellerById(len - 1);
        const status = seller.blocked ? "InActive" : "Active";
        body.appendChild(CreateDataTable("user", s.id, s.name, s.email, s.password, s.Address.city, s.phone, status));
        location.reload();
      }


    } else {
      const sellerId = parseInt(document.getElementById('sellerId').value);
      if (isNaN(sellerId) || sellerId < 0 || !sellerId) {
        alert("Please enter a valid Seller ID.");
        return;
      }
      const users = StorageManager.LoadSection("users");
      const sellers = users.filter(user => user.role === "seller");
      const returnId = sellers.find(s => s.id === sellerId);
      if (!returnId){
        alert("ID doesn't exist")
        return;
      }
      if (currentAction === 'block') {
        SellerManager.BlockSeller(sellerId);
        alert(`Seller #${sellerId} blocked.`);
        location.reload();
      } else if (currentAction === 'unblock') {
        SellerManager.UnblockSeller(sellerId);
        alert(`Seller #${sellerId} unblocked.`);
        location.reload();
      }
    }
    modal.hide();
    document.getElementById('sellerId').value = '';
  });
}

function ShowSellers() {
  DisplayNone();
  CreateSellerHeader();
  ManageSellers();
  const sellers = SellerManager.GetAllSellers();
  var body = document.querySelector("tbody");
  console.log(sellers.length);
  for (let i = 0; i < sellers.length; i++) {
    const seller = sellers[i];
    const status = seller.blocked ? "InActive" : "Active";
    const city = seller.Address.city;
    console.log(city);
    body.appendChild(CreateDataTable("user", seller.id, seller.name, seller.email, seller.password, city, seller.phone, status));
  }
}
/*------------------------------------------------------------------------------*/

/*- PRODUCTS FUNCTIONS
--------------------------------------------------------------------------------*/
function CreateProductHeader() {
  var ProductBtns = CreateModal("Product", "Approve", "Reject");
  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = ProductBtns + table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");
  var attributes = ["Product ID", "Name", "Price", "Category", "Stock", "Status"];
  for (var i = 0; i < attributes.length; i++) {
    var th = document.createElement("th");
    th.textContent = attributes[i];
    tr.appendChild(th);
  }
  head.appendChild(tr);
}

function CreateProductTable(type, ...args) {
  var tr = document.createElement("tr");
  for (var i = 0; i < args.length; i++) {
    var td = createCell();
    td.textContent = args[i];
    tr.appendChild(td);
  }
  return tr;
}

function ManageProducts() {
  const modal = new bootstrap.Modal('#ProductActionModal');
  let currentAction = '';
  document.querySelectorAll('[data-bs-target="#ProductActionModal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAction = btn.dataset.action;
      document.getElementById('modalTitle').textContent =
        `${currentAction === 'Approve' ? 'Approve' : 'Reject'} Product`;
    });
  });

  document.getElementById('confirmAction').addEventListener('click', () => {
    const productId = parseInt(document.getElementById('ProductId').value);
    if (isNaN(productId) || productId < 0 || !productId){
      alert('Please enter a valid ID');
      return;
    }
    const products = ProductManager.GetAllProducts();
    const returnId = products.find(c => c.id === productId);
    if (!returnId){
      alert("ID doesn't exist")
      return;
    }
    if (currentAction === 'Approve') {
      ProductManager.ApproveProduct(productId)
      alert(`Product #${productId} approved successfully!`);
      location.reload();
    } else {
      ProductManager.RejectProduct(productId)
      alert(`Product #${productId} rejected successfully!`);
      location.reload();
    }
    modal.hide();
    document.getElementById('productId').value = '';
  });
}

function ShowProducts() {
  DisplayNone();
  CreateProductHeader();
  ManageProducts();
  const productList = StorageManager.LoadSection("products") || [];
  var body = document.querySelector("tbody");
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    body.appendChild(CreateProductTable("product", product.id, product.name, product.price, product.category, product.stock, product.status));
  }
}

/*------------------------------------------------------------------------------*/

/*- ORDERS FUNCTIONS
--------------------------------------------------------------------------------*/

function CreateOrdersHeader() {
  const OrdersBtns = ` 
    <div class="my-4">
      <h3 class="fw-bold">Orders Management</h3>
    </div>
  `;
  
  const table = createTable();
  const contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = OrdersBtns + table;
  
  const head = document.querySelector("thead");
  const tr = document.createElement("tr");
  const attributes = ["Order ID", "Customer Name", "Order Date", "Total Amount", "Status", "Actions"];

  for (let i = 0; i < attributes.length; i++) {
    const th = document.createElement("th");
    th.textContent = attributes[i];
    tr.appendChild(th);
  }
  
  head.appendChild(tr);
}

function CreateOrdersTable(orderId, customerName, orderDate, totalAmount, status) {
  const tr = document.createElement("tr");
  const cells = [orderId, customerName, orderDate, totalAmount, status];
  cells.forEach(cellContent => {
    const td = createCell();
    td.textContent = cellContent;
    tr.appendChild(td);
  });
  
  const actionTd = createCell();
  const displayIcon = createDisplayIcon(orderId);
  actionTd.appendChild(displayIcon);
  tr.appendChild(actionTd);
  return tr;
}

function createDisplayIcon(orderId) {
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-eye-fill", "text-info", "fs-5", "ms-2", "cursor-pointer");
  icon.addEventListener("click", () => {
    ShowOrderDetails(orderId);
  });
  return icon;
}


function ShowOrderDetails(orderId) {
  const orders = StorageManager.LoadSection("orders") || [];
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    alert("Order not found!");
    return;
  }

  const customer = CustomerManager.GetCustomerById(order.userId);
  if (!customer) {
    alert("Customer not found!");
    return;
  }

  const productListHtml = order.products.map(p => {
    const product = ProductManager.GetProductById(p.productId);
    if (!product) return `<li>Unknown product (ID: ${p.productId})</li>`;
    return `
      <li>
        ${product.name} (x${p.quantity}) - $${(product.price * p.quantity).toFixed(2)}
      </li>
    `;
  }).join("");

  const cardHtml = `
    <div class="shadow-lg p-4">
      <h5 class="card-title">Order Details</h5>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Customer:</strong> ${customer.name}</p>
      <p><strong>Order Date:</strong> ${order.orderDate}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Payment Method:</strong> ${order.PaymentMethod}</p>
      <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
      <h6>Shipping Address:</h6>
      <p>${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}</p>
      <h6>Products:</h6>
      <ul>
        ${productListHtml}
      </ul>
      <button id=close class="btn btn-secondary">Close</button>
    </div>
  `;
  const contentDiv = document.querySelector("#mainContent");
  contentDiv.innerHTML = cardHtml;
  var closeBtn = document.getElementById("close");
  closeBtn.addEventListener("click", function(){
    ShowOrders();
  })
}


// Close the card



function ShowOrders() {
  DisplayNone();
  CreateOrdersHeader();
  
  const orders = StorageManager.LoadSection("orders") || [];
  const body = document.querySelector("tbody");
  
  orders.forEach(order => {
    const status = order.completed ? "Completed" : "Pending";
    body.appendChild(CreateOrdersTable(order.id, order.customerName, order.orderDate, order.totalAmount, status));
  });
}

/*------------------------------------------------------------------------------*/

/*- STATS FUNCTIONS
--------------------------------------------------------------------------------*/

function ShowDashboard() {
  const dashHeader = document.getElementById("dashHeader");
  dashHeader.innerHTML = `
        <div class="col-12 col-md-4">
          <div class="card shadow">
            <div class="card-body py-4">
              <h3 class="fw-bold fs-4 mb-3">Welcome to Admin Dashboard</h3>
              <p>Use the sidebar to manage users, products, and orders.</p>
                <li>👥 Manage Users: view, add, or remove users.</li>
                <li>📦 Manage Products: create, update, delete inventory.</li>
                <li>🧾 Manage Orders: track, fulfill, or cancel orders.</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card shadow">
            <div class="card-body py-4">
                <h3 class="fw-bold fs-4 mb-3">Profile</h3>
                <p class="fw-bold mb02">
                  <span id=adminName>Name: </span><br>
                  <span id=adminRole>Role: </span><br>
                  <span id=adminEmail>Email: </span><br>
                  <span id=adminPhone>Phone: </span><br>
                  <a href="www.linkedin.com"><i class="bi bi-linkedin fs-4 me-3"></i></a>
                  <a href="www.facebook.com"><i class="bi bi-twitter fs-4 me-3"></i></a>
                  <a href="www.twitter.com"><i class="bi bi-facebook fs-4 me-3"></i></a>
                </p>
              </div>
            </div>
          </div>
        </div> `
  const adminName = document.getElementById("adminName");
  const adminRole = document.getElementById("adminRole");
  const adminEmail = document.getElementById("adminEmail");
  const adminPhone = document.getElementById("adminPhone");
  const users = StorageManager.LoadSection("users");
  const admin = users.find(user => user.role === "admin");
  if (admin) {
    adminName.innerText = admin.name;
    adminRole.innerText = admin.role;
    adminEmail.innerText = admin.email;
    adminPhone.innerText = admin.phone;
  } else {
    alert("Admin data not found.");
  }
}
function ShowAnalytics() {
  var totalProducts = ProductManager.GetProductCounts();
  var totalCustomers = CustomerManager.GetCustomerCounts();
  var totalSellers =  SellerManager.GetSellerCounts();
  var carts = StorageManager.LoadSection("cart");
  var revenue = 0;
  var totalOrders = StorageManager.LoadSection("orders").length;
  for (var i = 0; i < carts.length - 1; i++) {
      revenue += carts[i].totalAmount;
  }
  const dashboardData = {
    _revenue: revenue,
    _revenueChange: 9.0,
    products: totalProducts,
    customers: totalCustomers,
    sellers: totalSellers,
    orders: totalOrders,
    _ordersChange: 5.3,
    visitors: 5243,
    visitorsChange: 12.5,
  };

  // Animate numbers counting up
  function animateValue(id, target, duration = 5000) {
    const element = document.getElementById(id);
    const start = 0;
    const increment = target / (duration / 16); // 60fps

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        current = target;
      }
      element.textContent =
        id === "revenue" ? `$${Math.floor(current).toLocaleString()}`
          : Math.floor(current).toLocaleString();
    }, 16);
  }
  const dashboardContent = document.getElementById("mainContent");
  dashboardContent.innerHTML = `
          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold"> TOTAL REVENUE </h5>
                <p id="revenue" class="fw-bold mb02">$89,1891</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">WEBSITE VISITORS</h5>
                <p id = visitors class="fw-bold mb02">1891</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">TOTAL ORDERS</h5>
                <p id = orders class="fw-bold mb02">1000</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">TOTAL CUSTOMERS</h5>
                <p id = customers class="fw-bold mb02">1000</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">TOTAL SELLERS</h5>
                <p id = sellers class="fw-bold mb02">1000</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">TOTAL PRODUCTS</h5>
                <p id = products class="fw-bold mb02">1000</p>
              </div>
            </div>
          </div> `

  animateValue("revenue", dashboardData._revenue);
  animateValue("visitors", dashboardData.visitors);
  animateValue("orders", dashboardData.orders);
  animateValue("products", dashboardData.products);
  animateValue("customers", dashboardData.customers);
  animateValue("sellers", dashboardData.sellers);

}

/*------------------------------------------------------------------------------*/

/*- NOTIFICATION FUNCTIONS
--------------------------------------------------------------------------------*/
function ShowMessages() {
  var msgs = StorageManager.LoadSection("messages");
  if (msgs) {
    for (var i = 1; msgs.length; i++) {

    }
  }

}



/*- HELPER FUNCTIONS
-----------------------------------------------------------------------*/
function createTable() {
  const table = `
    <div class="container-fluid px-4 mt-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <input type="text" class="form-control w-25" placeholder="Search By Id..." id="searchInput">
          </div>

          <div class="table-responsive shadow-sm rounded bg-white p-2">
            <table class="table table-striped table-bordered table-hover align-middle text-center">
              <thead class="table-dark">

              </thead>
              <tbody>
            
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
  return table;
}

function DisplayNone() {
  document.getElementById("mainContent").innerHTML = "";
  document.getElementById("dashHeader").innerHTML = "";
}

function createCell() {
  var cell = document.createElement("td");
  return cell;
}

function CreateModal (type, ...actions) {
  var modal = `
    <div class="my-4">
      <button class="btn btn-danger me-2" data-bs-toggle="modal" data-bs-target="#${type}ActionModal" data-action="${actions[0]}">
        ${actions[0]} ${type}
      </button>
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#${type}ActionModal" data-action="${actions[1]}">
        ${actions[1]} ${type}
      </button>
    </div>

      <div class="modal fade" id="${type}ActionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">${actions[0]}/${actions[1]} ${type}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <form id="${type}ActionForm">
              <div class="mb-3">
                <label for="${type}Id" class="form-label">Enter ${type} ID</label>
                <input type="number" class="form-control" id="${type}Id" required>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="confirmAction">Confirm</button>
          </div>
        </div>
      </div>
    </div>`
  return modal;
}

function createDeleteIcon(id, type) {
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-trash-fill", "text-danger", "fs-5", "ms-2", "cursor-pointer");
  icon.addEventListener("click", function () {
    var tr = this.parentElement.parentElement;
    switch (type) {
      case "user":
        (confirm("Do you want to delete this user?")) ? tr.remove() : "undefined";
        UserManager.DeleteUser(id);
        break;
      case "product":
        (confirm("Do you want to delete this product?")) ? tr.remove() : "undefined";
        ProductManager.DeleteProduct(id);
        break;
      default:
        break;
    }

  });
  return icon;
}

function GenerateSecurePassword() {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specialChars = "_()!@#$%^&*";
  const allChars = letters + digits + specialChars;

  let password = "";
  password += letters[Math.floor(Math.random() * letters.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  const remainingLength = 8 + Math.floor(Math.random() * 4) - 3; 
  for (let i = password.length; i < remainingLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  password = password.split('').sort(() => 0.5 - Math.random()).join('');
  return password;
}


/*- ON LOADING
-----------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
  // Toggle the Sidebar
  const toggleBtn = document.querySelector(".toggle-btn");
  const toggler = document.querySelector("#icon");
  toggleBtn.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("expand");
    toggler.classList.toggle("bxs-chevrons-right");
    toggler.classList.toggle("bxs-chevrons-left");
  });

  // Show the dashboard by default
  ShowDashboard();
  ShowAnalytics();
  // Attach event listeners to sidebar buttons
  document.querySelectorAll('[data-section]').forEach(button => {
    button.addEventListener('click', function () {
      const section = this.dataset.section;
      switch (section) {
        case "customers":
          ShowCustomers();
          break;
        case "sellers":
          ShowSellers();
          break;
        case "products":
          ShowProducts();
          break;
        case "orders":
          ShowOrders();
          break;
        case "notifications":
          ShowMessages();
          break;
        case "analytics":
          ShowAnalytics();
          break;
        default:
          ShowDashboard();
          break;
      }
    });
  });
});