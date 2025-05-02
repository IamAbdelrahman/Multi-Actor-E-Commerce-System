import StorageManager from './StorageModule.js'
import UserManager from './UserModule.js';

/*- SELLER MANAGER
/* -------------------------------------------------------------------------------- */
export default class SellerManager {
  static GetAllSellers() {
    const users = StorageManager.LoadSection("users") || [];
    const sellers = users.filter(user => user.role === "seller");
    return sellers;
  }

  static AddSeller(name, email, password, phone, address, id = 1, role = "seller", blocked = false) {
    const sellers = StorageManager.LoadSection("users") || [];
    function NextSellerID() {
      const ids = sellers.map(seller => seller.id);
      return Math.max(...ids) + 1;
    }
    const seller = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      Address: address,
      id: NextSellerID(),
      role : "seller",
      blocked : false
    };
    sellers.push(seller);
    StorageManager.SaveSection('users', sellers);
    return seller;
  }

  static GetSellerById(id) {
    const sellers = StorageManager.LoadSection("users") || [];
    return sellers.find(seller => seller.id === id);
  }

  static DeleteSeller(id) {
    const sellers = StorageManager.LoadSection("users") || [];
    sellers = sellers.filter(seller => seller.id !== id);
    StorageManager.SaveSection('users', sellers);
    return true;
  }

  static UpdateSeller(updatedSeller) {
    let sellers = CustomerManager.GetAllSellers();
  
    const id = updatedSeller.id;
    const name = updatedSeller.name;
    const email = updatedSeller.email;
    const phone = updatedSeller.phone;
    const address = updatedSeller.Address || {};
    const { city, street, zipCode } = address;
  
    // Validate input
    const isValid = CustomerManager.DoValidation(name, email, street, city, zipCode);
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
    sellers = sellers.map(s => {
      if (s.id === id) {
        s.name = name;
        s.email = email;
        s.Address = { city, street, zipCode };
        s.phone = phone;
      }
      return c;
    });
  
    StorageManager.SaveSection("users", sellers);
    alert("Customer updated successfully.");
    return true;
  }

  static BlockSeller(id) {
    const users = StorageManager.LoadSection("users") || [];
    const updatedUsers = users.map(user => {
      if (user.id === id && user.role === "seller") {
        return { ...user, blocked: true };
      }
      return user;
    });
    StorageManager.SaveSection("users", updatedUsers);
    return true;
  }

  static UnblockSeller(id) {
    const users = StorageManager.LoadSection("users") || [];
    const updatedUsers = users.map(user => {
      if (user.id === id && user.role === "seller") {
        return { ...user, blocked: false };
      }
      return user;
    });
    StorageManager.SaveSection("users", updatedUsers);
    return true;
  }

  static GetBlockedSeller() {
    const sellers = StorageManager.LoadSection("users") || [];
    return sellers.filter(seller => seller.blocked);
  }

  static GetActivatedSeller() {
    const sellers = StorageManager.LoadSection("users") || [];
    return sellers.filter(seller => !seller.blocked);
  }

  static GetSellerCounts() {
    const sellers = StorageManager.LoadSection("users") || [];
    return sellers.length;
  }
}