import StorageManager from './StorageModule.js'

/*- CUSTOMER MANAGER
/* -------------------------------------------------------------------------------- */
export default class CustomerManager {
  static GetAllCustomers() {
    const users = StorageManager.LoadSection("users") || [];
    let customers = users.filter(user => user.role === "customer");
    return customers;
  }

  static GetCustomerById(id) {
    const customers = CustomerManager.GetAllCustomers();
    return customers.find(customer => customer.id === id);
  }

  static DeleteCustomer(id) {
    let customers = CustomerManager.GetAllCustomers();
    customers = customers.filter(customer => customer.id !== id);
    StorageManager.SaveSection('users', customers);
    return true;
  }

  static BlockCustomer(id) {
    const users = StorageManager.LoadSection("users") || [];
    const updatedUsers = users.map(user => {
      if (user.id === id && user.role === "customer") {
        return { ...user, blocked: true };
      }
      return user;
    });
    StorageManager.SaveSection("users", updatedUsers);
    return true;
  }

  static UnblockCustomer(id) {
    const users = StorageManager.LoadSection("users") || [];
    const updatedUsers = users.map (user => {
      if (user.id === id && user.role === "customer") {
        return {...user, blocked: false};
      }
      return user;
    });
    StorageManager.SaveSection("users", updatedUsers);
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
}