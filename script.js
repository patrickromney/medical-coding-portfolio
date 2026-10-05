// ==========================================
// Patrick Romney K. Madrid
// Medical Billing & Coding Portfolio
// JavaScript Interactions
// ==========================================


// ------------------------------------------
// Initialize Lucide Icons
// ------------------------------------------

lucide.createIcons();


// ------------------------------------------
// Dynamic Copyright Year
// ------------------------------------------

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// ------------------------------------------
// Mobile Navigation
// ------------------------------------------

const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuBtn && mobileMenu) {

    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });

}


// ------------------------------------------
// Close Mobile Menu When Link Is Clicked
// ------------------------------------------

document.querySelectorAll(".mobile-link").forEach(link => {

    link.addEventListener("click", () => {

        if (mobileMenu) {
            mobileMenu.classList.add("hidden");
        }

    });

});


// ------------------------------------------
// Coursework Filter
// ------------------------------------------

const courseFilterButtons = document.querySelectorAll(".course-tab-btn");
const courses = document.querySelectorAll(".course-card");


function filterCourses(category) {

    // Reset all buttons
    courseFilterButtons.forEach(button => {

        button.className =
            "course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold " +
            "bg-white text-slate-600 hover:bg-slate-200 transition-all border border-slate-200";

    });


    // Activate selected button
    const activeButton = document.getElementById(`btn-${category}`);

    if (activeButton) {

        activeButton.className =
            "course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold " +
            "bg-navy-900 text-white transition-all shadow-sm";

    }


    // Filter courses
    courses.forEach(course => {

        if (category === "all") {

            course.classList.remove("hidden");

        }

        else if (category === "completed") {

            if (course.classList.contains("completed-course")) {
                course.classList.remove("hidden");
            } else {
                course.classList.add("hidden");
            }

        }

        else if (category === "upcoming") {

            if (course.classList.contains("upcoming-course")) {
                course.classList.remove("hidden");
            } else {
                course.classList.add("hidden");
            }

        }

    });

}


// ------------------------------------------
// Coursework Filter Button Events
// ------------------------------------------

courseFilterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category = button.dataset.category;

        filterCourses(category);

    });

});


// ------------------------------------------
// Contact Form
// ------------------------------------------

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", handleFormSubmit);

}


function handleFormSubmit(event) {

    event.preventDefault();


    const feedbackBox = document.getElementById("form-feedback");

    const nameInput = document.getElementById("sender-name");

    const name = nameInput ? nameInput.value.trim() : "there";


    if (!feedbackBox) {
        return;
    }


    // Show success message
    feedbackBox.className =
        "mt-4 p-4 rounded-xl text-xs font-medium text-center " +
        "bg-teal-50 text-teal-800 border border-teal-200 block";


    feedbackBox.textContent =
        `Thank you, ${name}! Your message has been prepared. ` +
        "Since this is a static showcase portfolio, please also reach Patrick directly via Email or Phone!";


    // Reset form
    contactForm.reset();


    // Hide feedback after 8 seconds
    setTimeout(() => {

        feedbackBox.classList.add("hidden");

    }, 8000);

}