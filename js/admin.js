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
    if (currentAction === 'block') {
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
  var attributes = ["Sellers", "Name", "Email", "Password", "City", "Phone", "Status", "Delete"];
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

      SellerManager.AddSeller(seller.name, seller.email, seller.password, seller.phone, seller.Address);
      alert("Seller added successfully!");

      var body = document.querySelector("tbody");
      var len = UserManager.GetUsersCount();
      var s = SellerManager.GetSellerById(len - 1);
      console.log(s);
      const status = seller.blocked ? "InActive" : "Active";
      body.appendChild(CreateDataTable("user", s.id, s.name, s.email, s.password, s.Address.city, s.phone, status));
      location.reload();

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
  var Productsbtns = ` 
    <div class="my-4">
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#productActionModal" data-action="approve">
        Approve Product
      </button>
      <button class="btn btn-danger me-2" data-bs-toggle="modal" data-bs-target="#productActionModal" data-action="reject">
        Reject Product
      </button>

    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="productActionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">Approve/Reject Product</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="productActionForm">
              <div class="mb-3">
                <label for="productId" class="form-label">Enter Product ID</label>
                <input type="number" class="form-control" id="productId" required>
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
  contentdiv.innerHTML = Productsbtns + table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");
  var attributes = ["Products", "Name", "Price", "Category", "Stock", "Status"];
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
  const modal = new bootstrap.Modal('#productActionModal');
  let currentAction = '';
  document.querySelectorAll('[data-bs-target="#productActionModal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAction = btn.dataset.action;
      document.getElementById('modalTitle').textContent =
        `${currentAction === 'approve' ? 'Approve' : 'Reject'} Product`;
    });
  });

  document.getElementById('confirmAction').addEventListener('click', () => {
    const productId = parseInt(document.getElementById('productId').value);
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
    if (currentAction === 'approve') {
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
function CreateOrderHeader() {
  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = Usersbtns + table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");
  var attributes = ["Orders", "Useur-ID", "Product-ID", "Status", "City", "Phone", "Status", "Delete"];
  for (var i = 0; i < attributes.length; i++) {
    var th = document.createElement("th");
    th.textContent = attributes[i];
    tr.appendChild(th);
  }
  head.appendChild(tr);
}

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