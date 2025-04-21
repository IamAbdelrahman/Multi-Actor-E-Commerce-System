// import {StorageManager} from './StorageModule'
// import {UserManager} from './UserModule'

export default function showSection(section) {
  const content = document.getElementById("adminContent");

  switch (section) {
    case "users":
      content.innerHTML = "<h5>User Management</h5><div id='userTable'></div>";
      // Call a function here to load and render user data
      break;

    case "products":
      content.innerHTML = "<h5>Product Management</h5><div id='productTable'></div>";
      break;

    case "orders":
      content.innerHTML = "<h5>Order Management</h5><div id='orderTable'></div>";
      break;
  }
}
