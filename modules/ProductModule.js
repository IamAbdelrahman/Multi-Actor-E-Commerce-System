import StorageManager from './StorageModule.js';
import Validate from './ValidationModule.js';

/*- PRODUCT MANAGER
-----------------------------------------------------------------------*/

class Product {
  constructor(id, name, description, price, stock, category, image) {
    this.ID = id;
    this.Name = name;
    this.Description = description;
    this.Price = price;
    this.Stock = stock;
    this.Category = category;
    this.Image = image;

  }


  set ID(id) {
    if (Validate.isUserIdValid(id)) {
      this.id = id;
    } else {
      console.error("Invalid ID: must be a positive number.");
      this.id = 0;
      return false;
    }
  }

  get ID() {
    return this.id;
  }

  set Name(value) {
    if (Validate.isProductNameValid(value)) {
      this.name = value.trim().toLowerCase();
    } else {
      alert("Invalid product name: must be at least 3 characters.");
      return false;
    }
  }
  get Name() {
    return this.name;
  }

  set Description(value) {
    if (Validate.isDescriptionValid(value)) {
      this.description = value.trim().toLowerCase();
    } else {
      alert("Invalid description: must be at least 15 characters.");
      return false;
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
      return false;
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
      return false;
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
      return false;
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
      return false;
    }
  }

  get Quantity() {
    return this.quantity;
  }
}

export default class ProductManager {

  static AddProduct(name, description, price, stock, category, image) {
    const products = StorageManager.LoadSection("products") || [];

    // Validate basic input to enter empty
    if (!name || !description || !category || price <= 0 || stock < 0 || !image) {
      console.error("Invalid product data. Please enter valid data!");
      return false;
    }

    //validation
    if (!Validate.isProductNameValid(name)) {
      alert("Invalid product name: must be at least 3 characters.");
      return false;
    }

    if (!Validate.isDescriptionValid(description)) {
      alert("Invalid description: must be at least 15 characters.");
      return false;
    }

    if (!Validate.isPriceValid(price)) {
      alert("Invalid price: must be a non-negative number.");
      return false;
    }

    if (!Validate.isStockValid(stock)) {
      alert("Invalid stock: must be a non-negative integer.");
      return false;
    }

    if (!Validate.isCategoryValid(category)) {
      alert("Invalid category: Allowed is one of that [mobiles, tablets, headphones, accessories, laptops");
      return false;
    }



    //Newwwwwwwwwww For Make ID for each user
    function GenerateNextID() {
      const products = StorageManager.LoadSection("products") || [];
      const ids = products.map(p => p.id || 0);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      return maxId + 1;
    }

    const newProduct = new Product(GenerateNextID(), name, description, price, stock, category, image);

    // Check for duplicatationn name
    const nameExists = products.some(p => p.Name === name);
    if (nameExists) {
      console.error("A product with this name already exists.");
      return false;
    }

    //Check for category
    const existingCategory = products.find(p => p.Category === products.Category);
    if (!existingCategory) {
      console.error("Category does not exist.");
      return false;
    }

    products.push(newProduct);
    StorageManager.SaveSection("products", products);
    return true;
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
  ////////////////////////UpdateProduct
  static UpdateProduct(id, name, description, price, stock, category, image) {
    let products = StorageManager.LoadSection("products") || [];


    products = products.map(product => {
      if (product.id === id) {
        product.name = name;
        product.description = description;
        product.price = price;
        product.stock = stock;
        product.category = category;
        product.image = image;
      }
      return product;
    });

    StorageManager.SaveSection("products", products);
    return true;
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

  static ApproveProduct(id) {
    const products = ProductManager.GetAllProducts();
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        return { ...p, status: "approved" };
      }
      return p;
    });
    StorageManager.SaveSection("products", updatedProducts);
    return true;
  }

  static RejectProduct(id) {
    const products = ProductManager.GetAllProducts();
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        return { ...p, status: "rejected" };
      }
      return p;
    });
    StorageManager.SaveSection("products", updatedProducts);
    return true;
  }

  static GetProductCounts() {
    return ProductManager.GetAllProducts().length;
  }
}