import StorageManager from './StorageModule.js'

class User {
  constructor(id, name, email, password, role) {
    this.ID = id;
    this.Name = name;
    this.Email = email;
    this.Pass = password;
    this.Role = role;

  }
  //////////////////////
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

  set Name(name) {
    if (User.validateName(name)) {
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
    if (User.validateEmail(email)) {
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
    if (User.validatePass(password)) {
      this.password = password.trim();
    } else {
      alert("Password must be at least 8 characters long and contain uppercase or lowercase, a number, and a special character");
      return false;

    }
  }

  get Pass() {
    return this.password;
  }

  set Role(role) {
    if (role === "customer" || role === "seller") {
      this.role = role;
    } else {
      console.error("Invalid role: must be 'customer' or 'seller'.");
      this.role = null;
    }
  }

  get Role() {
    return this.role;
  }



  static validateName(name) {

    return /^[A-Za-z\s]{3,15}$/.test(name);
  }
  static validateEmail(email) {
    return /^[a-zA-Z]+[0-9]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(email);
  }
  static validatePass(password) {
    let passPattern = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return passPattern.test(password);
  }
}


export default class UserManager {
  static CreateUser(id, name, email, password, role) {
    const user = new User(id, name, email, password, role);
    if (name == "" && password == "" && email == "") {
      alert("Please Enter Name , Email , Password");
      return false;
    }

    else {
      alert("Successfully Registeration!");

    }
    const users = StorageManager.LoadSection("users") || [];
    users.push(user);
    StorageManager.SaveSection("users", users);
  }

  static GetUser(id) {
    const users = StorageManager.LoadSection("users") || [];
    return users.find(user => user.id === id);
  }

  //Newwwwwwwwwww For Make ID for each user
  static GenerateNextID() {
    const users = StorageManager.LoadSection("users") || [];
    if (users.length === 0) return 1;

    const ids = users.map(user => user.id);
    return Math.max(...ids) + 1;
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

