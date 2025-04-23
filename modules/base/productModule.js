import StorageManager from './StorageModule.js';

class Product {
  constructor(id, name, description, price, stock, category, sellerId, image, quantity) {
    this.ID = id;
    this.Name = name;
    this.Description = description;
    this.Price = price;
    this.Stock = stock;
    this.Category = category;
    this.SellerId = sellerId;
    this.Image = image;
    this.Quantity = quantity;
  }

  set ID(id) {
    if (typeof id === 'number' && id > 0) {
      this.id = id;
    } else {
      console.error("Invalid ID: must be a positive number.");
      this.id = 0;
    }
  }
  get ID() {
    return this.id;
  }

  set Name(value) {
    if (typeof value === 'string' && value.trim().length >= 3) {
      this.name = value.trim();
    } else {
      console.error("Invalid product name: must be a string with at least 3 characters.");
      this.name = null;
    }
  }
  get Name() {
    return this.name;
  }

  set Description(value) {
    if (typeof value === 'string' && value.trim().length >= 15) {
      this.description = value.trim();
    } else {
      console.error("Invalid description: must be at least 15 characters.");
      this.description = null;
    }
  }
  get Description() {
    return this.description;
  }

  set Price(value) {
    if (typeof value === 'number' && value >= 0) {
      this.price = value;
    } else {
      console.error("Invalid price: must not be negative number.");
      this.price = 0;
    }
  }
  get Price() {
    return this.price;
  }

  set Stock(value) {
    if (Number.isInteger(value) && value >= 0) {
      this.stock = value;
    } else {
      console.error("Invalid stock: must not be negative number.");
      this.stock = 0;
    }
  }
  get Stock() {
    return this.stock;
  }

  set Category(value) {
    if (typeof value === 'string' && value.trim().length >= 5) {
      this.category = value.trim().toLowerCase();
    } else {
      console.error("Invalid category: must be at least 5 characters.");
      this.category = null;
    }
  }
  get Category() {
    return this.category;
  }

  set SellerId(value) {
    if (typeof value === 'number' && value > 0) {
      this.sellerId = value;
    } else {
      console.error("Invalid seller ID: must be a positive number.");
      this.sellerId = 0;
    }
  }
  get SellerId() {
    return this.sellerId;
  }

  set Image(value) {
    if (typeof value === 'string' && value.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
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
    if (Number.isInteger(value) && value > 0) {
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
    const products = StorageManager.LoadSection("products") || [];
    products.push(product);
    StorageManager.SaveSection("products", products);
  }

  static GetProductById(id) {
    const products = StorageManager.LoadSection("products") || [];
    return products.find(p => p.id === id);
  }

  static UpdateProduct(id, updatedData) {
    let products = StorageManager.LoadSection("products") || [];
    products = products.map(product => {
      if (product.id === id) {
        return { ...product, ...updatedData };
      }
      return product;
    });

    StorageManager.SaveSection("products", products);
  }

  static DeleteProduct(id) {
    let products = StorageManager.LoadSection("products") || [];
    products = products.filter(p => p.id !== id);
    StorageManager.SaveSection("products", products);
  }
}
