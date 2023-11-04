document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signup-form");
    const signupMessage = document.getElementById("signup-message");

    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Retrieve user input
        const name = document.getElementById("name").value;
        const username = document.getElementById("signup-username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("signup-password").value;
        const phone = document.getElementById("phone").value;

        // Create an object with the user's data
        const userData = {
            username,
            email
        };

        // Fetch the existing user data from the JSON file
        fetch('users.json')
            .then(response => response.json())
            .then(data => {
                // Add the new user data to the existing array
                data.users.push(userData);

                // Update the JSON file with the new data
                return fetch('./users.json', {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(() => {
                signupMessage.textContent = "Sign-up successful!";
            })
            .catch(error => {
                signupMessage.textContent = "An error occurred while signing up.";
            });
    });
});