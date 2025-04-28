//Filter By price
const searchInput = document.querySelector('.searchByName');

// Function to filter products by name
function filterByName() {
    const searchQuery = searchInput.value.toLowerCase();

    productCards.forEach(card => {
        const productName = card.querySelector('.card-title').textContent.toLowerCase();

        // Show or hide product based on the search query
        if (productName.includes(searchQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add event listener for search input
searchInput.addEventListener('input', filterByName);
//access min and , max
let minVal = document.getElementById("min-value");
let maxVal = document.getElementById("max-value");

//access rangefill
const rangeFill = document.querySelector(".range-fill");

const productCards = document.querySelectorAll('.card');  // This assumes each product has a class 'card'


//validateRange
function validateRange() {
    let minPrice = parseInt(inputElement[0].value);
    let maxPrice = parseInt(inputElement[1].value);

    //swap value if minPrice > maxPrice
    if (minPrice > maxPrice) {
        let val = maxPrice;
        maxPrice = minPrice
        minPrice = val;

    }
    //calculate the percentage position for min and max values
    const minPercentage = ((minPrice - 10) / 490) * 100;
    const maxPercentage = ((maxPrice - 10) / 490) * 100;

    //set position and width of the fill color element to show selected range
    rangeFill.style.left = minPercentage + "%";
    rangeFill.style.width = maxPercentage - minPercentage + "%";

    //update show min and max
    minVal.innerHTML = "$" + minPrice;
    maxVal.innerHTML = "$" + maxPrice;

    // Filter products based on the price range
    filterProducts(minPrice, maxPrice);

}


// Function to filter products by price
function filterProducts(minPrice, maxPrice) {
    productCards.forEach(card => {
        const productPrice = parseFloat(card.querySelector('.fw-bold').textContent.replace('$', ''));


        if (productPrice >= minPrice && productPrice <= maxPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}



//access input
const inputElement = document.querySelectorAll("input");

//add event listner to input
inputElement.forEach(element => {
    element.addEventListener("input", validateRange)


});
//initial call to validat

validateRange();

//Filter by name


