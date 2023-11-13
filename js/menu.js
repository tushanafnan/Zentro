document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase after including the configuration
    firebase.initializeApp(firebaseConfig);

    // Reference to the Firebase Realtime Database
    const database = firebase.database();
    const menuRef = database.ref('menu');
    const ordersRef = database.ref('orders');

    // Get the container where menu items will be displayed
    const menuItemsContainer = document.getElementById('menu-items');
    const cartItemsList = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Initialize the cart as an empty array
    let cart = [];

    // Listen for changes in the menu and update the UI
    menuRef.on('value', (snapshot) => {
        const menuItems = snapshot.val();
        // Store the menu globally so it's accessible in other functions
        menu = menuItems;
        renderMenu(menuItems);
    });

    // Function to render the menu
    function renderMenu(menuItems) {
        menuItemsContainer.innerHTML = '';

        for (const itemId in menuItems) {
            const item = menuItems[itemId];
            const menuItemElement = document.createElement('div');
            menuItemElement.className = 'col-md-6 col-sm-6';
            menuItemElement.innerHTML = `
            <h4>${item.name}</h4>
            <h3><span>$${item.price.toFixed(2)}</span></h3>
            <h5>${item.description}</h5>
            <p class="card-text"><strong>Rating:</strong> ${getStarsHtml(item.stars)}</p>
            <button class="add-to-cart-btn" data-id="${itemId}">Add to Cart</button>
            <a href="/stracture/review.html"><button class="add-to-cart-btn">Review</button></a>
        `;
            menuItemsContainer.appendChild(menuItemElement);
        }

        // Add event listeners for "Add to Cart" buttons
        addToCartButtons.forEach(button => {
            button.removeEventListener('click', addToCart); // Remove existing event listeners
            button.addEventListener('click', addToCart);
        });
    }

    // Function to add an item to the cart
    function addToCart(event) {
        const itemId = event.target.dataset.id;
        const selectedItem = menu[itemId];

        // Check if the item is already in the cart
        const existingCartItem = cart.find(item => item.id === itemId);

        if (existingCartItem) {
            // If the item is already in the cart, increase the quantity
            existingCartItem.quantity++;
        } else {
            // If the item is not in the cart, add it with quantity 1
            cart.push({
                id: itemId,
                name: selectedItem.name,
                price: selectedItem.price,
                quantity: 1
            });
        }

        // Update the cart UI
        renderCart();
    }

    // Add event listener for "Add to Cart" buttons
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-to-cart-btn')) {
            addToCart(event);
        }
    });

    // Function to render the cart
    // Function to render the cart
    function renderCart() {
        // Get the cart items list container
        const cartItemsList = document.getElementById('cart-items');

        if (!cartItemsList) {
            console.error('Error: Cart items list element not found.');
            return;
        }

        // Clear the existing content
        cartItemsList.innerHTML = '';

        // Initialize total items and total price
        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            const cartItemElement = document.createElement('li');
            cartItemElement.textContent = `${item.name} - $${(item.price * item.quantity).toFixed(2)} x${item.quantity}`;
            cartItemsList.appendChild(cartItemElement);

            // Update total items and total price
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        // Update the order summary in real-time
        const totalItemsElement = document.getElementById('total-items');
        const totalPriceElement = document.getElementById('total-price');

        if (!totalItemsElement || !totalPriceElement) {
            console.error('Error: Total items or total price element not found.');
            return;
        }

        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2);

        // Enable or disable the checkout button based on the cart content
        checkoutBtn.disabled = cart.length === 0;
    }


    // Add this line to get the clear cart button element
    const clearCartBtn = document.getElementById('clear-cart-btn');

    // Add event listener for the "Clear Cart" button
    clearCartBtn.addEventListener('click', clearCart);

    // Function to clear the cart
    function clearCart() {
        // Clear the cart array
        cart = [];

        // Update the cart UI
        renderCart();
    }

    // Function to render the cart
    function renderCart() {
        cartItemsList.innerHTML = '';

        // Initialize total items and total price
        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            const cartItemElement = document.createElement('li');
            cartItemElement.textContent = `${item.name} - $${(item.price * item.quantity).toFixed(2)} x${item.quantity}`;
            cartItemsList.appendChild(cartItemElement);

            // Update total items and total price
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        // Update the order summary in real-time
        const totalItemsElement = document.getElementById('total-items');
        const totalPriceElement = document.getElementById('total-price');

        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2);

        // Enable or disable the checkout button based on the cart content
        checkoutBtn.disabled = cart.length === 0;
    }



    // Event listener for the checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    function checkout() {
        // Check if the cart is not empty
        if (cart.length === 0) {
            alert('Your cart is empty. Add items before checking out.');
            return;
        }

        // Get the total amount and total items in the cart
        const totalAmount = calculateTotal(cart).toFixed(2);
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

        // Create a new order in the Firebase Realtime Database
        const newOrderRef = ordersRef.push();

        // Get the current date and time
        const timestamp = firebase.database.ServerValue.TIMESTAMP;

        // Create an order object with cart details
        const order = {
            timestamp: timestamp,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: totalAmount
        };

        // Set the order data in the database
        newOrderRef.set(order)
            .then(() => {
                // Successful order creation
                console.log('Order placed successfully:', order);

                // Clear the cart after checkout
                cart = [];
                renderCart();

                // Display order summary
                alert(`Order placed successfully!\nTotal Items: ${totalItems}\nTotal Amount: $${totalAmount}`);
            })
            .catch(error => {
                // Handle errors
                console.error('Error placing order:', error.message);
                alert('Error placing order. Please try again.');
            });
    }

    // Function to calculate the total cost of items in the cart
    function calculateTotal(cart) {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function getStarsHtml(stars) {
        const starIcons = '<i class="fas fa-star stars"></i>'.repeat(stars);
        const emptyStarIcons = '<i class="far fa-star stars"></i>'.repeat(5 - stars);
        return `${starIcons}${emptyStarIcons}`;
    }
});