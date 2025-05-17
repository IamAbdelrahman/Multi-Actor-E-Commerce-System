import StorageManager from './StorageModule.js'
import UserManager from './UserModule.js';
import Validate from './ValidationModule.js';
import { showToast } from '../js/toast.js';


/*- SELLER MANAGER
/* -------------------------------------------------------------------------------- */
export default class SellerManager {
  static GetAllSellers() {
    const users = StorageManager.LoadSection("users") || [];
    const sellers = users.filter(user => user.role === "seller");
    return sellers;
  }

  static AddSeller(Name, Email, Password, Phone, address, role = "seller", blocked = false) {
    const sellers = StorageManager.LoadSection("users") || [];
    function NextSellerID() {
      const ids = sellers.map(seller => seller.id);
      return Math.max(...ids) + 1;
    }
    const seller = {
      id: NextSellerID(),
      name: Name,
      email: Email,
      password: Password,
      phone: Phone,
      Address: address,
      role: "seller",
      blocked: false
    };
    if (!Name || !Email || !Password || !address) {
      showToast("Invalid data. Please enter valid data!");
      return false;
    }
    if (!Validate.isNameValid(Name)) {
      showToast("Name must be at least 3 to maximum 15 characters long and contain only letters", "warning");
      return false;
    }
    if (!Validate.isEmailValid(Email)) {
      showToast("Invalid email format. Use example@example.com", "warning");
      return false;
    }
    if (!Validate.isStreetValid(address.street)) {
      showToast("Invalid street format.", "warning");
      return false;
    }
    if (!Validate.isCityValid(address.city)) {
      showToast("City cannot have numbers.", "warning");
      return false;
    }
    if (!Validate.isZipCodeValid(address.zipCode)) {
      showToast("ZIP code must be exactly 5 digits.", "warning");
      return false;
    }
    if (!Validate.isPhoneValid(Phone)) {
      showToast("Invalid phone (expected format: +20XXXXXXXXXX)", "warning");
      return false;

    }

    const existingName = sellers.find(s => s.name === seller.name);
    if (existingName) {
      showToast("Seller name already exists.", "warning");
      return false;
    }

    const existingEmail = sellers.find(s => s.email === seller.email);
    if (existingEmail) {
      showToast("Seller email already exists.", "warning");
      return false;
    }

    const existingPhone = sellers.find(s => s.phone === seller.phone);
    if (existingPhone) {
      showToast("Seller phone already exists.", "warning");
      return false;
    }


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


    // Check if email is already used by another customer
    const emailExists = customers.some(c =>
      c.email.toLowerCase() === email.toLowerCase() && c.id !== id
    );
    if (emailExists) {
      showToast("Email is already registered. Please enter a different email.", "warning");
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
    showToast("Customer updated successfully.", "warning");
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
    var sellers = StorageManager.LoadSection("users") || [];
    sellers = sellers.filter(s => s.role == "seller");
    return sellers.length;
  }
}