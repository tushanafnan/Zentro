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
        ordersRef.orderByChild('userId').equalTo(userId).on('value', async function(snapshot) {
            orderDetailsContainer.innerHTML = ''; // Clear previous order details

            if (snapshot.exists()) {
                const promises = [];

                snapshot.forEach(async function(childSnapshot) {
                    const order = childSnapshot.val();
                    console.log('Order Data:', order);

                    // Set default order status to "Preparing" if undefined
                    const orderStatus = order.status || 'Preparing';
                    // Check if the buttons are disabled and update UI accordingly
                    const cancelDisabled = order.disabledButtons && order.disabledButtons.cancelOrder;
                    const receivedDisabled = order.disabledButtons && order.disabledButtons.markAsReceived;
                    const orderTime = new Date(order.timestamp).toLocaleString();

                    // Fetch additional user details from the "users" collection
                    const userRef = firebase.database().ref('users').child(userId);
                    const userData = (await userRef.once('value')).val();
                    console.log('User Data:', userData);

                    const orderElement = document.createElement('div');
                    orderElement.id = childSnapshot.key; // Set a unique ID for the order element
                    orderElement.className = 'card mb-3 bg-light-opacity';
                    orderElement.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">Order ID: ${childSnapshot.key}</h5>
                            <p class="card-text"><strong>Customer Name:</strong> ${userData.name}</p>
                            <p class="card-text"><strong>Customer Address:</strong> ${userData.address}</p>
                            <p class="card-text"><strong>Customer City:</strong> Dalian </p>
                            <p class="card-text"><strong>Customer Phone:</strong> ${userData.phone}</p>
                            <p class="card-text"><strong>Total Items:</strong> ${order.items.length}</p>
                            <p class="card-text"><strong>Total Price:</strong> $${order.total}</p>
                            <p class="card-text"><strong>Order Time:</strong> ${orderTime}</p>

                            <p class="card-text order-status" ><strong>Order Status: </strong> <strong style="color: ${getStatusColor(orderStatus)};"> ${orderStatus} </strong></p>
                            <h6 class="card-subtitle mb-2 text-muted">Ordered Items:</h6>
                        </div>
                    `;

                    orderDetailsContainer.appendChild(orderElement);

                    const orderedItemsList = document.createElement('ul');
                    orderedItemsList.className = 'list-group list-group-flush';

                    order.items.forEach(item => {
                        const orderedItemElement = document.createElement('li');
                        orderedItemElement.className = 'list-group-item bg-light-opacity';
                        orderedItemElement.innerHTML = `
                            <p><strong>${item.name}</strong></p>
                            <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                            <p><strong>Quantity:</strong> ${item.quantity}</p>
                        `;
                        orderedItemsList.appendChild(orderedItemElement);
                    });

                    orderElement.appendChild(orderedItemsList);

                    // Add "Cancel Order" and "Received" buttons with disabled status
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'mb-3';
                    buttonContainer.innerHTML = `
                        <button class="btn btn-danger cancel-order-btn" data-order-id="${childSnapshot.key}" ${cancelDisabled ? 'disabled' : ''}>Cancel Order</button>
                        <button class="btn btn-success received-btn" data-order-id="${childSnapshot.key}" ${receivedDisabled ? 'disabled' : ''}>Received</button>
                        <button class="btn btn-warning delete-order-btn" data-order-id="${childSnapshot.key}">Delete Order</button>
                    `;
                    orderElement.appendChild(buttonContainer);
                });

                // Wait for all promises to resolve before doing anything else
                await Promise.all(promises);
            } else {
                orderDetailsContainer.innerHTML = '<p>No orders found.</p>';
            }
        });
    } else {
        alert("No User Found, Please Login First!");

        // Move to login after 1 second
        setTimeout(() => {
            window.location.href = '/stracture/login.html';
        }, 1000);
    }
});

// Add event listeners for the buttons dynamically
document.addEventListener('click', async function(event) {
    if (event.target && event.target.classList.contains('cancel-order-btn')) {
        const orderId = event.target.dataset.orderId;
        await cancelOrder(orderId);
    } else if (event.target && event.target.classList.contains('received-btn')) {
        const orderId = event.target.dataset.orderId;
        await markAsReceived(orderId);
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

// Function to delete an order from both UI and database
async function deleteOrder(orderId) {
    const orderRef = ordersRef.child(orderId);

    if (confirm('Are you sure you want to delete this order?')) {
        // Remove the order data from the database
        await orderRef.remove()
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

// Function to update the order status in the database and disable buttons in the UI
async function updateOrderStatusAndDisableButtons(orderId, newStatus) {
    const orderRef = ordersRef.child(orderId);
    const buttonsToDisable = { cancelOrder: true, markAsReceived: true };
    await orderRef.update({ status: newStatus, disabledButtons: buttonsToDisable });
    disableButtonsLocally(orderId, newStatus);
}

// Function to cancel an order
async function cancelOrder(orderId) {
    await updateOrderStatusAndDisableButtons(orderId, 'Cancelled');
}

// Function to mark an order as received
async function markAsReceived(orderId) {
    await updateOrderStatusAndDisableButtons(orderId, 'Delivered');
}

// Function to update the order status in the UI and database
async function updateOrderStatusLocally(orderId, newStatus) {
    const orderRef = ordersRef.child(orderId);
    await orderRef.update({ status: newStatus });

    const orderElement = document.getElementById(orderId);
    if (orderElement) {
        const statusElement = orderElement.querySelector('.order-status');
        if (statusElement) {
            // Change color based on the new status
            statusElement.style.color = getStatusColor(newStatus);
            // Disable buttons based on the new status
            disableButtonsLocally(orderId, newStatus);

            // Update the status text in the UI
            statusElement.innerText = `Order Status: ${newStatus}`;
        }
    }
}

// Function to disable buttons locally based on the order status
function disableButtonsLocally(orderId, status) {
    const orderElement = document.getElementById(orderId);
    if (orderElement) {
        const cancelBtn = orderElement.querySelector('.cancel-order-btn');
        const receivedBtn = orderElement.querySelector('.received-btn');

        if (cancelBtn) {
            cancelBtn.disabled = status !== 'Preparing'; // Disable if not in 'Preparing' status
        }
        if (receivedBtn) {
            receivedBtn.disabled = status !== 'Preparing'; // Disable if not in 'Preparing' status
        }
    }
}