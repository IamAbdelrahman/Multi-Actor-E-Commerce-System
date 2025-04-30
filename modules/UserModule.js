import StorageManager from './StorageModule.js'
import Validate from './ValidationModule.js';

class User {
  constructor(name, email, password, address, phone, role, id) {
    this.ID = id;
    this.Name = name;
    this.Email = email;
    this.Pass = password;
    this.Role = role;
    this.Address = address;
    this.Phone = phone;
  }

  set Name(name) {
    if (Validate.isNameValid(name)) {
      this.name = name.trim();
    } else {
      alert("Name must be at least 3 to maximum 15 characters long and contain only letters");
      return false;
    }
  }
  get Name() {
    return this.name;
  }

  set Email(email) {
    if (Validate.isEmailValid(email)) {
      this.email = email.toLowerCase();
    } else {
      alert("Please enter a valid email address like that example@gmail.com");
      return false;

    }
  }
  get Email() {
    return this.email;
  }

  set Pass(password) {
    if (Validate.isPasswordValid(password)) {
      this.password = password.trim();
    } else {
      alert("Password must be at least 8 characters long and contain uppercase or lowercase, a number, and a special character");
      return false;

    }
  }
  get Pass() {
    return this.password;
  }

}

export default class UserManager {
static AddUser(name, email, password, address = {}, phone = "", role = "customer", id = 0) {
  const users = StorageManager.LoadSection("users") || [];

  // Trim input values
  name = name.trim();
  email = email.trim();
  password = password.trim();
  const { street = "", city = "", zipCode = "" } = address || {};

  // Input empty checks
  if (!name) {
    alert("Please enter a name");
    return false;
  }

  if (!email) {
    alert("Please enter an email");
    return false;
  }

  if (!password) {
    alert("Please enter a password");
    return false;
  }

  // Duplicate check
  const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    alert("Email is already registered. Please enter a different email.");
    return false;
  }
  // Validation using Validate module
  if (!Validate.isNameValid(name)) {
    alert("Invalid name. It must be 3–15 letters only.");
    return false;
  }

  if (!Validate.isEmailValid(email)) {
    alert("Invalid email format. Use example@example.com");
    return false;
  }

  if (!Validate.isPasswordValid(password)) {
    alert("Invalid password. It must include uppercase/lowercase, a number, and a special character, with at least 8 characters.");
    return false;
  }

  function GenerateNextID() {
    const users = StorageManager.LoadSection("users") || [];
    const ids = users.map(user => user.id);
    return Math.max(...ids) + 1;
  }

  const user = new User(name, email, password, GenerateNextID());
  users.push(user);
  StorageManager.SaveSection("users", users);
  alert("Successfully Registered!");
  return true;
}

  static GetUserById(id) {
    const users = StorageManager.LoadSection("users") || [];
    return users.find(user => user.id === id);
  }

  static UpdateUser(id, name, email) {
    var users = StorageManager.LoadSection("users") || [];
    users = users.map(user => user.id === id ? new User(id, name, email) : user);
    StorageManager.SaveSection("users", users);
  }

  static DeleteUser(id) {
    var users = StorageManager.LoadSection("users") || [];
    users = users.filter(user => user.id !== id);
    StorageManager.SaveSection("users", users);
  }
}