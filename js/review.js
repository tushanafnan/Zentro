document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase after including the configuration
    firebase.initializeApp(firebaseConfig);

    const reviewsRef = firebase.database().ref('reviews');
    const menuRef = firebase.database().ref('menu'); // Assuming 'menu' is the collection containing menu items
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');
    const menuItemDropdown = document.getElementById('menuItem');

    // Fetch menu items from Firebase and populate the dropdown
    function fetchMenuItems() {
        menuRef.once('value')
            .then(snapshot => {
                const menuItems = snapshot.val();

                // Populate the dropdown with menu items
                for (const itemId in menuItems) {
                    const itemName = menuItems[itemId].name;
                    const option = document.createElement('option');
                    option.value = itemId;
                    option.textContent = itemName;
                    menuItemDropdown.appendChild(option);
                }
            })
            .catch(error => {
                console.error('Error fetching menu items:', error.message);
            });
    }

    fetchMenuItems();

    // Submit review form
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const stars = document.getElementById('stars').value;
        const menuItemId = menuItemDropdown.value;

        reviewsRef.push({
            name: name,
            stars: stars,
            menuItemId: menuItemId,
        });

        // Clear form fields
        reviewForm.reset();
    });

    // Display reviews
    reviewsRef.on('value', function(snapshot) {
        reviewsList.innerHTML = '';
        snapshot.forEach(function(childSnapshot) {
            const review = childSnapshot.val();
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('col-md-4', 'mb-4');

            reviewElement.innerHTML = `
                <div class="card mb-3" style="width: 15rem; height: 180px;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${review.name}</h5>
                        <p class="card-text"><strong>Item:</strong> ${getMenuItemName(review.menuItemId)}</p>
                        <p class="card-text"><strong>Rating:</strong> ${getStarsHtml(review.stars)}</p>
                    </div>
                </div>
            `;

            reviewsList.appendChild(reviewElement);
        });
    });

    // Function to generate star icons
    function getStarsHtml(stars) {
        const starIcons = '<i class="fas fa-star stars"></i>'.repeat(stars);
        const emptyStarIcons = '<i class="far fa-star stars"></i>'.repeat(5 - stars);
        return `${starIcons}${emptyStarIcons}`;
    }

    // Function to get menu item name by ID
    function getMenuItemName(itemId) {
        const menuItem = menuItemDropdown.querySelector(`option[value="${itemId}"]`);
        return menuItem ? menuItem.textContent : 'Unknown Item';
    }
});