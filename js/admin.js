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

/*- SIDEBAR TOGGLER
-----------------------------------------------------------------------*/
new Chart(document.getElementById("bar-chart-grouped"), {
  type: 'bar',
  data: {
    labels: ["1900", "1950", "1999", "2050"],
    datasets: [
      {
        label: "Africa",
        backgroundColor: "#3e95cd",
        data: [133,221,783,2478]
      }, {
        label: "Europe",
        backgroundColor: "#8e5ea2",
        data: [408,547,675,734]
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

/*- ADMIN DASHBOARD
-----------------------------------------------------------------------*/
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
function animateValue(id, target, duration = 2000) {
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

// Update all cards on page load
window.addEventListener('load', () => {
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
});

function ShowHeaderUser() {
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

function ShowHeaderProduct() {
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");

  var th = document.createElement("th");
  th.textContent = "ID";
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


function ShowUsers() {
  ShowHeaderUser();
  const usersList = StorageManager.LoadSection("users") || [];
  var body = document.querySelector("tbody");
  for (let i = 0; i < usersList.length; i++) {
    const user = usersList[i];
    body.appendChild(createRowForUsers(user.id, user.name, user.email, user.password, user.role, user.Address.city, user.phone));
  }
}

function ShowProducts() {
  ShowHeaderProduct();
  const productList = StorageManager.LoadSection("products") || [];
  var body = document.querySelector("tbody");
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    body.appendChild(createRowForProducts(product.id, product.name, product.price, product.stock));
  }
}

function ShowDashboard()
{
  const dashboardContent = document.getElementById("mainContent");
  const dashboardInfo = dashboardContent.innerHTML = `
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

          <div class="col-12 col-md-4">
            <div class="card shadow">
              <div class="card-body py-4">
                <h5 class="mb-2 fw-bold">PROFILE</h5>
                <p id = orders class="fw-bold mb02">
                  <span id=adminName>Name: </span><br>
                  <span id=adminRole>Role: </span><br>
                  <span id=adminEmail>Email: </span><br>
                  <span id=adminPhone>Phone: </span><br>
                  <i class="bi bi-linkedin fs-4 me-3"></i>
                  <i class="bi bi-twitter fs-4 me-3"></i>
                  <i class="bi bi-facebook fs-4"></i>
              </p>
                <div class="mb-0">
                  <span id = orders-change  class="bagde text-success me-2">+1</span>
                  <span class="fw-bold">Since Last Month</span>
                </div>
              </div>
            </div>
          </div>

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

          <div class="col-12 col-md-5">
            <h3 class="fw-bold fs-4 my-3">Reports Overview</h3>
            <canvas id="bar-chart-grouped" width="800" height="450"></canvas>
          </div>
        </div>  `
  const adminName = document.getElementById("adminName");
  const adminRole = document.getElementById("adminRole");
  const adminEmail = document.getElementById("adminEmail");
  const adminPhone = document.getElementById("adminPhone");
  const admin = StorageManager.LoadSection("admin");
  if (admin) {
    adminName.innerText =  admin.name;
    adminRole.innerText = admin.role;
    adminEmail.innerText = admin.email;
    adminPhone.innerText = admin.phone;
  } else {
    alert("Admin data not found.");
  }

}
// function showProfile() {


//   const Btns = document.createElement("div");
//   Btns.classList.add("d-flex", "justify-content-between", "mt-3");
//   profileContent.appendChild(Btns);
//   const editBtn = document.createElement("button");
//   editBtn.innerText = "Edit Profile";
//   editBtn.classList.add("btn", "btn-primary");
//   editBtn.addEventListener("click", function () {
//     const newName = prompt("Enter new name:", adminName.innerText);
//     const newRole = prompt("Enter new role:", adminRole.innerText);
//     const newEmail = prompt("Enter new email:", adminEmail.innerText);
//     const newPhone = prompt("Enter new phone:", adminPhone.innerText);
//     if (newName && newRole && newEmail && newPhone) {
//       StorageManager.SaveSection("admin", { name: newName, role: newRole, email: newEmail, phone: newPhone });
//       showProfile();
//     }
//   });

// }

/*- HELPER FUNCTIONS
-----------------------------------------------------------------------*/
function createRowForUsers(id, name, email, password, role, city, phone) {
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
  td.textContent = role;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = city;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = phone;
  tr.appendChild(td);

  td = createCell();    // Delete
  td.appendChild(createDeleteIcon(id));
  tr.appendChild(td);
  return tr;
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

  td = createCell();    // Delete
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

document.addEventListener('DOMContentLoaded', function() {
  // ShowUsers();

  const toggleBtn = document.querySelector(".toggle-btn");
  const toggler = document.querySelector("#icon");
  toggleBtn.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
  toggler.classList.toggle("bxs-chevrons-right");
  toggler.classList.toggle("bxs-chevrons-left");
  });

  const customers = document.getElementById("customers");
  customers.addEventListener('click', () => {
    const users = StorageManager.LoadSection("users") || [];
    const customerCount = users.filter(user => user.role === "customer").length;
    alert(`Number of customers: ${customerCount}`);
  });

  const product = document.getElementById("products");
  product.addEventListener('click', () => {
    const products = StorageManager.LoadSection("products") || [];
    const productCount = products.length;
    alert(`Number of products: ${productCount}`);
    ShowProducts();
  });

}); 
