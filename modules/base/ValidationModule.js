export class Validate {
  static isNameValid(value) {
    return typeof value === 'string' && /^[a-zA-Z\s]{3,30}$/.test(value);
  }

  static isEmailValid(value) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return typeof value === 'string' && emailPattern.test(value);
  }

  static isPasswordValid(value) {
    return typeof value === 'string' && value.trim().length >= 6;
  }

  static isRoleValid(value) {
    const validRoles = ["admin", "seller", "customer"];
    return validRoles.includes(value.toLowerCase());
  }

  static isPhoneValid(value) {
    return typeof value === 'string' && /^\+20\d{10}$/.test(value); // Egypt format
  }

  static isAddressValid(address) {
    if (!address || typeof address !== 'object') return false;
    const { street, city, state, zip } = address;
    return (
      typeof street === 'string' &&
      typeof city === 'string' &&
      typeof state === 'string' &&
      /^\d{5}$/.test(zip)
    );
  }

  // ✅ PRODUCT VALIDATION
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

  // ✅ ORDER VALIDATION
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
    return !isNaN(Date.parse(value)); // Valid ISO date string
  }
}
