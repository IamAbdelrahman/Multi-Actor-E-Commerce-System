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
    this.id = typeof id === 'number' && id > 0 ? id : 0;
  }
  get ID() {
    return this.id;
  }

  set Name(value) {
    this.name = typeof value === 'string' && value.trim().length >= 3 ? value.trim() : null;
  }
  get Name() {
    return this.name;
  }

  set Description(value) {
    this.description = typeof value === 'string' && value.trim().length >= 15 ? value.trim() : null;
  }
  get Description() {
    return this.description;
  }

  set Price(value) {
    this.price = typeof value === 'number' && value >= 0 ? value : 0;
  }
  get Price() {
    return this.price;
  }

  set Stock(value) {
    this.stock = Number.isInteger(value) && value >= 0 ? value : 0;
  }
  get Stock() {
    return this.stock;
  }

  set Category(value) {
    this.category = typeof value === 'string' && value.trim().length >= 3 ? value.trim().toLowerCase() : null;
  }
  get Category() {
    return this.category;
  }

  set Image(value) {
    this.image = typeof value === 'string' && value.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? value : '';
  }
  get Image() {
    return this.image;
  }

  set Quantity(value) {
    this.quantity = Number.isInteger(value) && value > 0 ? value : 1;
  }
  get Quantity() {
    return this.quantity;
  }
}
