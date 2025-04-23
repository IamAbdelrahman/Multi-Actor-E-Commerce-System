export class Validate {
  static isNameValid(value) {
    return value.match(/^[a-zA-Z]{3,9}$/);
  }

  static isEmailValid(value) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return value.match(emailPattern);
  }

  static isCategoryValid(value) {
    return typeof value === 'string' && value.trim().length >= 5;
  }

  static isStockValid(value) {
    return typeof value === 'number' && value >= 0;
  }

  static isSellerIdValid(value) {
    return typeof value === 'number' && value > 0;
  }

  static isImageValid(value) {
    return typeof value === 'string' && value.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  }

  static isQuantityValid(value) {
    return Number.isInteger(value) && value > 0;
  }
}