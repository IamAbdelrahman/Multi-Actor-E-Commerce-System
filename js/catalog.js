import ProductManager from "../modules/ProductModule.js";

//This is for searchname
const searchInput = document.getElementById("searchInput");

//This container for DisplayProducts
const catalogContainer = document.getElementById("productCatalog");

//This is for PriceRange
const minVal = document.getElementById("min-value");
const maxVal = document.getElementById("max-value");
const inputFilter = document.querySelectorAll("input[type=range]");

//This for values in range
let minPrice = parseInt(inputFilter[0].value);
let maxPrice = parseInt(inputFilter[1].value);
let currentCategory = '';


// Main Function that return products in container
function SearchProduct(products) {
  catalogContainer.innerHTML = '';

  if (products.length === 0) {
    catalogContainer.innerHTML = '<p>No products found.</p>';
    return;
  }

  const row = document.createElement("div");
  row.className = "row";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-lg-3 mb-4";
    card.innerHTML = `
      <div class="card h-100 position-relative text-center p-3">
        <div class="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
              <button class="btn btn-light rounded-circle shadow-sm" onclick="addToWishlist({
                id: ${product.id}, 
                name: '${product.name}', 
                price: ${product.price}, 
                image: '${product.image}'
              })">
                <i class="bi bi-heart"></i>
              </button>
          <a href="product-details.html?id=${product.id}" class="text-decoration-none">
          <button class="btn btn-light rounded-circle shadow-sm">
               <i class="bi bi-eye"></i>
          </button>
          </a>
        </div>
            
        <a href="product-details.html?id=${product.id}" class="text-decoration-none">
        <img src="${product.image}" class="card-img-top  mx-auto" style="max-width: 60%; height:200px">
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title fw-semibold mb-2">${product.name}</h5>
          <p class="text-muted small">${product.description}</p>
        </div>
        <div class="card-footer bg-white border-0">
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold">$${product.price}</span>
            <button class="btn btn-outline-dark btn-sm text-body-emphasis p-2 fw-semibold" 
              onclick="addToCart({
                id: ${product.id}, 
                name: '${product.name}', 
                price: ${product.price}, 
                image: '${product.image}',
                stock: ${product.stock}
              })">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    `;

    row.appendChild(card);
  });

  catalogContainer.appendChild(row);
}

//Use GetProductsBySearchName that filter name from ProductModule
searchInput.addEventListener("input", () => {
  const name = searchInput.value.trim();
  const filteredByName = ProductManager.GetProductsBySearchName(name);
  SearchProduct(filteredByName);
});

// Extract category from URL
const urlParams = new URLSearchParams(window.location.search);
currentCategory = urlParams.get('category') || '';

//Use GetProductByFilters that filter price and category from ProductModule
function FilterByCategoryAndPrice(filteredProducts = ProductManager.GetAllProducts()) {
  // Filter the products by the current price and category
  const filteredProductsByCategoryAndPrice = ProductManager.GetProductByFilters(minPrice, maxPrice, currentCategory);

  // filter also price , name , category
  if (filteredProducts.length > 0) {
    const filteredByName = filteredProductsByCategoryAndPrice.filter(product =>
      product.name.toLowerCase().includes(searchInput.value.trim().toLowerCase())
    );
    SearchProduct(filteredByName);
  } else {
    SearchProduct(filteredProductsByCategoryAndPrice);
  }
}

//Validate Range
function validateRange() {
  minPrice = parseInt(inputFilter[0].value);
  maxPrice = parseInt(inputFilter[1].value);

  //Swap Ranges 
  if (minPrice > maxPrice) {
    let val = maxPrice;
    maxPrice = minPrice
    minPrice = val;

  }

  //update show min and max
  minVal.innerHTML = "$" + minPrice;
  maxVal.innerHTML = "$" + maxPrice;

  FilterByCategoryAndPrice();
}



// Apply Validation to both min and max
inputFilter.forEach(element => {
  element.addEventListener("input", validateRange);
});


// Initialize filters on load
validateRange();
