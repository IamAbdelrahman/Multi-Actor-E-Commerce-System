import StorageManager from './StorageModule.js'
import Validate from './ValidationModule.js';

class User {
  constructor(id, name, email, password, role) {
    this.ID = id;
    this.Name = name;
    this.Email = email;
    this.Pass = password;
    this.Role = role;

  }

  set ID(id) {
    if (Validate.isUserIdValid(id)) {
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

  set Role(role) {
    if (Validate.isRoleValid(role)) {
      this.role = role.toLowerCase();
    } else {
      console.error("Invalid role: must be 'customer' or 'seller'.");
      this.role = null;
    }
  }

  get Role() {
    return this.role;
  }




}


export default class UserManager {
  static CreateUser(id, name, email, password, role) {
    //I make here to check empty because user may froget to enter 
    if (name.trim() === "" && password.trim() === "" && email.trim() === "") {
      alert("Please Enter Name , Email , Password");
      return false;
    }
    else if (name.trim() == "") {
      alert("Please Enter Name");
      return false;
    }
    else if (email.trim() === "") {
      alert("Please Enter Email");
      return false;
    }
    else if (password.trim() === "") {
      alert("Please Enter Password");
      return false;
    }
    else if (name.trim() === "" || password.trim() === "" || email.trim() === "") {
      alert("Please enter name , email , password");
    }

    const users = StorageManager.LoadSection("users") || [];

    //Here i make to prevent duplicate email or password
    const userEnterEmail = users.some(user => user.email.toLowerCase() === email.toLowerCase());
    if (userEnterEmail) {
      alert("Email is already registered. Please enter a different email.");
      return false;
    }
    const userEnterPass = users.some(user => user.password === password.trim());
    if (userEnterPass) {
      alert("Password is already registered. Please enter a different password.");
      return false;
    }

    const user = new User(id, name, email, password, role);

    //After check empty i make to check validation 
    if (!user.Name || !user.Email || !user.Pass || !user.Role) {
      alert("Registration failed. Please ensure all fields are valid.");
      return false;
    }
    //She will storage if all correct
    users.push(user);
    StorageManager.SaveSection("users", users);
    alert("Successfully Registered!");
    return true;

  }

  static GetUser(id) {
    const users = StorageManager.LoadSection("users") || [];
    return users.find(user => user.id === id);
  }

  //Newwwwwwwwwww For Make ID for each user
  static GenerateNextID() {
    const users = StorageManager.LoadSection("users") || [];
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

