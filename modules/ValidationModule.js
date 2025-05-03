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
    return typeof value === 'string' && /^\+20\d{10}$/.test(value);
  }

  static isStreetValid(street) {
    return typeof street === 'string' &&
      /^[A-Za-z0-9\s\-\.]+$/.test(street.trim());
  }

  static isCityValid(city) {
    return typeof city === 'string' &&
      /^[A-Za-z\s]+$/.test(city.trim());
  }

  static isZipCodeValid(zipCode) {
    return typeof zipCode === 'string' &&
      /^\d{5}$/.test(zipCode);
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
    const allowedCategories = ["mobiles", "tablets", "headphones", "accessories", "laptops"];
    return typeof value === "string" && allowedCategories.includes(value.trim().toLowerCase());
  }


  static isImageValid(value) {
    if (typeof value !== 'string') return false;

    // Check for image extensions and basic URL structure
    const pattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i;
    return pattern.test(value.trim());
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
