import StorageManager from './StorageModule.js';
import Validate from './ValidateModule.js'; 

class User {
  constructor(id, name, email, password, role) {
    this.ID = id;
    this.Name = name;
    this.Email = email;
    this.Pass = password;
    this.Role = role;
  }

  set ID(id) {
    this.id = typeof id === 'number' && id > 0 ? id : 0;
  }

  get ID() {
    return this.id;
  }

  set Name(name) {
    if (Validate.isNameValid(name)) {
      this.name = name.trim();
    } else {
      alert("Name must be 3–30 characters long and contain only letters or spaces.");
    }
  }

  get Name() {
    return this.name;
  }

  set Email(email) {
    if (Validate.isEmailValid(email)) {
      this.email = email.toLowerCase();
    } else {
      alert("Please enter a valid email address (example@gmail.com).");
    }
  }

  get Email() {
    return this.email;
  }

  set Pass(password) {
    if (Validate.isPasswordValid(password)) {
      this.password = password.trim();
    } else {
      alert("Password must be at least 6 characters and include a number and special character.");
    }
  }

  get Pass() {
    return this.password;
  }

  set Role(role) {
    if (Validate.isRoleValid(role)) {
      this.role = role;
    } else {
      alert("Invalid role: must be 'customer', 'seller', or 'admin'.");
      this.role = null;
    }
  }

  get Role() {
    return this.role;
  }
}

export class UserManager {
  static CreateUser(id, name, email, password, role) {
    if (!name || !email || !password) {
      alert("Please enter Name, Email, and Password.");
      return false;
    }

    const user = new User(id, name, email, password, role);

    const users = StorageManager.LoadSection("users") || [];
    users.push(user);
    StorageManager.SaveSection("users", users);

    alert("Successfully registered!");
    return true;
  }

  static GetUser(id) {
    const users = StorageManager.LoadSection("users") || [];
    return users.find(user => user.id === id);
  }

  static GenerateNextID() {
    const users = StorageManager.LoadSection("users") || [];
    return users.length === 0 ? 1 : Math.max(...users.map(user => user.id)) + 1;
  }

  static UpdateUser(id, name, email) {
    let users = StorageManager.LoadSection("users") || [];
    users = users.map(user =>
      user.id === id ? new User(id, name, email, user.password, user.role) : user
    );
    StorageManager.SaveSection("users", users);
  }

  static DeleteUser(id) {
    let users = StorageManager.LoadSection("users") || [];
    users = users.filter(user => user.id !== id);
    StorageManager.SaveSection("users", users);
  }
}
