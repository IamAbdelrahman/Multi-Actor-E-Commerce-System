import StorageManager from './StorageModule.js'
import UserManager from './UserModule.js';

/*- SELLER MANAGER
/* -------------------------------------------------------------------------------- */
class Seller {
  constructor(name, email, password, address, phone, role = "seller", id = 0) {
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

export default class SellerManager extends UserManager {

  static GetAllSellers() {
    const users = StorageManager.LoadSection("users") || [];
    const sellers = users.filter(user => user.role === "seller");
    if (sellers)
    {
      sellers.forEach(seller => {
        seller.blocked = seller.blocked || false;
      });
      StorageManager.SaveSection('users', sellers);
    }
  }

  static AddSeller(name, email, password, address, phone, role = "seller", id = 0) {
    const sellers = StorageManager.LoadSection("sellers") || [];
    function NextSellerID() {
      const ids = sellers.map(seller => seller.id);
      return Math.max(...ids) + 1;
    }
    const seller = new Seller(name, email, password, address, phone, NextSellerID());
    sellers.push(seller);
    StorageManager.SaveSection('sellers', sellers);
    return seller;
  }

  static GetSellerById(id) {
    const sellers = StorageManager.LoadSection("sellers") || [];
    return sellers.find(seller => seller.id === id);
  }


  static UpdateSeller(seller) {
    const sellers = StorageManager.LoadSection("sellers") || [];
    sellers = sellers.map(s => s.id === seller.id ? seller : s);
    StorageManager.SaveSection('users', sellers);
    return seller;
  }

  static DeleteSeller(id) {
    const sellers = StorageManager.LoadSection("sellers") || [];
    sellers = sellers.filter(seller => seller.id !== id);
    StorageManager.SaveSection('sellers', sellers);
    return true;
  }

  static UpdateSeller(seller) {
    const sellers = StorageManager.LoadSection("sellers") || [];
    sellers = sellers.map(s => s.id === seller.id ? seller : s);
    StorageManager.SaveSection('sellers', sellers);
    return seller;
  }

  static BlockSeller(id) {
    const seller = SellerManager.GetById(id);
    seller.blocked = true;
    SellerManager.UpdateSeller(seller);
    return true;
  }

  static ActivateSeller(id) {
    const seller = SellerManager.GetById(id);
    seller.blocked = false;
    SellerManager.UpdateSeller(seller);
    return true;
  }

  static GetBlockedSeller() {
    const sellers = StorageManager.LoadSection("sellers") || [];
    return sellers.filter(seller => seller.blocked);
  }

  static GetActivatedSeller() {
    const sellers = StorageManager.LoadSection("sellers") || [];
    return sellers.filter(seller => !seller.blocked);
  }

  static GetSellerCounts() {
    const sellers = StorageManager.LoadSection("sellers") || [];
    return sellers.length;
  }
}