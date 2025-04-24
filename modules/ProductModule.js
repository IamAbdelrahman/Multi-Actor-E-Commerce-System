import Validate  from './ValidateModule.js'; 

class Product {
  constructor(id, name, description, price, stock, category, image, quantity = 1) {
    this.ID = id;
    this.Name = name;
    this.Description = description;
    this.Price = price;
    this.Stock = stock;
    this.Category = category;
    this.Image = image;
    this.Quantity = quantity;
  }

  set ID(id) {
    this.id = Validate.isProductIdValid(id) ? id : 0;
  }
  get ID() {
    return this.id;
  }

  set Name(value) {
    if (Validate.isProductNameValid(value)) {
      this.name = value.trim();
    } else {
      alert("Invalid product name: must be at least 3 characters.");
      this.name = null;
    }
  }
  get Name() {
    return this.name;
  }

  set Description(value) {
    if (Validate.isDescriptionValid(value)) {
      this.description = value.trim();
    } else {
      alert("Invalid description: must be at least 15 characters.");
      this.description = null;
    }
  }
  get Description() {
    return this.description;
  }

  set Price(value) {
    if (Validate.isPriceValid(value)) {
      this.price = value;
    } else {
      alert("Invalid price: must be a non-negative number.");
      this.price = 0;
    }
  }
  get Price() {
    return this.price;
  }

  set Stock(value) {
    if (Validate.isStockValid(value)) {
      this.stock = value;
    } else {
      alert("Invalid stock: must be a non-negative integer.");
      this.stock = 0;
    }
  }
  get Stock() {
    return this.stock;
  }

  set Category(value) {
    if (Validate.isCategoryValid(value)) {
      this.category = value.trim().toLowerCase();
    } else {
      alert("Invalid category: must be at least 3 characters.");
      this.category = null;
    }
  }
  get Category() {
    return this.category;
  }


  set Image(value) {
    if (Validate.isImageValid(value)) {
      this.image = value;
    } else {
      console.error("Invalid image: must be a valid image URL.");
      this.image = '';
    }
  }

  get Image() {
    return this.image;
  }

  set Quantity(value) {
    if (Validate.isQuantityValid(value)) {
      this.quantity = value;
    } else {
      console.error("Invalid quantity: must be a positive integer.");
      this.quantity = 1;
    }
  }

  get Quantity() {
    return this.quantity;
  }
}

export class ProductManager{
  static CreateProduct(...args) {
    const product = new Product(...args);

    if (!product.ID || !product.Name || !product.Description || !product.Category || product.Price <= 0 || product.Stock <= 0) {
      console.error("Invalid product data. Please Enter valid data!");
      return;
    }
    const products = StorageManager.Load("products") || [];
    products.push(product);
    StorageManager.Save("products", products);
  }

  static GetProductById(id) {
    const products = StorageManager.Load("products") || [];
    return products.find(p => p.id === id);
  }

  static UpdateProduct(id, updatedData) {
    let products = StorageManager.Load("products") || [];
    products = products.map(product => {
      if (product.id === id) {
        return { ...product, ...updatedData };
      }
      return product;
    });

    StorageManager.Save("products", products);
  }

  static DeleteProduct(id) {
    let products = StorageManager.Load("products") || [];
    products = products.filter(p => p.id !== id);
    StorageManager.Save("products", products);
  }
}
