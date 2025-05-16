/*- INCLUDES
-----------------------------------------------------------------------*/
import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js'
import ProductManager from '../modules/ProductModule.js'
import SellerManager from '../modules/SellerModule.js';
import CustomerManager from '../modules/CustomerModule.js';
/*------------------------------------------------------------------------------*/



/*- PRODUCTS FUNCTIONS
--------------------------------------------------------------------------------*/
function CreateProductHeader() {
  AssignHeader("Manage Products");
  var ProductBtns = CreateModal("Product", "Add");
  var table = createTable();
  var contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = ProductBtns + table;
  var head = document.querySelector("thead");
  var tr = document.createElement("tr");
  var attributes = ["Product ID", "Name", "Price", "Category", "Stock", "Edit / Delete"];
  for (var i = 0; i < attributes.length; i++) {
    var th = document.createElement("th");
    th.textContent = attributes[i];
    th.style.textAlign = "center";
    tr.appendChild(th);
  }
  head.appendChild(tr);
}

function CreateProductTable(type, ...args) {
  const tr = document.createElement("tr");
  for (let i = 0; i < args.length; i++) {
    const td = createCell();
    td.textContent = args[i];
    tr.appendChild(td);
  }

  const productId = args[0];
  const actionTd = createCell();
  const editBtn = document.createElement("button");
  /////////////Edit
  editBtn.textContent = "Edit";
  editBtn.className = "btn btn-warning btn-sm me-5";
  editBtn.addEventListener("click", () => openEditProductModal(productId));
  actionTd.appendChild(editBtn);
  ///////////Delete
  const deleteIcon = createDeleteIcon(productId, "product");
  actionTd.appendChild(deleteIcon);

  tr.appendChild(actionTd);

  return tr;
}

function ManageProducts() {
  const modal = new bootstrap.Modal('#ProductActionModal');
  let currentAction = '';
  var sellerId = StorageManager.LoadSellerId();
  console.log(sellerId);
  document.querySelectorAll('[data-bs-target="#ProductActionModal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAction = btn.dataset.action;
      document.getElementById('modalTitle').textContent =
        `${currentAction === 'Add' ? 'Add' : 'Edit'} Product`;
      ClearForm("Product");
    });
  });

  document.getElementById('confirmAction').addEventListener('click', () => {
    const name = document.getElementById('ProductName').value.trim();
    const description = document.getElementById('ProductDescription').value.trim();
    const price = parseFloat(document.getElementById('ProductPrice').value);
    const stock = parseInt(document.getElementById('ProductStock').value);
    const category = document.getElementById('ProductCategory').value.trim();
    const imageFile = document.getElementById('ProductImage').files[0];

    const currentAction = document.getElementById("currentAction").value;
    const productId = parseInt(document.getElementById("currentProductId").value);

    if (currentAction === 'Add') {

      if (!imageFile) {
        showToast("Please select an image.", "warning");
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64Image = e.target.result;
        const success = ProductManager.AddProduct(name, description, price, stock, category, base64Image, "approved", sellerId);
        if (success) {
          const modal = bootstrap.Modal.getInstance(document.getElementById('ProductActionModal'));
          modal.hide();
          showToast(`Product "${name}" added successfully!`, "success");
          ShowProducts();
        }
      };
      reader.readAsDataURL(imageFile);

    } else if (currentAction === 'Edit') {
      const productId = parseInt(document.getElementById("currentProductId").value);

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const base64Image = e.target.result;
          ProductManager.UpdateProduct(productId, name, description, price, stock, category, base64Image);
          const modal = bootstrap.Modal.getInstance(document.getElementById('ProductActionModal'));
          modal.hide();
          showToast("Product updated successfully!", "success");
          ShowProducts();
        };
        reader.readAsDataURL(imageFile);
      } else {
        // Load current image from storage
        const products = StorageManager.LoadSection("products") || [];
        const existingProduct = products.find(p => p.id === productId);
        const existingImage = existingProduct ? existingProduct.image : "";
        ProductManager.UpdateProduct(productId, name, description, price, stock, category, existingImage);
        const modal = bootstrap.Modal.getInstance(document.getElementById('ProductActionModal'));
        modal.hide();
        showToast("Product updated successfully!", "success");
        ShowProducts();

      }
    }


  });
}
//Like profile.js to show data before to edit it 
window.openEditProductModal = function (productId) {
  const products = StorageManager.LoadSection("products") || [];
  const product = products.find(p => p.id === productId);
  if (!product) return;

  document.getElementById("ProductName").value = product.name;
  document.getElementById("ProductDescription").value = product.description;
  document.getElementById("ProductPrice").value = product.price;
  document.getElementById("ProductStock").value = product.stock;
  document.getElementById("ProductCategory").value = product.category;
  document.getElementById("currentProductId").value = product.id;
  document.getElementById("currentAction").value = "Edit";

  const modal = new bootstrap.Modal(document.getElementById("ProductActionModal"));
  modal.show();
};

function ShowProducts() {
  DisplayNone();
  CreateProductHeader();
  ManageProducts();
  var sellerId = StorageManager.LoadSellerId();
  const productList = ProductManager.GetProductBySellerId(sellerId);
  var body = document.querySelector("tbody");
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    body.appendChild(CreateProductTable("product", product.id, product.name, product.price, product.category, product.stock));
  }
}

/*------------------------------------------------------------------------------*/

/*- ORDERS FUNCTIONS
--------------------------------------------------------------------------------*/

function CreateOrdersHeader() {
  AssignHeader("Manage Orders");
  const table = createTable();
  const contentdiv = document.querySelector("#mainContent");
  contentdiv.innerHTML = table;

  const head = document.querySelector("thead");
  const tr = document.createElement("tr");
  const attributes = ["Order ID", "Product ID",
    "Order Date", "Total Amount", "Status", "Actions", "Accept", "Decline", "Delivered"];

  for (let i = 0; i < attributes.length; i++) {
    const th = document.createElement("th");
    th.textContent = attributes[i];
    tr.appendChild(th);
  }

  head.appendChild(tr);
}

function CreateOrdersTable(orderId, productIds, orderDate, totalAmount, status) {
  const tr = document.createElement("tr");
  const orders = StorageManager.LoadSection("orders") || [];
  const order = orders.find(o => o.id === orderId);

  if (order.products && Array.isArray(order.products)) {
    productIds = order.products.map(p => p.id || p.productId).join(", ");
  }

  const cells = [orderId, productIds, orderDate, totalAmount, status];
  cells.forEach(cellContent => {
    const td = createCell();
    td.textContent = cellContent;
    tr.appendChild(td);
  });

  const actionTd = createCell();
  const displayIcon = createDisplayIcon(orderId);
  actionTd.appendChild(displayIcon);
  tr.appendChild(actionTd);

  const checkedTd = createCell();
  const checkedIcon = createCheckedIcon(orderId);
  checkedTd.appendChild(checkedIcon);
  tr.appendChild(checkedTd);

  const uncheckedTd = createCell();
  const uncheckedIcon = createUncheckedIcon(orderId);
  uncheckedTd.appendChild(uncheckedIcon);
  tr.appendChild(uncheckedTd);

  const deliveredTd = createCell();
  const deliveredIcon = createDeliveredIcon(orderId);
  deliveredTd.appendChild(deliveredIcon);
  tr.appendChild(deliveredTd);

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

function createCheckedIcon(orderId) {
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-check", "text-success", "fs-5", "ms-2", "cursor-pointer");
  icon.addEventListener("click", () => {
    var orders = StorageManager.LoadSection("orders");
    var order = orders.find(o => o.id === orderId);
    order.status = "processing";
    location.reload();
    StorageManager.SaveSection("orders", orders);
  });
  return icon;
}

function createUncheckedIcon(orderId) {
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-square", "ext-secondary", "fs-5", "ms-2", "cursor-pointer");
  icon.addEventListener("click", () => {
    var orders = StorageManager.LoadSection("orders");
    var order = orders.find(o => o.id === orderId);
    order.status = "pending";
    StorageManager.SaveSection("orders", orders);
    location.reload();
  });
  return icon;
}

function createDeliveredIcon(orderId) {
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-truck", "text-primary", "fs-5", "ms-2", "cursor-pointer");
  icon.addEventListener("click", () => {
    var orders = StorageManager.LoadSection("orders");
    var order = orders.find(o => o.id === orderId);
    switch (order.status) {
      case "ready":
        order.status = "delivered";
        break;
      default:
        break;
    }
    StorageManager.SaveSection("orders", orders);
    location.reload();
  });
  return icon;
}
function ShowOrderDetails(orderId) {
  const orders = StorageManager.LoadSection("orders") || [];
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    showToast("Order not found!", "warning");
    return;
  }

  const customer = CustomerManager.GetCustomerById(order.userId);
  if (!customer) {
    showToast("Customer not found!", "warning");
    return;
  }

  const productListHtml = order.products.map(p => {
    const productIds = order.products?.map(p => p.id || p.productId).join(", ") || "";
    return `
    <li>
      <strong>Product ID:</strong> ${productIds}  
    </li>
  `;
  }).join("");

  const cardHtml = `
  <div class="shadow-lg p-4">
    <h5 class="card-title">Order Details</h5>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Order Date:</strong> ${order.orderDate}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Payment Method:</strong> ${order.PaymentMethod}</p>
    <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
    <h6>Shipping Address:</h6>
    <p>${order.shippingAddress.street}, ${order.shippingAddress.city},${order.shippingAddress.zip}</p>
    <h6>Products:</h6>
    <ul>
      ${productListHtml}
    </ul>
    <button id="close" class="btn btn-secondary">Close</button>
  </div>
`;
  const contentDiv = document.querySelector("#mainContent");
  contentDiv.innerHTML = cardHtml;
  var closeBtn = document.getElementById("close");
  closeBtn.addEventListener("click", function () {
    ShowOrders();
  })
}

function ShowOrders() {
  DisplayNone();
  CreateOrdersHeader();
  const orders = StorageManager.LoadSection("orders") || [];
  const body = document.querySelector("tbody");
  orders.forEach(order => {
    const productIds = order.products?.map(p => p.id || p.productId).join(", ") || "";
    body.appendChild(CreateOrdersTable(order.id, productIds, order.orderDate, order.totalAmount, order.status));
  });

}

/*------------------------------------------------------------------------------*/

/*- STATS FUNCTIONS
--------------------------------------------------------------------------------*/

function ShowAnalytics() {
  AssignHeader("Analytics");

  var totalProducts = ProductManager.GetProductCounts();
  var totalCustomers = CustomerManager.GetCustomerCounts();
  var totalSellers = SellerManager.GetSellerCounts();
  var carts = StorageManager.LoadSection("cart")
  var totalOrders = StorageManager.LoadSection("orders");
  var revenue = GetAllRevenue(totalOrders);
  const dashboardData = {
    _revenue: revenue,
    _revenueChange: 9.0,
    products: totalProducts,
    customers: totalCustomers,
    sellers: totalSellers,
    orders: totalOrders.length,
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
          </div> 
  
          <div class="row">
            <div class="col-md-6 mb-4">
              <canvas id="expensiveProductsChart"></canvas>
            </div>

            <div class="col-md-6 mb-4">
              <canvas id="salesPerProductChart"></canvas>
            </div>

            <div class="col-md-12 mb-4">
              <canvas id="revenueByCategoryChart"></canvas>
            </div>
          </div>
          `

  animateValue("revenue", dashboardData._revenue);
  animateValue("visitors", dashboardData.visitors);
  animateValue("orders", dashboardData.orders);
  animateValue("products", dashboardData.products);
  animateValue("customers", dashboardData.customers);
  animateValue("sellers", dashboardData.sellers);
  ShowCharts();
}

function ShowCharts() {

  const products = StorageManager.LoadSection("products") || [];
  const orders = StorageManager.LoadSection("orders") || [];

  // ------------------ Expensive Products Chart ------------------
  const topExpensive = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  const expensiveNames = topExpensive.map(p => p.name);
  const expensivePrices = topExpensive.map(p => p.price);

  new Chart(document.getElementById("expensiveProductsChart"), {
    type: 'bar',
    data: {
      labels: expensiveNames,
      datasets: [{
        label: "Top Expensive Products",
        data: expensivePrices,
        backgroundColor: '#ffc107'
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
        easing: 'easeOutBounce'
      },
      plugins: {
        title: {
          display: true,
          text: 'Top Expensive Products',
          font: { size: 18 }
        }
      }
    }
  });

  // ------------------ Sales Per Product Chart ------------------
  const productSalesMap = {};

  for (var i = 0; i < orders.length; i++) {
    for (var j = 0; j < orders[i].products.length; j++) {
      productSalesMap[orders[i].products[j].id] = (productSalesMap[orders[i].products[j].id] || 0) + orders[i].products[j].quantity;
    }
  }
  const productSalesLabels = [];
  const productSalesData = [];

  for (const [id, quantity] of Object.entries(productSalesMap)) {
    const product = products.find(p => p.id == id);
    if (product) {
      productSalesLabels.push(product.name);
      productSalesData.push(quantity);
    }
  }

  new Chart(document.getElementById("salesPerProductChart"), {
    type: 'pie',
    data: {
      labels: productSalesLabels,
      datasets: [{
        label: "Sales",
        data: productSalesData,
        backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1']
      }]
    },
    options: {
      responsive: true,
      animation: {
        animateScale: true,
        animateRotate: true
      },
      plugins: {
        title: {
          display: true,
          text: 'Sales Per Product',
          font: { size: 18 }
        }
      }
    }
  });

  // ------------------ Revenue by Category Chart ------------------
  const categoryRevenue = {};

  products.forEach(product => {
    const totalSales = productSalesMap[product.id] || 0;
    const revenue = totalSales * product.price;

    if (categoryRevenue[product.category]) {
      categoryRevenue[product.category] += revenue;
    } else {
      categoryRevenue[product.category] = revenue;
    }
  });

  const revenueLabels = Object.keys(categoryRevenue);
  const revenueData = Object.values(categoryRevenue);

  new Chart(document.getElementById("revenueByCategoryChart"), {
    type: 'bar',
    data: {
      labels: revenueLabels,
      datasets: [{
        label: "Revenue",
        data: revenueData,
        backgroundColor: '#198754'
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1200,
        easing: 'easeOutElastic'
      },
      plugins: {
        title: {
          display: true,
          text: 'Revenue by Category',
          font: { size: 18 }
        }
      }
    }
  });
}

/*------------------------------------------------------------------------------*/


/*- HELPER FUNCTIONS
-----------------------------------------------------------------------*/
function createTable() {
  const table = `
    <div class="container-fluid px-4 mt-4">
      <div class="row">
        <div class="col-12">


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

function CreateModal(type, ...actions) {
  var modal = `
    <div class="my-4 d-flex justify-content-center">
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#${type}ActionModal" data-action="${actions[0]}">
        ${actions[0]} ${type}
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
              <input type="hidden" id="currentAction" value="${actions[0]}">
              <input type="hidden" id="currentProductId">
              <div class="mb-3">
                <input type="text" id="ProductName" class="form-control rounded" placeholder="Product Name" required 
                   title="Please enter a valid name">
              </div>
  
              <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" id="ProductDescription" required>
              </textarea></div>
              <div class="mb-3"><label class="form-label">Price</label><input type="number" class="form-control" id="ProductPrice" required 
              min="100" max="25000"
              title="Enter a price between 100 and 25000"></div>
              <div class="mb-3"><label class="form-label">Stock</label><input type="number" class="form-control" id="ProductStock" required
              min="0" step="1"
              title="Enter a non-negative integer"
              ></div>
              <div class="mb-3"><label class="form-label">Category</label>
                <select class="form-select" id="ProductCategory" required>
                  <option value="Mobiles" selected>Mobiles</option>
                  <option value="Laptops">Laptops</option>
                  <option value="HeadPhones">HeadPhones</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Accessories">Accessories</option>
              </select>
              </div>
              <div class="mb-3"><label class="form-label">Image</label><input type="file" class="form-control" id="ProductImage" accept="image/*" required></div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="confirmAction">Confirm</button>
          </div>
        </div>
      </div>
    </div>`;
  return modal;
}

// function CreateOrderModal(type, ...actions) {
//   var modal = `

//       <div class="modal fade" id="${type}ActionModal" tabindex="-1" aria-hidden="true">
//       <div class="modal-dialog">
//         <div class="modal-content">
//           <div class="modal-header">
//             <h5 class="modal-title" id="modalTitle">${actions[0]}/${actions[1]} ${type}</h5>
//             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//           </div>

//           <div class="modal-body">
//             <form id="${type}ActionForm">
//               <div class="mb-3">
//                 <label for="${type}Id" class="form-label">Enter ${type} ID</label>
//                 <input type="number" class="form-control" id="${type}Id" required>
//               </div>
//             </form>
//           </div>

//           <div class="modal-footer">
//             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//             <button type="button" class="btn btn-primary" id="confirmAction">Confirm</button>
//           </div>
//         </div>
//       </div>
//     </div>`
//   return modal;
// }

function ClearForm(type) {
  document.getElementById(`${type}Name`).value = "";
  document.getElementById(`${type}Description`).value = "";
  document.getElementById(`${type}Price`).value = "";
  document.getElementById(`${type}Stock`).value = "";
  document.getElementById(`${type}Category`).value = "";
  document.getElementById(`${type}Image`).value = "";
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

function AssignHeader(title) {
  const header = document.getElementById("contentheader");
  header.innerHTML = "";
  const content = document.createElement("h2");
  content.textContent = `${title}`;
  content.className = "fw-bold";
  header.append(content);
}

function GetAllRevenue(orders) {
  var totalRevenue = 0;

  for (var i = 0; i < orders.length; i++) {
    totalRevenue += orders[i].totalAmount;
  }
  return totalRevenue;
}
/*- ON LOADING
-----------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "seller") {
    alert("Unauthorized access. Redirecting...");
    window.location.href = "home.html";
  }
  // Toggle the Sidebar
  const toggleBtn = document.querySelector(".toggle-btn");
  const toggler = document.querySelector("#icon");
  toggleBtn.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("expand");
    toggler.classList.toggle("bxs-chevrons-right");
    toggler.classList.toggle("bxs-chevrons-left");
  });

  // Show the dashboard by default
  ShowAnalytics();
  // Attach event listeners to sidebar buttons
  document.querySelectorAll('[data-section]').forEach(button => {
    button.addEventListener('click', function () {
      const section = this.dataset.section;
      switch (section) {
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
          ShowAnalytics();
          break;
      }
    });
  });
});