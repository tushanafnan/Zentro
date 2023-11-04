document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    const message = document.getElementById("message");

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Retrieve user input
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Fetch user data from the JSON file
        fetch('/User/users.json')
            .then(response => response.json())
            .then(data => {
                const users = data.users;
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    // Redirect to the dashboard on successful login
                    window.location.href = "/stracture/dashboard.html";
                } else {
                    message.textContent = "Login failed. Please check your username and password.";
                }
            })
            .catch(error => {
                message.textContent = "An error occurred while fetching user data.";
            });
    });
});