import {StorageManager} from './StorageModule.js'

class User {
  constructor(id, name, email) {
    this.ID = id;
    this.Name = name;
    this.Email = email;
  }

  set ID(id) {
    if (typeof id === 'number' && id > 0) {
      this.id = id;
    } else {
      console.error("Invalid ID: must be a positive number.");
      this.id = 0;
    }
  }

  get ID() {
    return this.id;
  }

  set Name(value) {
    if (User.isNameValid(value)) {
      this.name = value.trim();
    } else {
      console.error("Invalid name: must be a string with at least 3 characters.");
      this.name = null;
    }
  }

  get Name() {
    return this.name;
  }

  set Email(value) {
    if (User.isEmailValid(value)) {
      this.email = value.toLowerCase();
    } else {
      console.error("Invalid email format.");
      this.email = null;
    }
  }

  get Email() {
    return this.email;
  }

  static isNameValid(value) {
    return value.match(/^[a-zA-Z]{3,9}$/);
  }

  static isEmailValid(value) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return value.match(emailPattern);
  }
}


export class UserManager {
  static CreateUser(id, name, email) {
    const user = new User(id, name, email);
    if (user.name == null || user.email == null || user.id == 0) {
      console.error("Please, re-enter a valid data!");
      return ;
    }
    const users = StorageManager.LoadSection("users") || [];
    users.push(user);
    StorageManager.SaveSection("users", users);
  }
  
  static GetUser(id) {
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