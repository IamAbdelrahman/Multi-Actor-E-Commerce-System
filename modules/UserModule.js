import StorageManager from './StorageModule.js'
import Validate from './ValidationModule.js';

/*- USER MANAGER
/* -------------------------------------------------------------------------------- */
class User {
  constructor(id, name, email, password, role, address, phone) {
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
  // set Image(image) {
  //   if (Validate.isImageValid(image)) {
  //     this.image = image;
  //   } else {
  //     console.error("Invalid image URL.");
  //     this.image = null;
  //   }
  // }
  // get Image() {
  //   return this.image;
  // }
}


export default class UserManager {
  static CreateUser(id, name, email, password, role, address, phone) {
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
      return false;
    }
    else if (role.trim() === "") {
      alert("Please Enter Role");
      return false;
    }
    else if (address.city.trim() === "" || address.street.trim() === "" || address.zip.trim() === "") {
      alert("Please Enter a Valid Address");
      return false;
    }
    else if (phone.trim() === "") {
      alert("Please Enter Phone");
      return false;
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
    const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
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


  static GenerateNextID() {
    const users = StorageManager.LoadSection("users") || [];
    const ids = users.map(user => user.id);
    return Math.max(...ids) + 1;
  }


  static UpdateUser(id, name, email, password, role, address, phone) {
    var users = StorageManager.LoadSection("users") || [];
    users = users.map(user => user.id === id ? new User(id, name, email, password, role, address, phone) : user);
    StorageManager.SaveSection("users", users);
  }

  static DeleteUser(id) {
    var users = StorageManager.LoadSection("users") || [];
    users = users.filter(user => user.id !== id);
    StorageManager.SaveSection("users", users);
  }
}

/*- CUSTOMER MANAGER
/* -------------------------------------------------------------------------------- */
class Customer extends User {
  constructor(id, name, email, password, address, phone) {
    super(id, name, email, password, address, phone);
    this.date = (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear();
    this.blocked = false;
    this.role = 'customer';
  }
}
export class CustomerManager extends UserManager {
  static GetAllCustomers() {
    const users = StorageManager.LoadSection("users") || [];
    return users.filter(user => user.role === "customer");
  }
  static GetById(id) {
    const customers = Customer.GetAllCustomers();
    return customers.find(customer => customer.id === id);
  }
  static CreateCustomer(id, name, email, password, address, phone) {
    const preCustomer = Customer.GetAllCustomers();
    const id = preCustomer.length > 0 ? preCustomer[preCustomer.length - 1].id + 1 : 1;
    const customer = new Customer(id, name, email, password, address, phone);
    preCustomer.push(customer);
    StorageManager.SaveSection('users', preCustomer);
    return customer;
  }

  static UpdateCustomer(customer) {
    let customers = Customer.GetAllCustomers();
    customers = customers.map(c => c.id === customer.id ? customer : c);
    StorageManager.SaveSection('users', customers);
    return customer;
  }

  static DeleteCustomer(id) {
    let customers = Customer.GetAllCustomers();
    customers = customers.filter(customer => customer.id !== id);
    StorageManager.SaveSection('customers', customers);
    return true;
  }

  static BlockCustomer(id) {
    const customer = Customer.GetById(id);
    customer.blocked = true;
    Customer.UpdateCustomer(customer);
    return true;
  }

  static UnblockCustomer(id) {
    const customer = Customer.GetById(id);
    customer.blocked = false;
    Customer.UpdateCustomer(customer);
    return true;
  }

  static GetBlockedCustomer() {
    const customers = Customer.GetAllCustomers();
    return customers.filter(customer => customer.blocked);
  }

  static GetUnblockedCustomer() {
    const customers = Customer.GetAllCustomers();
    return customers.filter(customer => !customer.blocked);
  }

  static GetCustomerCounts() {
    const customers = Customer.GetAllCustomers();
    return customers.length;
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
    const id = preSeller.length > 0 ? preSeller[preSeller.length - 1].id + 1 : 1;
    const seller = new Seller(id, name, email, password, address, phone);
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