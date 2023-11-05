// JavaScript

// Function to open the modal
function openModal() {
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modalText");

    modal.style.display = "block";

    // The simplified and professional text with styles
    modalText.innerHTML = `
        <h1>Zentro - Innovative Food Ordering</h1>
        <p>Zentro is an advanced cloud kitchen system developed by Team Anonymous, designed to offer professional and efficient food ordering experiences. With Zentro, you can easily order delicious cuisine from the comfort of your home, thanks to our innovative full-stack solution.</p>

        <h2>Key Features:</h2>
        <ul style="list-style-type: disc; margin-left: 20px; color: #555; font-size: 16px; line-height: 1.5;">
    <li>Easy Ordering: Zentro simplifies the ordering process, allowing you to browse a diverse menu, customize your orders, and complete the checkout with a few clicks.</li>
    <li>Diverse Cuisine: We bring a variety of culinary options to your doorstep, including Italian, Chinese, Indian, and more.</li>
    <li>Optimized Delivery: Our delivery network ensures timely and secure food deliveries. By partnering with top delivery services, we guarantee that your food arrives hot and fresh, even during peak demand.</li>
    <li>Virtual Food Brands: Zentro enables food entrepreneurs to create and launch virtual food brands within our ecosystem. This feature allows for culinary innovation and meets various market demands.</li>
    <li>Advanced Kitchen Infrastructure: Our cloud kitchens are equipped with state-of-the-art culinary tools and technology, ensuring that food is prepared with the utmost care and quality.</li>
    <li>User-Focused App: The Zentro app is designed with productivity in mind. Users can easily manage their orders, track deliveries, and access a loyalty program, all within a user-friendly interface.</li>
    <li>Smart Recommendations: Our AI-driven recommendation engine suggests dishes based on your past orders and preferences, making decision-making easier and more efficient.</li>
    <li>Real-Time Order Tracking: Zentro provides real-time order tracking so that users can keep an eye on their deliveries and plan their time effectively.</li>
    <li>Payment Security: We prioritize the security of your financial information. Zentro supports multiple payment options, and all transactions are encrypted to ensure user data safety.</li>
    <li>Customer Support: Our dedicated customer support team is available 24/7 to address any concerns or inquiries promptly.</li>
</ul>


        <p>In a fast-paced world, Zentro stands as a leader in the food industry, providing professional and productivity-driven solutions. Join us on this culinary journey and experience the future of food ordering. Taste the convenience with Zentro!</p>
    `;
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Event listeners
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModal");

openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);