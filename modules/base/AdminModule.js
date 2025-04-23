import StorageManager from './StorageModule.js'
import {UserManager} from './UserModule.js'
var ID = 0;
export default function showSection(section) {
  const content = document.getElementById("adminContent");
  switch (section) {
    case "users":
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
        ID = i + 1;
        body.appendChild(createRow(user.id, user.name, user.email, user.password, user.role));
      }
      
      break;

    case "products":
      content.innerHTML = "<h5>Product Management</h5><div id='productTable'></div>";
      break;

    case "orders":
      content.innerHTML = "<h5>Order Management</h5><div id='orderTable'></div>";
      break;
  }
}

function createRow(id, name, email, password, role) {
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
  icon.addEventListener("click", function(){
    var tr = this.parentElement.parentElement;
    (confirm("Do you want to delete this user?")) ? tr.remove() : "undefined";
    UserManager.DeleteUser(id);
  });
  return icon;
}
// function deleteRow(id) {
//   var tr = this.parentElement.parentElement;
//   (confirm("Do you want to delete this user?")) ? tr.remove() : "undefined";
//   UserManager.DeleteUser(id);
//   return;
// }