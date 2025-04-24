import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js'
function ShowUsers() {
  const content = document.getElementById("adminContent");
  const userTable = `
      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered table-sm align-middle text-center">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>City</th>
              <th>Phone</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    `;

  const viewUsersBtn = `
      <button id=viewBtn class="btn btn-primary">
        <i class="bi bi-people"></i> View Users
      </button> `;


  const addUserBtn = `
  <button class="btn btn-success">
    <i class="bi bi-person-plus"></i> Add User
  </button> `;


  content.innerHTML = "<h5>User Management</h5>" + viewUsersBtn + addUserBtn + "<hr>" + userTable;
  const usersList = StorageManager.LoadSection("users") || [];
  var body = document.querySelector("tbody");
  for (let i = 0; i < usersList.length; i++) {
    const user = usersList[i];
    body.appendChild(createRow(user.id, user.name, user.email, user.password, user.role, user.city, user.phone));
  }
}

function createRow(id, name, email, password, role, city, phone) {
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

function showProfile() {
  const profileContent = document.getElementById("adminContent");
  const profileInfo = `<div class="profile-card shadow-sm">
          <div class="d-flex justify-content-between">
            <div>
              <h4>Profile</h4>
              <p>
                <span id=adminName>Name:</span> <br>
                <span id=adminRole>Role:</span> <br>
                <span id=adminEmail>Email:</span> <br>
                <span id=adminPhone>Phone:</span> <br>
              </p>
              <div>
                <i class="bi bi-linkedin fs-4 me-3"></i>
                <i class="bi bi-twitter fs-4 me-3"></i>
                <i class="bi bi-facebook fs-4"></i>
              </div>
            </div>
          </div>
        </div>`
  profileContent.innerHTML = profileInfo;
  const adminName = document.getElementById("adminName");
  const adminRole = document.getElementById("adminRole");
  const adminEmail = document.getElementById("adminEmail");
  const adminPhone = document.getElementById("adminPhone");
  const admin = StorageManager.LoadSection("admin");
  if (admin) {
    adminName.innerText = "Name: " + admin.name;
    adminRole.innerText = "Role: " + admin.role;
    adminEmail.innerText = "Email: " + admin.email;
    adminPhone.innerText = "Phone: " + admin.phone;
  } else {
    alert("Admin data not found.");
  }
  const Btns = document.createElement("div");
  Btns.classList.add("d-flex", "justify-content-between", "mt-3");
  profileContent.appendChild(Btns);
  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit Profile";
  editBtn.classList.add("btn", "btn-primary");
  editBtn.addEventListener("click", function () {
    const newName = prompt("Enter new name:", adminName.innerText);
    const newRole = prompt("Enter new role:", adminRole.innerText);
    const newEmail = prompt("Enter new email:", adminEmail.innerText);
    const newPhone = prompt("Enter new phone:", adminPhone.innerText);
    if (newName && newRole && newEmail && newPhone) {
      StorageManager.SaveSection("admin", { name: newName, role: newRole, email: newEmail, phone: newPhone });
      showProfile();
    }
  });
  Btns.appendChild(editBtn);
  const changePassBtn = document.createElement("button");
  changePassBtn.innerText = "Change Password";
  changePassBtn.classList.add("btn", "btn-danger");
  changePassBtn.addEventListener("click", function () {
    const newPass = prompt("Enter new password:");
    if (newPass) {
      StorageManager.SaveSection("admin", { password: newPass });
      alert("Password changed successfully.");
    }
  });
  Btns.appendChild(changePassBtn);
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete Account";
  deleteBtn.classList.add("btn", "btn-warning");
  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete your account?")) {
      StorageManager.Remove("admin");
      alert("Account deleted successfully.");
      window.location.reload();
    }
  });
  Btns.appendChild(deleteBtn);
  const logoutBtn = document.createElement("button");
  logoutBtn.innerText = "Logout";
  logoutBtn.classList.add("btn", "btn-secondary");
  logoutBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "./login.html";
    }
  });
  Btns.appendChild(logoutBtn);
}
window.addEventListener('load', () => {
  const profile = document.getElementById("profile");
  profile.addEventListener('click', () => showProfile());
  // const products = document.getElementById("products");
  // products.addEventListener('click', () => showSection("products"));
  // const orders = document.getElementById("orders");
  // orders.addEventListener('click', () => showSection("orders"));
  // const categories = document.getElementById("categories");
  // categories.addEventListener('click', () => showSection("categories"));
  const accounts = document.getElementById("accounts");
  accounts.addEventListener('click', () => ShowUsers());
  // Add other event listeners here
});

// Delete user - View users - Reset password  - view products - add product - delete product - view orders - delete order 
// if user cancel the orders - contacts us > submit to be display -  
// Analytics : Most popular product - most sold product - most viewed product - most added to cart - most ordered product -
// Most sold product - Most viewed product - Most ordered prduct - 

// Seller Dashbord: 
