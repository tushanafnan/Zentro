// Initialize Firebase after including the configuration
firebase.initializeApp(firebaseConfig);

// Get references to the login form elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('login-form');
const message = document.getElementById('message');

// Add an event listener to the form for login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Sign in with email and password
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User is signed in.
            const user = userCredential.user;

            // Redirect to the dashboard or perform other actions
            window.location.href = '/stracture/dashboard.html';
        })
        .catch((error) => {
            // Handle errors here (e.g., display an error message)
            const errorCode = error.code;
            const errorMessage = error.message;
            message.textContent = `Login Error: ${errorMessage}`;
        });
});