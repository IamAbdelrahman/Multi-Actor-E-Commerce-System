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

/*- Manage Users
-----------------------------------------------------------------------*/
function ShowUsers() {
  const usersList = StorageManager.LoadSection("users") || [];
  var body = document.querySelector("tbody");
  for (let i = 0; i < usersList.length; i++) {
    const user = usersList[i];
    body.appendChild(createRow(user.id, user.name, user.email, user.password, user.role, user.city, user.phone));
  }
}


// function showProfile() {
//   const profileContent = document.getElementById("adminContent");
//   const profileInfo = `<div class="profile-card shadow-sm">
//           <div class="d-flex justify-content-between">
//             <div>
//               <h4>Profile</h4>
//               <p>
//                 <span id=adminName>Name:</span> <br>
//                 <span id=adminRole>Role:</span> <br>
//                 <span id=adminEmail>Email:</span> <br>
//                 <span id=adminPhone>Phone:</span> <br>
//               </p>
//               <div>
//                 <i class="bi bi-linkedin fs-4 me-3"></i>
//                 <i class="bi bi-twitter fs-4 me-3"></i>
//                 <i class="bi bi-facebook fs-4"></i>
//               </div>
//             </div>
//           </div>
//         </div>`
//   profileContent.innerHTML = profileInfo;
//   const adminName = document.getElementById("adminName");
//   const adminRole = document.getElementById("adminRole");
//   const adminEmail = document.getElementById("adminEmail");
//   const adminPhone = document.getElementById("adminPhone");
//   const admin = StorageManager.LoadSection("admin");
//   if (admin) {
//     adminName.innerText =  admin.name;
//     adminRole.innerText = admin.role;
//     adminEmail.innerText = admin.email;
//     adminPhone.innerText = admin.phone;
//   } else {
//     alert("Admin data not found.");
//   }
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
//   Btns.appendChild(editBtn);
//   const changePassBtn = document.createElement("button");
//   changePassBtn.innerText = "Change Password";
//   changePassBtn.classList.add("btn", "btn-danger");
//   changePassBtn.addEventListener("click", function () {
//     const newPass = prompt("Enter new password:");
//     if (newPass) {
//       StorageManager.SaveSection("admin", { password: newPass });
//       alert("Password changed successfully.");
//     }
//   });
//   Btns.appendChild(changePassBtn);
//   const deleteBtn = document.createElement("button");
//   deleteBtn.innerText = "Delete Account";
//   deleteBtn.classList.add("btn", "btn-warning");
//   deleteBtn.addEventListener("click", function () {
//     if (confirm("Are you sure you want to delete your account?")) {
//       StorageManager.Remove("admin");
//       alert("Account deleted successfully.");
//       window.location.reload();
//     }
//   });
//   Btns.appendChild(deleteBtn);
//   const logoutBtn = document.createElement("button");
//   logoutBtn.innerText = "Logout";
//   logoutBtn.classList.add("btn", "btn-secondary");
//   logoutBtn.addEventListener("click", function () {
//     if (confirm("Are you sure you want to logout?")) {
//       window.location.href = "./login.html";
//     }
//   });
//   Btns.appendChild(logoutBtn);
// }

/*- HELPER FUNCTIONS
-----------------------------------------------------------------------*/
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

document.addEventListener('DOMContentLoaded', function() {
  ShowUsers();
  const toggleBtn = document.querySelector(".toggle-btn");
  const toggler = document.querySelector("#icon");
  toggleBtn.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
  toggler.classList.toggle("bxs-chevrons-right");
  toggler.classList.toggle("bxs-chevrons-left");
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
