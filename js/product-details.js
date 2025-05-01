document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId || isNaN(productId)) {
        showErrorState('Product not found', 'Invalid product ID. Please check the URL and try again.');
        return;
    }

    loadProductData(productId);
});

async function loadProductData(productId) {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (!data.products || !Array.isArray(data.products)) {
            throw new Error('Invalid data structure: products array not found');
        }
        
        const product = data.products.find(p => p.id === productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        displayProduct(product);
        loadRelatedProducts(data.products, product.id, product.category);
    } catch (error) {
        console.error('Error loading product:', error);
        showErrorState('Error Loading Product', 'There was a problem loading the product details. Please try again later.');
    }
}

function displayProduct(product) {
    // Remove loading placeholders
    removeLoadingPlaceholders();
    
    // Set basic product info
    document.title = `${product.name} - Electronics Store`;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = product.description || 'No description available';
    
    // Set product image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = product.image;
    mainImage.alt = product.name;
    
    // Generate and display rating
    const randomRating = (Math.random() * 1 + 4).toFixed(1);
    const randomReviews = Math.floor(Math.random() * 91) + 10;
    document.getElementById('productRatingStars').innerHTML = getRatingStars(randomRating);
    document.getElementById('productRating').textContent = `${randomRating} (${randomReviews} reviews)`;
    document.getElementById('productStock').textContent = `${product.stock || 50} in stock`;
    document.getElementById('maxQuantity').textContent = product.stock || 50;
    
    // Set product details
    document.getElementById('fullDescription').textContent = 
        product.fullDescription || product.description || 'No detailed description available.';
    
    // Generate and display specs
    document.getElementById('specificationsContent').innerHTML = generateTechnicalSpecs(product);
    
    // Generate and display reviews
    document.getElementById('reviewsContent').innerHTML = generateRandomReviews(randomRating, randomReviews);
    
    // Set key features
    document.getElementById('keyFeatures').innerHTML = generateKeyFeatures(product);
    
    // Setup quantity controls and add to cart button
    setupQuantityControls(product);
}

function setupQuantityControls(product) {
    const quantityInput = document.getElementById('quantity');
    const incrementBtn = document.getElementById('increment');
    const decrementBtn = document.getElementById('decrement');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const maxStock = product.stock || 50;
    
    // Set initial max attribute
    quantityInput.max = maxStock;
    
    // Update button states
    function updateControls() {
        const currentValue = parseInt(quantityInput.value) || 1;
        
        // Validate input
        if (currentValue > maxStock) {
            quantityInput.value = maxStock;
        } else if (currentValue < 1) {
            quantityInput.value = 1;
        }
        
        // Update button states
        decrementBtn.disabled = quantityInput.value <= 1;
        incrementBtn.disabled = quantityInput.value >= maxStock;
        
        // Update stock display if available
        const stockDisplay = document.getElementById('remainingStock');
        if (stockDisplay) {
            stockDisplay.textContent = maxStock - quantityInput.value;
        }
    }
    
    // Initialize controls
    updateControls();
    
    // Event listeners
    incrementBtn.addEventListener('click', () => {
        quantityInput.stepUp();
        updateControls();
    });
    
    decrementBtn.addEventListener('click', () => {
        quantityInput.stepDown();
        updateControls();
    });
    
    quantityInput.addEventListener('input', () => {
        updateControls();
    });
    
    // Add to cart functionality
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value) || 1;
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: maxStock
        }, quantity);
    });
}

function removeLoadingPlaceholders() {
    const elements = [
        'mainImage', 'productName', 'productPrice', 
        'productDescription', 'fullDescription',
        'specificationsContent', 'reviewsContent'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.remove('loading-placeholder');
    });
    
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart me-2"></i> Add to Cart';
        addToCartBtn.disabled = false;
    }
}

function showErrorState(title, message) {
    document.getElementById('productName').textContent = title;
    document.getElementById('productDescription').textContent = message;
    
    const elements = ['productName', 'productDescription'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.remove('loading-placeholder');
    });
}

// Helper functions
function getRatingStars(rating) {
    rating = parseFloat(rating);
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
    if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="far fa-star"></i>';
    return starsHTML;
}

function generateTechnicalSpecs(product) {
    const specs = {
        'Brand': product.name.split(' ')[0] || 'ElectroStore',
        'Model': product.name,
        'Category': product.category,
        'Price': `$${product.price.toFixed(2)}`,
        'Availability': product.stock > 0 ? 'In Stock' : 'Out of Stock',
        'Warranty': '1 Year'
    };
    
    let html = '<table class="table"><tbody>';
    for (const [key, value] of Object.entries(specs)) {
        html += `<tr><th scope="row">${key}</th><td>${value}</td></tr>`;
    }
    html += '</tbody></table>';
    return html;
}
// Generate random reviews
function generateRandomReviews(averageRating, reviewCount) {
    const usernames = [
        'Alex Johnson', 'Sarah Williams', 'Michael Brown', 'Emily Davis', 
        'David Wilson', 'Jessica Taylor', 'Christopher Anderson', 'Amanda Martinez',
        'Matthew Thomas', 'Jennifer Garcia', 'Robert Rodriguez', 'Lisa Martinez',
        'Daniel Hernandez', 'Michelle Lopez', 'William Gonzalez', 'Stephanie Perez'
    ];
    
    const positiveComments = [
        'Excellent product! Exceeded my expectations.',
        'Very happy with this purchase. Works perfectly.',
        'Great quality and value for the price.',
        'Highly recommend this product to others.',
        'Exactly as described. Very satisfied.',
        'Fast shipping and great packaging.',
        'This is my second purchase. Love it!',
        'Perfect for my needs. Very happy customer.',
        'Better than I expected. Will buy again.',
        'Top-notch quality and performance.'
    ];
    
    const neutralComments = [
        'Good product overall, but could be improved.',
        'Works as expected. Nothing extraordinary.',
        'Decent quality for the price.',
        'Satisfied with the purchase, but not perfect.',
        'Does the job, but has some minor flaws.',
        'Average product. Met my basic needs.',
        'Okay for the price, but not exceptional.',
        'It works, but I expected better quality.',
        'Good but not great. Would consider alternatives.',
        'Meets requirements but lacks some features.'
    ];
    
    const negativeComments = [
        'Not as described. Disappointed with the quality.',
        'Stopped working after a few days. Very poor.',
        'Would not recommend. Not worth the price.',
        'Defective item received. Customer service was unhelpful.',
        'Much smaller than expected. Misleading description.',
        'Poor build quality. Broke within a week.',
        'Does not work as advertised. Waste of money.',
        'Very disappointed with this purchase.',
        'Terrible product. Avoid at all costs.',
        'Not functional. Complete waste of time and money.'
    ];
    
    // Calculate distribution of ratings based on average
    const ratingDistribution = calculateRatingDistribution(averageRating, reviewCount);
    
    let reviewsHTML = '';
    let reviewIndex = 0;
    
    // Generate 5-star reviews
    for (let i = 0; i < ratingDistribution.fiveStar; i++) {
        reviewsHTML += generateReview(usernames, positiveComments, 5, reviewIndex++);
    }
    
    // Generate 4-star reviews
    for (let i = 0; i < ratingDistribution.fourStar; i++) {
        reviewsHTML += generateReview(usernames, positiveComments, 4, reviewIndex++);
    }
    
    // Generate 3-star reviews
    for (let i = 0; i < ratingDistribution.threeStar; i++) {
        reviewsHTML += generateReview(usernames, neutralComments, 3, reviewIndex++);
    }
    
    // Generate 2-star reviews
    for (let i = 0; i < ratingDistribution.twoStar; i++) {
        reviewsHTML += generateReview(usernames, neutralComments, 2, reviewIndex++);
    }
    
    // Generate 1-star reviews
    for (let i = 0; i < ratingDistribution.oneStar; i++) {
        reviewsHTML += generateReview(usernames, negativeComments, 1, reviewIndex++);
    }
    
    // Add review summary at the top
    const summaryHTML = `
        <div class="row mb-4">
            <div class="col-md-6">
                <h4>Customer Reviews</h4>
                <div class="d-flex align-items-center mb-2">
                    <div class="rating me-2">
                        ${getRatingStars(averageRating)}
                    </div>
                    <span class="fw-bold">${averageRating} out of 5</span>
                </div>
                <div class="text-muted mb-3">${reviewCount} global ratings</div>
            </div>
            <div class="col-md-6">
                <div class="mb-2">
                    <span class="me-2">5 star</span>
                    <div class="progress" style="height: 10px; width: 70%">
                        <div class="progress-bar bg-warning" role="progressbar" 
                             style="width: ${(ratingDistribution.fiveStar/reviewCount)*100}%"></div>
                    </div>
                    <span class="ms-2">${ratingDistribution.fiveStar}</span>
                </div>
                <div class="mb-2">
                    <span class="me-2">4 star</span>
                    <div class="progress" style="height: 10px; width: 70%">
                        <div class="progress-bar bg-warning" role="progressbar" 
                             style="width: ${(ratingDistribution.fourStar/reviewCount)*100}%"></div>
                    </div>
                    <span class="ms-2">${ratingDistribution.fourStar}</span>
                </div>
                <div class="mb-2">
                    <span class="me-2">3 star</span>
                    <div class="progress" style="height: 10px; width: 70%">
                        <div class="progress-bar bg-warning" role="progressbar" 
                             style="width: ${(ratingDistribution.threeStar/reviewCount)*100}%"></div>
                    </div>
                    <span class="ms-2">${ratingDistribution.threeStar}</span>
                </div>
                <div class="mb-2">
                    <span class="me-2">2 star</span>
                    <div class="progress" style="height: 10px; width: 70%">
                        <div class="progress-bar bg-warning" role="progressbar" 
                             style="width: ${(ratingDistribution.twoStar/reviewCount)*100}%"></div>
                    </div>
                    <span class="ms-2">${ratingDistribution.twoStar}</span>
                </div>
                <div class="mb-2">
                    <span class="me-2">1 star</span>
                    <div class="progress" style="height: 10px; width: 70%">
                        <div class="progress-bar bg-warning" role="progressbar" 
                             style="width: ${(ratingDistribution.oneStar/reviewCount)*100}%"></div>
                    </div>
                    <span class="ms-2">${ratingDistribution.oneStar}</span>
                </div>
            </div>
        </div>
        <hr>
    `;
    
    return summaryHTML + reviewsHTML;
}

function calculateRatingDistribution(averageRating, reviewCount) {
    averageRating = parseFloat(averageRating);
    
    // Base distribution based on average rating
    let distribution = {
        fiveStar: Math.round(reviewCount * 0.4),
        fourStar: Math.round(reviewCount * 0.3),
        threeStar: Math.round(reviewCount * 0.15),
        twoStar: Math.round(reviewCount * 0.1),
        oneStar: Math.round(reviewCount * 0.05)
    };
    
    // Adjust based on the average rating
    if (averageRating >= 4.5) {
        distribution.fiveStar = Math.round(reviewCount * 0.7);
        distribution.fourStar = Math.round(reviewCount * 0.2);
        distribution.threeStar = Math.round(reviewCount * 0.05);
        distribution.twoStar = Math.round(reviewCount * 0.03);
        distribution.oneStar = Math.round(reviewCount * 0.02);
    } else if (averageRating >= 4.0) {
        distribution.fiveStar = Math.round(reviewCount * 0.5);
        distribution.fourStar = Math.round(reviewCount * 0.3);
        distribution.threeStar = Math.round(reviewCount * 0.1);
        distribution.twoStar = Math.round(reviewCount * 0.07);
        distribution.oneStar = Math.round(reviewCount * 0.03);
    } else if (averageRating >= 3.5) {
        distribution.fiveStar = Math.round(reviewCount * 0.3);
        distribution.fourStar = Math.round(reviewCount * 0.3);
        distribution.threeStar = Math.round(reviewCount * 0.2);
        distribution.twoStar = Math.round(reviewCount * 0.1);
        distribution.oneStar = Math.round(reviewCount * 0.1);
    }
    
    // Ensure the total matches reviewCount
    const total = distribution.fiveStar + distribution.fourStar + 
                 distribution.threeStar + distribution.twoStar + distribution.oneStar;
    
    if (total !== reviewCount) {
        // Adjust the largest category to match
        const diff = reviewCount - total;
        if (diff > 0) {
            distribution.fiveStar += diff;
        } else {
            distribution.oneStar += diff;
        }
    }
    
    return distribution;
}

function generateReview(usernames, comments, rating, index) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const days = Math.floor(Math.random() * 28) + 1;
    const month = months[Math.floor(Math.random() * 12)];
    const year = 2023 - Math.floor(Math.random() * 3);
    const dateText = `${month} ${days}, ${year}`;
    
    const username = usernames[index % usernames.length];
    const comment = comments[Math.floor(Math.random() * comments.length)];
    
    return `
        <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${username}</strong>
                    <div class="small text-muted">Reviewed on ${dateText}</div>
                </div>
                <div class="rating">
                    ${getRatingStars(rating)}
                </div>
            </div>
            <p>${comment}</p>
            <hr>
        </div>
    `;
}

function generateKeyFeatures(product) {
    const categoryFeatures = {
        'Headphones': [
            'Active noise cancellation',
            '30-hour battery life',
            'Bluetooth 5.0 connectivity',
            'Built-in microphone',
            'Comfortable over-ear design',
            'Foldable for easy storage'
        ],
        'Mobiles': [
            'High-resolution display',
            'Long-lasting battery',
            'Fast processor',
            'Multiple camera setup',
            '5G connectivity',
            'Fingerprint sensor'
        ],
        'Laptops': [
            'Powerful processor',
            'High-resolution display',
            'Fast SSD storage',
            'Backlit keyboard',
            'Multiple USB ports',
            'Lightweight design'
        ],
        'Tablets': [
            'High-resolution touchscreen',
            'Long battery life',
            'Lightweight and portable',
            'Front and rear cameras',
            'Expandable storage',
            'Stylus support'
        ],
        'Accessories': [
            'Premium materials',
            'Universal compatibility',
            'Durable construction',
            'Easy to install',
            'Compact design',
            'Multi-functional'
        ]
    };
    
    // Get category-specific features or default if category not found
    const features = categoryFeatures[product.category] || [
        'Premium quality materials',
        'Durable construction',
        'Easy to use',
        'Great value for money',
        'Satisfaction guaranteed'
    ];
    
    // Select 4-6 random features
    const selectedFeatures = [];
    const featureCount = Math.min(6, Math.max(4, Math.floor(Math.random() * 3) + 4));
    
    while (selectedFeatures.length < featureCount) {
        const randomIndex = Math.floor(Math.random() * features.length);
        if (!selectedFeatures.includes(features[randomIndex])) {
            selectedFeatures.push(features[randomIndex]);
        }
    }
    
    // Generate HTML
    let featuresHTML = '';
    const featureIcons = ['check-circle', 'shield', 'truck', 'undo', 'star', 'award'];
    
    selectedFeatures.forEach((feature, index) => {
        featuresHTML += `
            <li class="mb-2">
                <i class="fas fa-${featureIcons[index % featureIcons.length]} text-success me-2"></i>
                ${feature}
            </li>
        `;
    });
    
    return featuresHTML;
}

function loadThumbnails(product) {
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    thumbnailsContainer.innerHTML = '';
    
    // Generate 3-5 thumbnail images (using the main image for all in this example)
    const thumbnailCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < thumbnailCount; i++) {
        const col = document.createElement('div');
        col.className = 'col-3 mb-3';
        
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = `${product.name} - View ${i + 1}`;
        img.className = 'img-fluid thumbnail' + (i === 0 ? ' active' : '');
        img.style.height = '80px';
        img.style.objectFit = 'cover';
        img.onclick = function() {
            document.getElementById('mainImage').src = product.image;
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
        };
        
        col.appendChild(img);
        thumbnailsContainer.appendChild(col);
    }
}

function loadRelatedProducts(allProducts, currentProductId, currentCategory) {
    const relatedProductsContainer = document.getElementById('relatedProducts');
    relatedProductsContainer.innerHTML = '';
    
    // Filter products from the same category, excluding the current product
    const relatedProducts = allProducts.filter(p => 
        p.category === currentCategory && p.id !== currentProductId
    );
    
    // If not enough in same category, get random products
    if (relatedProducts.length < 4) {
        const otherProducts = allProducts.filter(p => 
            p.category !== currentCategory && p.id !== currentProductId
        );
        
        // Shuffle and take needed number
        const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
        relatedProducts.push(...shuffled.slice(0, 4 - relatedProducts.length));
    }
    
    // Display up to 4 related products
    relatedProducts.slice(0, 4).forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-6';
        
        col.innerHTML = `
            <div class="card related-product-card h-100">
                <a href="product-details.html?id=${product.id}" class="text-decoration-none">
                    <img src="${product.image}" class="card-img-top p-3" alt="${product.name}" style="height: 180px; object-fit: contain;">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="text-success fw-bold">$${product.price.toFixed(2)}</div>
                    </div>
                </a>
            </div>
        `;
        
        relatedProductsContainer.appendChild(col);
    });
}