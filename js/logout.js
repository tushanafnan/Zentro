document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase after including the configuration
    firebase.initializeApp(firebaseConfig);

    // Assuming your logout link has an ID of 'logoutLink'
    const logoutLink = document.getElementById('logoutLink');

    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default behavior of the anchor link
            firebase.auth().signOut().then(function() {
                console.log('User signed out successfully.');
                // Redirect to index.html after signing out
                window.location.href = '/index.html';
            }).catch(function(error) {
                console.error('Error signing out:', error.message);
            });
        });
    } else {
        console.error('Logout link not found.');
    }
});