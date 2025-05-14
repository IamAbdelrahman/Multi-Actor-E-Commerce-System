import StorageManager from './StorageModule.js'
import Validate from './ValidationModule.js';

class User {
  constructor(id, name, email, password, role, blocked, address = { street: "", city: "", zipCode: "" }, phone = "") {
    this.ID = id;
    this.Name = name;
    this.Email = email;
    this.Pass = password;
    this.Role = role;
    this.blocked = blocked;
    this.Address = address;
    this.phone = phone;
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
  static AddUser(name, email, password, role = "customer", blocked = false) {
    const users = StorageManager.LoadSection("users") || [];

    // Trim input values
    name = name.trim();
    email = email.trim();
    password = password.trim();

    // Input empty checks
    if (!name && !password && !email) {
      alert("Please fill in all fields");
      return false;
    }
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

    //Newwwwwwwwwww For Make ID for each user
    function GenerateNextID() {
      const users = StorageManager.LoadSection("users") || [];
      const ids = users.map(user => user.id);
      return Math.max(...ids) + 1;
    }


    const user = new User(GenerateNextID(), name, email, password, role, blocked);
    users.push(user);
    StorageManager.SaveSection("users", users);
    // alert("Successfully Registered!");
    document.getElementById("signUpForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    return true;
  }

  static GetUserById(id) {
    const users = StorageManager.LoadSection("users") || [];
    return users.find(user => user.id === id);
  }

  static UpdateUser(id, name, email, street, city, zipCode, phone) {
    let users = StorageManager.LoadSection("users") || [];
    const address = { street, city, zipCode };

    // Validation using Validate module
    if (!Validate.isNameValid(name)) {
      alert("Invalid name. It must be 3–15 letters only.");
      return false;
    }
    const emailExists = users.some(user =>
      user.email.toLowerCase() === email.toLowerCase() && user.id !== id
    );
    if (emailExists) {
      alert("Email is already registered. Please enter a different email.");
      return false;
    }
    if (!Validate.isEmailValid(email)) {
      alert("Invalid email format. Use example@example.com");
      return false;
    }
    if (!Validate.isStreetValid(street)) {
      alert("Street cannot be empty.");
      return false;
    }
    if (!Validate.isCityValid(city)) {
      alert("City cannot have numbers.");
      return false;
    }
    if (!Validate.isZipCodeValid(zipCode)) {
      alert("ZIP code must be exactly 5 digits.");
      return false;
    }
    if (!Validate.isPhoneValid(phone)) {
      alert("Invalid phone (expected format: +20XXXXXXXXXX)");
      return false;
    }
    users = users.map(user => {
      if (user.id === id) {
        user.name = name;
        user.email = email;
        user.Address = address;
        user.phone = phone;
      }
      return user;
    });

    StorageManager.SaveSection("users", users);
    return true;
  }



  static DeleteUser(id) {
    var users = StorageManager.LoadSection("users") || [];
    users = users.filter(user => user.id !== id);
    StorageManager.SaveSection("users", users);
  }

  static GetUsersCount() {
    const users = StorageManager.LoadSection("users") || [];
    return users.length;
  }
}