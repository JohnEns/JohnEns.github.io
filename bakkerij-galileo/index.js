"use strict";

(function onLoad() {
	// Regex codes for input validation
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	const phoneRegex = /^(\+31|0)(6[\-]?\d{8})$/;

	const links = document.querySelectorAll(".nav-list a");

	links.forEach((link) => {
		const linkPath = link.getAttribute("href").replace(/\/$/, "");
		const currentPath = window.location.pathname.replace(/\/$/, "");

		// Dev check data
		// console.log(linkPath);
		// console.log(currentPath);

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

		const form = document.getElementById("form");
	}

	// Hamburger mobiel
	const hamMenu = document.querySelector(".ham-menu");
	const offScreenMenu = document.querySelector(".off-screen-menu");

	hamMenu.addEventListener("click", () => {
		hamMenu.classList.toggle("active");
		offScreenMenu.classList.toggle("active");
	});

	// Check of form input heeft
	function isFormUsed(form) {
		const inputs = form.querySelectorAll("input");
		return Array.from(inputs).some((input) => input.value.trim() !== "");
	}

	// Stop de hyperlink als er input in de form is
	links.forEach((link) => {
		link.addEventListener("click", function (event) {
			if (isFormUsed(form)) {
				const confirmation = confirm(
					"U heeft niet-opgeslagen data in dit formulier. Weet u zeker dat u de pagina wilt verlaten? "
				);
				if (!confirmation) {
					event.preventDefault();
				}
			}
		});
	});
})();
