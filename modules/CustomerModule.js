import StorageManager from './StorageModule.js'
import UserManager from './UserModule.js';  

/*- CUSTOMER MANAGER
/* -------------------------------------------------------------------------------- */
class Customer {
  constructor(name, email, password, address, phone, role = "customer", id = 0) {
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

export default class CustomerManager extends UserManager {
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
    const _id = preCustomer.length > 0 ? preCustomer[preCustomer.length - 1].id + 1 : 1;
    const customer = new Customer(_id, name, email, password, address, phone);
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