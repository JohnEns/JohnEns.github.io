"use strict";

(function onLoad() {
	// Regex codes for input validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const phoneRegex = /^(\+31|0)(6[\-]?\d{8})$/;

  document.querySelectorAll(".nav-list a").forEach((link) => {
    const linkPath = link.getAttribute("href").replace(/\/$/, "");
    const currentPath = window.location.pathname.replace(/\/$/, "");

// Dev check data
    console.log(linkPath);
    console.log(currentPath);

  // Assigns the 'active' class to the navigational links
    if (currentPath.endsWith(linkPath)) {
      link.classList.add("active");
    }
  });
  
  
  let contactForm = document.getElementById("form-contact");

// Check if on contact page
  if (contactForm) {
    contactForm.addEventListener("submit", function onSubmit(event) {
      event.preventDefault();

// Select error msgs  
      const errorMessageMail = document.getElementById("error-message-mail");
      const errorMessagePhone = document.getElementById("error-message-phone");

// Make errors invisible
      errorMessageMail.style.display = errorMessagePhone.style.display = "none";

// Get input
      let emailInput = document.getElementById("email").value;
      let phoneInput = document.getElementById("phone").value;

// Check input email
      if (emailRegex.test(emailInput)) {
        errorMessageMail.style.display = "none";
      } else {
        errorMessageMail.style.display = "block";
      }

// Check input phone number
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
})();

  