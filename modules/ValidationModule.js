// validation
export default class Validate {
  static isNameValid(value) {
    return typeof value === 'string' && /^[A-Za-z\s]{3,15}$/.test(value);
  }

  static isEmailValid(value) {

    const emailPattern = /^[a-zA-Z]+[0-9]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    return typeof value === 'string' && emailPattern.test(value);
  }

  static isPasswordValid(value) {
    let passPattern = /^(?=.*[_()!@#$%^&*])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return typeof value === 'string' && passPattern.test(value);
  }

  static isRoleValid(value) {
    const validRoles = ["seller", "customer"];
    return validRoles.includes(value.toLowerCase());
  }

  static isPhoneValid(value) {
    return typeof value === 'string' && /^\+20\d{10}$/.test(value); // Egypt format
  }

  static isAddressValid(address) {
    if (!address || typeof address !== 'object') return false;
    const { city, street, zip } = address;
    return (
      typeof city === 'string' &&
      typeof street === 'string' &&
      /^\d{5}$/.test(zip)
    );
  }

  static isProductIdValid(value) {
    return typeof value === 'number' && value > 0;
  }

  static isProductNameValid(value) {
    return typeof value === 'string' && value.trim().length >= 3;
  }

  static isDescriptionValid(value) {
    return typeof value === 'string' && value.trim().length >= 15;
  }

  static isPriceValid(value) {
    return typeof value === 'number' && value >= 0;
  }

  static isStockValid(value) {
    return Number.isInteger(value) && value >= 0;
  }

  static isQuantityValid(value) {
    return Number.isInteger(value) && value > 0;
  }

  static isCategoryValid(value) {
    return typeof value === 'string' && value.trim().length >= 3;
  }

  static isImageValid(value) {
    return typeof value === 'string' && value.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  }

  static isOrderIdValid(value) {
    return typeof value === 'number' && value > 0;
  }

  static isUserIdValid(value) {
    return typeof value === 'number' && value > 0;
  }

  static isProductOrderListValid(products) {
    return Array.isArray(products) && products.every(p =>
      typeof p.productId === 'number' &&
      p.productId > 0 &&
      Validate.isQuantityValid(p.quantity)
    );
  }

  static isTotalAmountValid(value) {
    return typeof value === 'number' && value >= 0;
  }

  static isOrderStatusValid(value) {
    const validStatuses = ["pending", "processing", "shipped", "delivered"];
    return validStatuses.includes(value.toLowerCase());
  }

  static isOrderDateValid(value) {
    return !isNaN(Date.parse(value));
  }
}
