import StorageManager from './StorageModule.js';

/*- PRODUCT MANAGER
-----------------------------------------------------------------------*/

class Product {
  constructor(name, description, price, stock, category, image, id = 1) {
    this.Name = name;
    this.Description = description;
    this.Price = price;
    this.Stock = stock;
    this.Category = category;
    this.Image = image;
    this.ID = id;
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

export default class ProductManager {
  static AddProduct(name, description, price, stock, category, image, id = 0) {
    const product = new Product(name, description, price, stock, category, image, id = 0);
    const products = StorageManager.LoadSection("products") || [];
    // if (!product.Name || !product.Description || !product.Category || product.Price <= 0 || product.Stock <= 0) {
    //   console.error("Invalid product data. Please Enter valid data!");
    //   return;
    // }

    // const existingProduct = products.find(p => p.ID === product.ID);
    // if (existingProduct) {
    //   console.error("Product with this ID already exists.");
    //   return;
    // }
    // const existingCategory = products.find(p => p.Category === product.Category);
    // if (!existingCategory) {
    //   console.error("Category does not exist.");
    //   return;
    // }
    // const existingImage = products.find(p => p.Image === product.Image);
    // if (!existingImage) {
    //   console.error("Image does not exist.");
    //   return;
    // }
    // const existingName = products.find(p => p.Name === product.Name);
    // if (!existingName) {
    //   console.error("Product name does not exist.");
    //   return;
    // }

    const _id = products.length > 0 ? products[products.length - 1].ID + 1 : 1;
    product.ID = _id;
    products.push(product);
    StorageManager.SaveSection("products", products);
  }

  static GetAllProducts() {
    return StorageManager.LoadSection("products") || [];
  }

  static GetProductById(id) {
    const products = StorageManager.LoadSection("products") || [];
    return products.find(p => p.id === id);
  }

  static GetProductsByCategory(category) {
    const products = ProductManager.GetAllProducts();
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  static GetProductsByPriceRange(minPrice, maxPrice) {
    const products = ProductManager.GetAllProducts();
    return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
  }

  static GetProductByFilters(minPrice, maxPrice, category = '') {
    category = category === 'all' ? '' : category;
    const products = ProductManager.GetAllProducts();

    return products.filter(product => {
      const matchesCategory = category ? product.category.toLowerCase() === category.toLowerCase() : true;
      const matchesPrice = (!minPrice && !maxPrice) ||
        (product.price >= minPrice && product.price <= maxPrice);
      return matchesCategory && matchesPrice;
    });
  }


  static GetProductsBySearchName(product_name) {
    const products = ProductManager.GetAllProducts();
    return products.filter(product => product.name.toLowerCase().includes(product_name.toLowerCase()));
  }

  static UpdateProduct(id, updatedData) {
    let products = StorageManager.Load("products") || [];
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

  static ChangeQuantity(productId, amount) {
    const product = Product.GetProductById(productId);
    if (!product) {
      console.log(`Product with ID ${productId} not found.`);
      return false;
    }
    product.stock = parseInt(product.stock) + parseInt(amount);
    if (product.stock < 0) {
      console.log('Cannot decrease quantity below zero.');
      return false;
    }
    let products = Product.GetAllProducts();
    products = products.map(p => p.id == productId ? product : p);
    StorageManager.SaveSection('products', products);
    return product;
  }

  static Categories() {
    const products = Product.GetAllProducts();
    return [...new Set(products.map(product => product.category))];
  }

  static categoriesList() {
    return [
      "Mobiles",
      "Laptops",
      "Headphones",
      "Tablets",
      "Accessories"
    ];
  }

}
