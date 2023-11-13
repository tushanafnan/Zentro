// Initialize Firebase after including the configuration
firebase.initializeApp(firebaseConfig);
const ordersRef = firebase.database().ref('orders');
const orderDetailsContainer = document.getElementById('order-details');

// Add an onAuthStateChanged listener to handle changes in authentication state
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, retrieve the user ID
        const userId = user.uid;
        console.log('Authenticated User ID:', userId);

        // Retrieve and display order details for the user
        ordersRef.orderByChild('userId').equalTo(userId).on('value', function(snapshot) {
            orderDetailsContainer.innerHTML = ''; // Clear previous order details

            if (snapshot.exists()) {
                snapshot.forEach(function(childSnapshot) {
                    const order = childSnapshot.val();
                    console.log('Order Data:', order);

                    // Set default order status to "Preparing" if undefined
                    const orderStatus = order.status || 'Preparing';

                    const orderElement = document.createElement('div');
                    orderElement.id = childSnapshot.key; // Set a unique ID for the order element
                    orderElement.className = 'card mb-3';
                    orderElement.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">Order ID: ${childSnapshot.key}</h5>
                            <p class="card-text"><strong>Total Items:</strong> ${order.items.length}</p>
                            <p class="card-text"><strong>Total Price:</strong> $${order.total}</p>
                            <p class="card-text" style="color: ${getStatusColor(orderStatus)};"><strong>Order Status:</strong> ${orderStatus}</p>
                            <h6 class="card-subtitle mb-2 text-muted">Ordered Items:</h6>
                        </div>
                    `;
                    orderDetailsContainer.appendChild(orderElement);

                    const orderedItemsList = document.createElement('ul');
                    orderedItemsList.className = 'list-group list-group-flush';

                    order.items.forEach(item => {
                        const orderedItemElement = document.createElement('li');
                        orderedItemElement.className = 'list-group-item';
                        orderedItemElement.innerHTML = `
                            <p><strong>${item.name}</strong></p>
                            <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                            <p><strong>Quantity:</strong> ${item.quantity}</p>
                        `;
                        orderedItemsList.appendChild(orderedItemElement);
                    });

                    orderElement.appendChild(orderedItemsList);

                    // Add "Cancel Order" and "Received" buttons
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'mb-3';
                    buttonContainer.innerHTML = `
                        <button class="btn btn-danger cancel-order-btn" data-order-id="${childSnapshot.key}">Cancel Order</button>
                        <button class="btn btn-success received-btn" data-order-id="${childSnapshot.key}">Received</button>
                        <button class="btn btn-warning delete-order-btn" data-order-id="${childSnapshot.key}">Delete Order</button>
                    `;
                    orderElement.appendChild(buttonContainer);
                });
            } else {
                orderDetailsContainer.innerHTML = '<p>No orders found.</p>';
            }
        });
    } else {
        // No user is signed in, handle accordingly (redirect to login, show a message, etc.)
        console.log('No user is signed in');
    }
});

// Add event listeners for the buttons dynamically
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('cancel-order-btn')) {
        cancelOrder(event.target.dataset.orderId);
    } else if (event.target && event.target.classList.contains('received-btn')) {
        markAsReceived(event.target.dataset.orderId);
    } else if (event.target && event.target.classList.contains('delete-order-btn')) {
        deleteOrder(event.target.dataset.orderId);
    }
});

// Function to get status color based on order status
function getStatusColor(status) {
    switch (status) {
        case 'Preparing':
            return 'blue';
        case 'Delivered':
            return 'green';
        case 'Cancelled':
            return 'red';
        default:
            return 'black';
    }
}

function deleteOrder(orderId) {
    const orderRef = ordersRef.child(orderId);

    if (confirm('Are you sure you want to delete this order?')) {
        // Remove the order data from the database
        orderRef.remove()
            .then(() => {
                console.log('Order deleted successfully.');

                // Remove the order details from the UI immediately
                const orderElement = document.getElementById(orderId);
                if (orderElement) {
                    orderElement.remove();
                } else {
                    console.warn('Order element not found in the UI.');
                }
            })
            .catch((error) => {
                console.error('Error deleting order:', error.message);
            });
    }
}

// Function to update the order status in the database
function updateOrderStatus(orderId, newStatus) {
    const orderRef = ordersRef.child(orderId);
    orderRef.update({ status: newStatus });
}

// Function to cancel an order
function cancelOrder(orderId) {
    updateOrderStatus(orderId, 'Cancelled');
}

// Function to mark an order as received
function markAsReceived(orderId) {
    updateOrderStatus(orderId, 'Delivered');
}