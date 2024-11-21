"use strict";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const phoneRegex = /^(\+31|0)(6[\-]?\d{8})$/;

document.querySelectorAll(".nav-list a").forEach((link) => {
  const linkPath = link.getAttribute("href").replace(/\/$/, "");
  const currentPath = window.location.pathname.replace(/\/$/, "");

  console.log(linkPath);
  console.log(currentPath);

  if (linkPath === currentPath) {
    link.classList.add("active");
  }
});

document
  .getElementById("form-contact")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const errorMessageMail = document.getElementById("error-message-mail");
    const errorMessagePhone = document.getElementById("error-message-phone");

    errorMessageMail.style.display = errorMessagePhone.style.display = "none";

    let emailInput = document.getElementById("email").value;
    let phoneInput = document.getElementById("phone").value;

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
