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
    Can add, edit, or remove any product.
    Access to a dashboard displaying:
    Number of customers
    Sales statistics
    Other key metrics
    Can purchase products like a regular customer.
 *****************************************************************************/

/*- INCLUDES
-----------------------------------------------------------------------*/
import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js'
import ProductManager from '../modules/ProductModule.js'
import SellerManager from '../modules/SellerModule.js';
import CustomerManager from '../modules/CustomerModule.js';

/*- USERS FUNCTIONS
-----------------------------------------------------------------------*/
function CreateDataTable(id, name, email, password, city, phone) {
  var tr = document.createElement("tr");
  var td = createCell();
  td.textContent = id;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = name;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = email;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = password;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = city;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = phone;
  tr.appendChild(td);

  td = createCell();
  td.appendChild(createDeleteIcon(id));
  tr.appendChild(td);
  return tr;
}

function CreateHeader() {
  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");

  var th = document.createElement("th");
  th.textContent = "ID";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Name";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Email";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Password";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Role";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "City";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Phone";
  tr.appendChild(th);
  head.appendChild(tr);
}

function ShowCustomers() {
  DisplayNone();
  CreateHeader();
  const usersList = StorageManager.LoadSection("users") || [];
  const customers = usersList.filter(user => user.role === "customer");
  var body = document.querySelector("tbody");
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    body.appendChild(CreateDataTable(customer.id, customer.name, customer.email, customer.password, customer.Address.city, customer.phone));
  }
}

function ShowSellers() {
  DisplayNone();
  CreateHeader();
  const usersList = StorageManager.LoadSection("users") || [];
  const sellers = usersList.filter(user => user.role === "seller");
  var body = document.querySelector("tbody");
  for (let i = 0; i < sellers.length; i++) {
    const seller = sellers[i];
    body.appendChild(CreateDataTable(seller.id, seller.name, seller.email, seller.password, seller.Address.city, seller.phone));
  }
}
/*----------------------------------------------------------------------------*/

/*- PRODUCTS FUNCTIONS
--------------------------------------------------------------------------------*/
function ShowHeaderProduct() {
  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");

  var th = document.createElement("th");
  th.textContent = "#";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Name";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Price";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Stock";
  tr.appendChild(th);

  head.appendChild(tr);
}


function ShowProducts() {
  DisplayNone();
  ShowHeaderProduct();
  const productList = StorageManager.LoadSection("products") || [];
  var body = document.querySelector("tbody");
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    body.appendChild(createRowForProducts(product.id, product.name, product.price, product.stock));
  }
}

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
                  <h5 class="mb-2 fw-bold">PROFILE</h5>
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
    
    new Chart(document.getElementById("bar-chart-grouped"), {
      type: 'bar',
      data: {
        labels: ["1900", "1950", "1999", "2050"],
        datasets: [
          {
            label: "Africa",
            backgroundColor: "#3e95cd",
            data: [133, 221, 783, 2478]
          }, {
            label: "Europe",
            backgroundColor: "#8e5ea2",
            data: [408, 547, 675, 734]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Population growth (millions)'
        }
      }
    });
}

/*- HELPER FUNCTIONS
-----------------------------------------------------------------------*/
function createTable() {
  var table = `
      <div class="row">
        <div class="col-12 col-md-7">
          <h3 class="fw-bold fs-4 my-3">Users</h3>
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover align-middle text-center">
              <thead>

              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
        </div>
      </div>
            `
  return table;
}

function DisplayNone() {
  document.getElementById("mainContent").innerHTML = "";
  document.getElementById("dashHeader").innerHTML = "";
}



function createRowForProducts(id, name, price, stock, category) {
  var tr = document.createElement("tr");
  var td = createCell();
  td.textContent = id;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = name;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = price;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = stock;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = category;
  tr.appendChild(td);

  td = createCell();
  td.appendChild(createDeleteIcon(id));
  tr.appendChild(td);
  return tr;
}

function createCell() {
  var cell = document.createElement("td");
  return cell;
}

function createDeleteIcon(id) {
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-trash", "text-danger", "fs-5", "ms-2", "cursor-pointer");
  icon.addEventListener("click", function () {
    var tr = this.parentElement.parentElement;
    (confirm("Do you want to delete this user?")) ? tr.remove() : "undefined";
    UserManager.DeleteUser(id);
  });
  return icon;
}


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
