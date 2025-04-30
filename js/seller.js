/******************************************************************************
 * Copyright (C) 2024 by Abdelrahman Kamal - Admin Panel Page
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

// function ShowUsers() {
//   const usersList = StorageManager.LoadSection("users") || [];
//   var body = document.querySelector("tbody");
//   for (let i = 0; i < usersList.length; i++) {
//     const user = usersList[i];
//     body.appendChild(createRow(user.id, user.name, user.email, user.password, user.role, user.Address.city, user.phone));
//   }
// }




/*- HELPER FUNCTIONS
-----------------------------------------------------------------------*/
/*- HELPER FUNCTIONS
-----------------------------------------------------------------------*/
// create title for the table
function DisplayNone()
{
  
var clearheader = document.querySelector("thead");
clearheader.innerHTML = ""; // Clear existing content

var clearbody = document.querySelector("tbody");
clearbody.innerHTML = ""; // Clear existing content

var clearTitle = document.querySelector("#contentdiv");
clearTitle.innerHTML = ""; // Clear existing content
}

function createTitle()
{
  const title = document.querySelector("#contentdiv");
  var a = document.createElement("a")
  a.textContent="";
  title.appendChild(a);

}
// create table head for elements names
function createHeadForOrders() {
  const head=document.querySelector("thead");
  // head.innerHTML = ""; // Clear existing content
  var tr = document.createElement("tr");
  
  var th = document.createElement("th");
  th.textContent ="ID";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "User ID: ";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Products";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Total Amount"
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "status";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Order Date";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "Payment Method";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "shipping Address";
  tr.appendChild(th);


 head.appendChild(tr);
}


// create table head for elements names
function createHeadForProducts() {
  const head=document.querySelector("thead");
  // head.innerHTML = ""; // Clear existing content
  var tr = document.createElement("tr");
  
  var th = document.createElement("th");
  th.textContent ="ID";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "name";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "price";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "stock";
  tr.appendChild(th);

  var th = document.createElement("th");
  th.textContent = "category";
  tr.appendChild(th);

 head.appendChild(tr);

}
// create table body  for orders
function createRowForOrders(id, userId, products, totalAmount, status, orderDate, paymentMethod, shippingAddress) {
  
  var tr = document.createElement("tr");

  var td = createCell();
  td.textContent = id;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = userId;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = products;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = totalAmount;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = status;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = orderDate;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = paymentMethod;
  tr.appendChild(td);

  var td = createCell();
  td.textContent = shippingAddress;
  tr.appendChild(td);

  return tr;
}

// create table body  for products
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
    (confirm("Are you sure you want to delete")) ? tr.remove() : "undefined";
    UserManager.DeleteUser(id);
  });
  return icon;
}

function ShowProducts() {
  DisplayNone();
  createTitle();
  const title = document.querySelector("#contentdiv");
  title.textContent = "Products";
  createHeadForProducts();
  const productList = StorageManager.LoadSection("products") || [];
  var body = document.querySelector("tbody");
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    body.appendChild(createRowForProducts(product.id, product.name, product.price, product.stock));
  }
}

function ShowOrders() {
  DisplayNone();
  createTitle();  
  const title = document.querySelector("#contentdiv");
  title.textContent = "Orders";
  createHeadForOrders();
  const orderList = StorageManager.LoadSection("orders") || [];
  var body = document.querySelector("tbody");
  for (let i = 0; i < orderList.length; i++) {
    const order = orderList[i];
    body.appendChild(createRowForOrders(order.id, order.userId, order.products, order.totalAmount, order.status, order.orderDate, order.paymentMethod, order.shippingAddress));
  }
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

  const product = document.getElementById("productscontent");
  let productsLoaded = false; // Flag to ensure it's loaded only once
  product.addEventListener('click', () => {
    if (!productsLoaded) {
      const products = StorageManager.LoadSection("products") || [];
      ShowProducts();
      productsLoaded = true; // Set the flag to true after loading
    }
  });

  const order = document.getElementById("orderscontent");
  let ordersLoaded = false; // Flag to ensure it's loaded only once
  order.addEventListener('click', () => {
    if (!ordersLoaded) {
      const orders = StorageManager.LoadSection("orders") || [];
      ShowOrders();
      ordersLoaded = true; // Set the flag to true after loading
    }
  });


});

  // const profile = document.getElementById("profile");
  // profile.addEventListener('click', () => showProfile());
  // const accounts = document.getElementById("accounts");
  // accounts.addEventListener('click', () => ShowUsers());

// Delete user - View users - Reset password  - view products - add product - delete product - view orders - delete order 
// if user cancel the orders - contacts us > submit to be display -  
// Analytics : Most popular product - most sold product - most viewed product - most added to cart - most ordered product -
// Most sold product - Most viewed product - Most ordered prduct - 

// Seller Dashbord: 
