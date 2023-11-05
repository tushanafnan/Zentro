const openModalButton = document.getElementById("openModalButton");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalContent = document.getElementById("modal-content");

openModalButton.addEventListener("click", function() {
    modal.style.display = "block";
    // Add your sentences here
    modalContent.innerHTML = "This is a sample sentence. ".repeat(50);
});

closeModal.addEventListener("click", function() {
    modal.style.display = "none";
});