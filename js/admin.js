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
  var Usersbtns = ` 
    <div class="my-4">
      <button class="btn btn-danger me-2" data-bs-toggle="modal" data-bs-target="#customerActionModal" data-action="block">
        Block Customer
      </button>
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#customerActionModal" data-action="unblock">
        Unblock Customer
      </button>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="customerActionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">Block/Unblock Customer</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="customerActionForm">
              <div class="mb-3">
                <label for="customerId" class="form-label">Enter Customer ID</label>
                <input type="number" class="form-control" id="customerId" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="confirmAction">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  `
  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = Usersbtns + table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");
  var attributes = ["Customers", "Name", "Email", "Password", "City", "Phone", "Status", "Delete"];
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
  const modal = new bootstrap.Modal('#customerActionModal');
  let currentAction = '';
  document.querySelectorAll('[data-bs-target="#customerActionModal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAction = btn.dataset.action;
      document.getElementById('modalTitle').textContent = 
        `${currentAction === 'block' ? 'Block' : 'Unblock'} Customer`;
    });
  });

  document.getElementById('confirmAction').addEventListener('click', () => {
    const customerId = parseInt(document.getElementById('customerId').value);
    if (isNaN(customerId)) {
      alert('Please enter a valid ID');
      return;
    }
    if (currentAction === 'block') {
      CustomerManager.BlockCustomer(customerId);
      alert(`Customer #${customerId} blocked successfully!`);
    } else {
      CustomerManager.UnblockCustomer(customerId);
      alert(`Customer #${customerId} unblocked successfully!`);
    }
    modal.hide();
    document.getElementById('customerId').value = '';
  });
}

function ShowCustomers() {
  DisplayNone();
  CreateCustomerHeader();
  const customers = CustomerManager.GetAllCustomers();
  var body = document.querySelector("tbody");
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    const status = customer.blocked ? "InActive" : "Active";
    body.appendChild(CreateDataTable("user", customer.id, customer.name, customer.email, customer.password, customer.Address.city, customer.phone, status));
  }
  ManageCustomers();
}

/*------------------------------------------------------------------------------*/

/*- SELLER FUNCTIONS
-----------------------------------------------------------------------*/
function CreateSellerHeader() {
  var Usersbtns = ` 
    <div class="my-4">
      <button class="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#customerActionModal" data-action="block">
        Add Seller
      </button>

      <button class="btn btn-danger me-2" data-bs-toggle="modal" data-bs-target="#customerActionModal" data-action="block">
        Block Seller
      </button>

      <button class="btn btn-info text-white" data-bs-toggle="modal" data-bs-target="#customerActionModal" data-action="unblock">
        Unblock Seller
      </button>
    </div> 
    
    <form id="customerForm" class="d-flex flex-column">
      <div class="row mb-3">
        <div class="col">
          <input type="text" id=name" class="form-control rounded" placeholder="First Name" required pattern="[A-Za-z]+" title="Only letters allowed">
        </div>
      </div>

      <div class="mb-3">
        <input type="email" id="email" class="form-control rounded" placeholder="Email Address" required
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}"
          title="Please enter a valid email address">
      </div>

      <div class="mb-3">
        <input type="text" id="phone" class="form-control rounded" placeholder="Phone Number" required
        pattern=>
      </div>

      <div class="row mb-3">
        <div class="col">
          <input type="text" id="street" class="form-control rounded" placeholder="Street" required>
        </div>
        <div class="col">
          <input type="text" id="city" class="form-control rounded" placeholder="City" required>
        </div>
        <div class="col">
          <input type="text" id="zip" class="form-control rounded" placeholder="ZIP Code" required pattern="\\d{5}">
        </div>
      </div>

      <div class="d-grid">
        <button type="submit" class="btn btn-warning btn-lg rounded">Save Customer</button>
      </div>
    </form>
  `;

  // document.getElementById("customerFormContainer").innerHTML = formHTML;
  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = Usersbtns + table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");
  var attributes = ["Sellers", "Name", "Email", "Password", "City", "Phone", "Status", "Delete"];
  for (var i = 0; i < attributes.length; i++) {
    var th = document.createElement("th");
    th.textContent = attributes[i];
    tr.appendChild(th);
  }
  head.appendChild(tr);
}

function ManageSellers() {
  // Handle form submission
  document.getElementById("customerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const customer = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: {
        street: document.getElementById("street").value,
        city: document.getElementById("city").value,
        zipCode: document.getElementById("zip").value
      }
    };
    CustomerManager.AddCustomer(customer);
  });
}



function ShowSellers() {
  DisplayNone();
  CreateSellerHeader();
  const sellers = SellerManager.GetAllSellers();
  var body = document.querySelector("tbody");
  for (let i = 0; i < sellers.length; i++) {
    const seller = sellers[i];
    const status = seller.blocked ? "InActive" : "Active";
    body.appendChild(CreateDataTable("user", seller.id, seller.name, seller.email, seller.password, seller.Address.city, seller.phone, status));
  }

  ManageSellers();
}
/*------------------------------------------------------------------------------*/

/*- PRODUCTS FUNCTIONS
--------------------------------------------------------------------------------*/
function CreateProductHeader() {
  var Productsbtns = ` 
    <div class="d-flex flex-wrap gap-2 mb-3">
      <button class="btn btn-success" id="addCustomerBtn">
        <i class="bi bi-person-plus"></i> Approve Product
      </button>

      <button class="btn btn-danger text-white" id="blockCustomerBtn">
        <i class="bi bi-lock-fill"></i> Reject Product
      </button>

    </div> `
  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = Productsbtns + table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");
  var attributes = ["Product", "Name", "Price", "Stock", "Delete"];
  for (var i = 0; i < attributes.length; i++) {
    var th = document.createElement("th");
    th.textContent = attributes[i];
    tr.appendChild(th);
  }
  head.appendChild(tr);
}

function ShowProducts() {
  DisplayNone();
  CreateProductHeader();
  const productList = StorageManager.LoadSection("products") || [];
  var body = document.querySelector("tbody");
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    body.appendChild(CreateDataTable("product", product.id, product.name, product.price, product.stock));
  }
}

/*------------------------------------------------------------------------------*/

/*- ORDERS FUNCTIONS
--------------------------------------------------------------------------------*/
function ShowDashboard() {
  const dashHeader = document.getElementById("dashHeader");
  dashHeader.innerHTML = `
        <div class="col-12 col-md-4">
          <div class="card shadow">
            <div class="card-body py-4">
              <h3 class="fw-bold fs-4 mb-3">Welcome to Admin Dashboard</h3>
              <p>Use the sidebar to manage users, products, and orders.</p>
              <ul>
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
  // Simulated data (replace with real data from localStorage/API)
  const dashboardData = {
    revenue: 89189,
    revenueChange: 9.0,
    visitors: 5243,
    visitorsChange: 12.5,
    orders: 1287,
    ordersChange: 5.3
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
  DisplayNone();
  const dashboardContent = document.getElementById("mainContent");
  dashboardContent.innerHTML = `
          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold"> TOTAL REVENUE </h5>
                <p id="revenue" class="fw-bold mb02">$89,1891</p>
                <div class="mb-0">
                  <span id="revenue-change" class="bagde text-success me-2">+9.0%</span>
                  <span class="fw-bold">Since Last Month</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">WEBSITE VISITORS</h5>
                <p id = visitors class="fw-bold mb02">1891</p>
                <div class="mb-0">
                  <span id = visitors-change class="bagde text-success me-2">+9.0%</span>
                  <span class="fw-bold">Since Last Month</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">TOTAL ORDERS</h5>
                <p id = orders class="fw-bold mb02">1000</p>
                <div class="mb-0">
                  <span id = orders-change  class="bagde text-success me-2">+9.0%</span>
                  <span class="fw-bold">Since Last Month</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">TOTAL CUSTOMERS</h5>
                <p id = customers class="fw-bold mb02">1000</p>
                <div class="mb-0">
                  <span id = customers-change class="bagde text-success me-2">+9.0%</span>
                  <span class="fw-bold">Since Last Month</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">TOTAL PRODUCTS</h5>
                <p id = products class="fw-bold mb02">1000</p>
                <div class="mb-0">
                  <span id = products-change class="bagde text-success me-2">+9.0%</span>
                  <span class="fw-bold">Since Last Month</span>
                </div>
              </div>
            </div>
          </div> 
          <div class="col-12 col-md-5">
            <h3 class="fw-bold fs-4 my-3">Reports Overview</h3>
            <canvas id="bar-chart-grouped" width="800" height="450"></canvas>
          </div> `
  // Update all cards on page load
  // Animate numbers
  animateValue("revenue", dashboardData.revenue);
  animateValue("visitors", dashboardData.visitors);
  animateValue("orders", dashboardData.orders);

  // Update percentage changes
  document.getElementById("revenue-change").textContent =
    `+${dashboardData.revenueChange}% Since Last Month`;
  document.getElementById("visitors-change").textContent =
    `+${dashboardData.visitorsChange}% Since Last Month`;
  document.getElementById("orders-change").textContent =
    `+${dashboardData.ordersChange}% Since Last Month`;

  // new Chart(document.getElementById("bar-chart-grouped"), {
  //   type: 'bar',
  //   data: {
  //     labels: ["1900", "1950", "1999", "2050"],
  //     datasets: [
  //       {
  //         label: "Africa",
  //         backgroundColor: "#3e95cd",
  //         data: [133, 221, 783, 2478]
  //       }, {
  //         label: "Europe",
  //         backgroundColor: "#8e5ea2",
  //         data: [408, 547, 675, 734]
  //       }
  //     ]
  //   },
  //   options: {
  //     title: {
  //       display: true,
  //       text: 'Population growth (millions)'
  //     }
  //   }
  // });
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
      case "order":
        break;
      default:
        break;
    }

  });
  return icon;
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