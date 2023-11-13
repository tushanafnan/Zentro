document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase after including the configuration
    firebase.initializeApp(firebaseConfig);

    // Assuming your logout button has an ID of 'logoutBtn'
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            firebase.auth().signOut().then(function() {
                console.log('User signed out successfully.');
                // Redirect to index.html after signing out
                window.location.href = '/index.html';
            }).catch(function(error) {
                console.error('Error signing out:', error.message);
            });
        });
    } else {
        console.error('Logout button not found.');
    }
});