"use strict";

//Selecteer alle nav links
const headerNav = document.querySelector("header .nav");
const links = headerNav.querySelectorAll(".nav-list a");
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const phoneRegex = /^(\+31|0)(6[\-]?\d{8})$/;

//  Test voor code
// console.log(links);
// console.log(links[1].href);
// console.log(links[1].baseURI);

for (let i = 0; i < links.length; i++) {
  if (links[i].href === links[i].baseURI) {
    links[i].classList.add("active");
    break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  // Registreer de pagina in de console
  console.log(`De gebruiker bevindt zich op: ${currentPath}`); //check of t klopt

  // Controleer juiste pagina om elementen te kunnen selecteren
  if (currentPath === "/contact.html") {
    // Eerst de errors selecteren
    const errorMessageMail = document.getElementById("error-message-mail");
    const errorMessagePhone = document.getElementById("error-message-phone");

    // Check of je de elementen hebt
    console.log(errorMessageMail);
    console.log(errorMessagePhone);

    // Error meldingen uitzetten
    errorMessageMail.style.display = errorMessagePhone.style.display = "none";

    document
      .getElementById("form-contact")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        let emailInput = document.getElementById("email").value;
        let phoneInput = document.getElementById("phone").value;

        // Test de gevoelige input.Iniden nodig : error!
        if (emailRegex.test(emailInput)) {
          errorMessageMail.style.display = "none";
        } else {
          errorMessageMail.style.display = "block";
        }

        if (phoneRegex.test(phoneInput)) {
          errorMessagePhone.style.display = "none";
        } else {
          errorMessagePhone.style.display = "block";
        }

        if (emailRegex.test(emailInput) && phoneRegex.test(phoneInput)) {
          alert("Formulier succesvol verzonden!");
        }
      });
  }
});
