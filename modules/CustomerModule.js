import StorageManager from './StorageModule.js'
import UserManager from './UserModule.js';  

/*- CUSTOMER MANAGER
/* -------------------------------------------------------------------------------- */
class Customer {
  constructor(id, name, email, password, role = "customer", address = { street: "", city: "", zipCode: "" }, phone = "", blocked = false) {
    this.ID = id;
    this.Name = name;
    this.Email = email;
    this.Pass = password;
    this.Role = role;
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
    let customers = users.filter(user => user.role === "customer");
    return customers;
  }

  static GetCustomerById(id) {
    const customers = CustomerManager.GetAllCustomers();
    return customers.find(customer => customer.id === id);
  }
  static AddCustomer (customer) {
    CustomerManager.AddUser(customer.name, customer.email, customer.password);
  }

  static UpdateCustomer(updatedCustomer) {
    let customers = CustomerManager.GetAllCustomers();
  
    const id = updatedCustomer.id;
    const name = updatedCustomer.name;
    const email = updatedCustomer.email;
    const phone = updatedCustomer.phone;
    const address = updatedCustomer.Address || {};
    const password = updatedCustomer.password;  
    // Validate input
    const isValid = CustomerManager.DoValidation(name, email, password. address);
    if (!isValid) return false;
  
    // Check if email is already used by another customer
    const emailExists = customers.some(c =>
      c.email.toLowerCase() === email.toLowerCase() && c.id !== id
    );
    if (emailExists) {
      alert("Email is already registered. Please enter a different email.");
      return false;
    }
  
    // Update the matched customer
    customers = customers.map(c => {
      if (c.id === id) {
        c.name = name;
        c.email = email;
        c.Address = { city, street, zipCode };
        c.phone = phone;
      }
      return c;
    });
  
    StorageManager.SaveSection("users", customers);
    alert("Customer updated successfully.");
    return true;
  }

  static DeleteCustomer(id) {
    let customers = CustomerManager.GetAllCustomers();
    customers = customers.filter(customer => customer.id !== id);
    StorageManager.SaveSection('users', customers);
    return true;
  }

  static BlockCustomer(id) {
    const customer = CustomerManager.GetById(id);
    customer.blocked = true;
    Customer.UpdateCustomer(customer);
    return true;
  }

  static UnblockCustomer(id) {
    const customer = CustomerManager.GetById(id);
    customer.blocked = false;
    Customer.UpdateCustomer(customer);
    return true;
  }

  static GetBlockedCustomer() {
    const customers = CustomerManager.GetAllCustomers();
    return customers.filter(customer => customer.blocked);
  }

  static GetUnblockedCustomer() {
    const customers = CustomerManager.GetAllCustomers();
    return customers.filter(customer => !customer.blocked);
  }

  static GetCustomerCounts() {
    const customers = CustomerManager.GetAllCustomers();
    return customers.length;
  }

  static DoValidation(name, email, password, address) {
    // Validation using Validate module
    if (!Validate.isNameValid(name)) {
      alert("Invalid name. It must be 3–15 letters only.");
      return false;
    }
    if (!Validate.isPasswordValid(password)) {
      alert("Invalid password. It must include uppercase/lowercase, a number, and a special character, with at least 8 characters.");
      return false;
    }
    if (!Validate.isEmailValid(email)) {
      alert("Invalid email format. Use example@example.com");
      return false;
    }

    if (!Validate.isAddressValid(address)) {
      return false;
    }
    return true;
    
  }
}