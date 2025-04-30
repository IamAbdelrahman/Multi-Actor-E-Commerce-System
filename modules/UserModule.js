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

    set Address(address) {
    if (Validate.isAddressValid(address)) {
      this.address = address;
    } else {
      console.error("Invalid address.");
      this.address = null;
    }
  }
  get Address() {
    return this.address;
  }
  
  set Phone(phone) {
    if (Validate.isPhoneValid(phone)) {
      this.phone = phone;
    } else {
      console.error("Invalid phone number.");
      this.phone = null;
    }
  }
  get Phone() {
    return this.phone;
  }
}

class UserManager {
static AddUser(name, email, password, address, phone, role, id = 0) {
  const users = StorageManager.LoadSection("users") || [];

  // Trim input values
  name = name.trim();
  email = email.trim();
  password = password.trim();
  phone = phone.trim();
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

  if (!street.trim() || !city.trim() || !zipCode.trim()) {
    alert("Please enter a valid Address: Street, City, and Zip");
    return false;
  }

  if (!phone.trim()) {
    alert("Please enter Phone number");
    return false;
  }

  // Duplicate check
  const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    alert("Email is already registered. Please enter a different email.");
    return false;
  }

  const passwordExists = users.some(user => user.password === password);
  if (passwordExists) {
    alert("Password is already registered. Please enter a different password.");
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

  if (!Validate.isPhoneValid(phone)) {
    alert("Invalid phone number format.");
    return false;
  }

  if (!Validate.isAddressValid(address)) {
    alert("Invalid address format.");
    return false;
  }

  function GenerateNextID() {
    const users = StorageManager.LoadSection("users") || [];
    const ids = users.map(user => user.id);
    return Math.max(...ids) + 1;
  }

  const user = new User(name, email, password, address, phone, role, GenerateNextID());
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


/*- SELLER MANAGER
/* -------------------------------------------------------------------------------- */
class Seller extends User {
  constructor(id, name, email, password, address, phone) {
    super(id, name, email, password, address, phone);
    this.date = (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear();
    this.blocked = false;
    this.role = 'seller';
  }
}
export class SellerManager extends UserManager {
  static GetAllSellers() {
    const users = StorageManager.LoadSection("users") || [];
    return users.filter(user => user.role === "seller");
  }

  static GetById(id) {
    const sellers = Seller.GetAllSellers();
    return sellers.find(seller => seller.id === id);
  }

  static CreateSeller(id, name, email, password, address, phone) {
    const preSeller = Seller.GetAllSellers();
    const _id = preSeller.length > 0 ? preSeller[preSeller.length - 1].id + 1 : 1;
    const seller = new Seller(_id, name, email, password, address, phone);
    preSeller.push(seller);
    StorageManager.SaveSection('users', preSeller);
    return seller;
  }

  static UpdateSeller(seller) {
    let sellers = Seller.GetAllSellers();
    sellers = sellers.map(s => s.id === seller.id ? seller : s);
    StorageManager.SaveSection('users', sellers);
    return seller;
  }

  static DeleteSeller(id) {
    let sellers = Seller.GetAllSellers();
    sellers = sellers.filter(seller => seller.id !== id);
    StorageManager.SaveSection('sellers', sellers);
    return true;
  }

  static BlockSeller(id) {
    const seller = Seller.GetById(id);
    seller.blocked = true;
    Seller.UpdateSeller(seller);
    return true;
  }

  static ActivateSeller(id) {
    const seller = Seller.GetById(id);
    seller.blocked = false;
    Seller.UpdateSeller(seller);
    return true;
  }

  static GetBlockedSeller() {
    const sellers = Seller.GetAllSellers();
    return sellers.filter(seller => seller.blocked);
  }

  static GetActivatedSeller() {
    const sellers = Seller.GetAllSellers();
    return sellers.filter(seller => !seller.blocked);
  }

  static GetSellerCounts() {
    const sellers = Seller.GetAllSellers();
    return sellers.length;
  }
}


