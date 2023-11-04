// Get references to the button and the modal
const openModalButton = document.getElementById("open-modal-button");
const modal = document.getElementById("modal-alert");

// Function to open the modal
function openModal() {
    modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
    modal.style.display = "none";
}

// Add a click event listener to the button to open the modal
openModalButton.addEventListener("click", openModal);

// Add a click event listener to the close button in the modal to close it
document.getElementById("modal-button-primary").addEventListener("click", closeModal);