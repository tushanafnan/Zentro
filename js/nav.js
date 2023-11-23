var navbarToggler = document.querySelector('.custom-navbar-toggler');
var navbar = document.querySelector('.custom-navbar');

navbarToggler.addEventListener('click', function() {
    navbar.classList.toggle('active');
});