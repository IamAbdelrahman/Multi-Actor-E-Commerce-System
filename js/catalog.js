

import ProductManager from "../modules/ProductModule.js";

const searchInput = document.getElementById("searchInput");
const catalogContainer = document.getElementById("productCatalog");

// Price range elements
let minRange = document.getElementById("min-range");
let maxRange = document.getElementById("max-range");


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
            <!-- Buttons for heart and eye icons -->
            <div class="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
              <button class="btn btn-light rounded-circle shadow-sm">
                <i class="bi bi-heart"></i>
              </button>
              <button class="btn btn-light rounded-circle shadow-sm">
                <i class="bi bi-eye"></i>
              </button>
            </div>
        
            <!-- Product Image -->
            <img src="${product.image}" class="card-img-top mx-auto" alt="${product.name}" style="max-width: 60%; height:200px">
        
            <!-- Card Body with Product Name and Description -->
            <div class="card-body d-flex flex-column justify-content-between ">
                  <h5 class="card-title fw-semibold mb-2  ">${product.name}</h5>
                  <p class="text-muted small">${product.description}</p>
            </div>
              
        
            <!-- Card Footer with Price and Add to Cart Button -->
            <div class="card-footer bg-white border-0">
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">$${product.price}</span>
                <button class="btn btn-outline-dark btn-sm text-body-emphasis p-2 fw-semibold" 
                        onclick="addToCart({
                          id: ${product.id}, 
                          name: '${product.name}', 
                          price: ${product.price}, 
                          image: '${product.image}'
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


searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    const filteredProducts = ProductManager.GetProductsBySearch(query);
    SearchProduct(filteredProducts);

});


SearchProduct(ProductManager.GetAllProducts());



let minVal = document.getElementById("min-value");
let maxVal = document.getElementById("max-value");
const rangeFill = document.querySelector(".range-fill");
const inputFilter = document.querySelectorAll("input[type=range]");

function validateRange() {
    let minPrice = parseInt(inputFilter[0].value);
    let maxPrice = parseInt(inputFilter[1].value);

    if (minPrice > maxPrice) {
        let val = maxPrice;
        maxPrice = minPrice
        minPrice = val;

    }

    //update show min and max
    minVal.innerHTML = "$" + minPrice;
    maxVal.innerHTML = "$" + maxPrice;
    const allProducts = ProductManager.GetAllProducts();

    const filteredProducts = allProducts.filter(product => {
        const isInPriceRange = product.price >= minPrice && product.price <= maxPrice;
        return isInPriceRange;
    });

    SearchProduct(filteredProducts);

}


inputFilter.forEach(element => {
    element.addEventListener("input", validateRange);
});


validateRange();



// // Function to filter products by price range
// function filterByPrice(minPrice, maxPrice) {
//     const allProducts = ProductManager.GetAllProducts();
//     const filteredProducts = allProducts.filter(product =>
//         product.price >= minPrice && product.price <= maxPrice
//     );
//     return filteredProducts;
// }

// // Update displayed price range
// function updatePriceRange() {
//     minVal.innerHTML = "$" + minRange.value;
//     maxVal.innerHTML = "$" + maxRange.value;

//     let minPrice = parseInt(minRange.value);
//     let maxPrice = parseInt(maxRange.value);

//     // 🔁 Swap if min > max
//     if (minPrice > maxPrice) {
//         const temp = minPrice;
//         minPrice = maxPrice;
//         maxPrice = temp;
//     }

//     // Apply both name and price filtering
//     const searchQuery = searchInput.value.trim().toLowerCase();
//     const allProducts = ProductManager.GetAllProducts();

//     const filteredByPrice = filterByPrice(minPrice, maxPrice);

//     const filteredProducts = filteredByPrice.filter(product =>
//         product.name.toLowerCase().includes(searchQuery)
//     );


//     //swap value if minPrice > maxPrice

//     SearchProduct(filteredProducts);
// }

// // Handle search input for name filtering
// searchInput.addEventListener("input", () => {
//     updatePriceRange();  // Re-apply filtering when the search input changes
// });

// // Handle price range inputs
// minRange.addEventListener("input", updatePriceRange);
// maxRange.addEventListener("input", updatePriceRange);

// // Initial call to set default range and display products
// updatePriceRange();