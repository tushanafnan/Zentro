// Initialize Firebase after including the configuration
firebase.initializeApp(firebaseConfig);

// Get references to the sign-up form elements
const nameInput = document.getElementById('name');
const addressInput = document.getElementById('signup-address');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('signup-password');
const phoneInput = document.getElementById('phone');
const signupForm = document.getElementById('signup-form');
const signupMessage = document.getElementById('signup-message');

// Add an event listener to the form for sign-up
signupForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const name = nameInput.value;
    const address = addressInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const phone = phoneInput.value;

    try {
        // Sign up with email and password
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

        // User is signed up.
        const user = userCredential.user;

        // Get the current count of users
        const usersRef = firebase.database().ref('users');
        const snapshot = await usersRef.once('value');
        // Store additional user data in Firebase Realtime Database with a custom index
        const newUserRef = usersRef.child(user.uid);
        await newUserRef.set({
            name: name,
            address: address,
            email: email,
            phone: phone,
            // Add other user data as needed
        });

        // Redirect to the dashboard or perform other actions
        window.location.href = '/stracture/dashboard.html';
    } catch (error) {
        // Handle errors here (e.g., display an error message)
        const errorCode = error.code;
        const errorMessage = error.message;
        signupMessage.textContent = `Sign-up Error: ${errorMessage}`;
    }
});