
// SYAELIXORA - JAVASCRIPT FEATURES

document.addEventListener("DOMContentLoaded", () => {

    // 1. DARK / LIGHT THEME
    const themeToggle = document.getElementById("theme-toggle");

    function setTheme(light) {
        document.body.classList.toggle("light-mode", light);
        themeToggle.textContent = light ? "☾" : "☀";
        themeToggle.setAttribute(
            "aria-label",
            light ? "Switch to dark mode" : "Switch to light mode"
        );
        try {
            localStorage.setItem("syaelixora-theme", light ? "light" : "dark");
        } catch (error) {
            console.warn("Theme preference could not be saved.");
        }
    }

    let savedTheme = "dark";
    try {
        savedTheme = localStorage.getItem("syaelixora-theme") || "dark";
    } catch (error) {
        // The website still works without saved preferences.
    }

    setTheme(savedTheme === "light");

    themeToggle.addEventListener("click", () => {
        setTheme(!document.body.classList.contains("light-mode"));
    });


    // 2. MOBILE NAVIGATION
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "×" : "☰";
    });

    // Close mobile menu using Escape
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        }
    });

// Close mobile menu when clicking outside
    document.addEventListener("click", function(event) {
        if (!navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)) {

            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        }
    });

    // 3. SMOOTH INTERNAL NAVIGATION
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener("click", event => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "instant"
                    : "smooth"
            });

            history.replaceState(null, "", `#${target.id}`);

            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });


    // 4. ACTIVE NAVIGATION HIGHLIGHT
    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll(".nav-link");

    function updateActiveNavigation() {
        let currentSection = "home";

        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= 160) {
                currentSection = section.id;
            }
        });

        navigationLinks.forEach(link => {
            const active = link.getAttribute("href") === `#${currentSection}`;
            link.classList.toggle("active", active);

            if (active) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavigation, { passive: true });
    updateActiveNavigation();


    // 5. ANIMATED TYPING TEXT
    const typingText = document.getElementById("typing-text");

    const typingWords = [
        "Computer Science Student",
        "Network Computing Enthusiast",
        "Creative Problem Solver",
        "Future Tech Professional"
    ];

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeEffect() {
            const currentWord = typingWords[wordIndex];

            if (deleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            typingText.textContent = currentWord.substring(0, charIndex);

            let delay = deleting ? 55 : 100;

            if (!deleting && charIndex === currentWord.length) {
                deleting = true;
                delay = 1700;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % typingWords.length;
                delay = 400;
            }

            setTimeout(typeEffect, delay);
        }

        typeEffect();
    }


    // 6 & 7. PROJECT FILTERING AND SEARCH
    const searchInput = document.getElementById("project-search");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const noResults = document.getElementById("no-results");

    let selectedCategory = "all";

    function filterProjects() {
        const searchValue = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        projectCards.forEach(card => {
            const category = card.dataset.category;
            const content = card.textContent.toLowerCase();

            const matchesCategory =
                selectedCategory === "all" || category === selectedCategory;

            const matchesSearch = content.includes(searchValue);
            const show = matchesCategory && matchesSearch;

            card.hidden = !show;

            if (show) visibleCount++;
        });

        noResults.hidden = visibleCount !== 0;
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            selectedCategory = button.dataset.filter;
            filterProjects();
        });
    });

    searchInput.addEventListener("input", filterProjects);


    // 8. CONTACT FORM VALIDATION
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    // Replace this with your real email address.
    const portfolioEmail = "yourname@example.com";

    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !message) {
            formStatus.textContent = "Please complete all fields.";
            return;
        }

        if (!emailPattern.test(email)) {
            formStatus.textContent = "Please enter a valid email address.";
            return;
        }

        if (portfolioEmail === "yourname@example.com") {
            formStatus.textContent = "Portfolio email has not been configured yet.";
            return;
        }

        const subject = encodeURIComponent(`Portfolio Message from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        const mailtoLink =
            `mailto:${portfolioEmail}?subject=${subject}&body=${body}`;

        formStatus.textContent =
            "Your email application will open. Please send the message there.";

        window.location.href = mailtoLink;
    });


    // 9. BACK TO TOP BUTTON
    const backToTop = document.getElementById("back-to-top");

    function updateBackToTop() {
        const visible = window.scrollY > 400;
        backToTop.classList.toggle("visible", visible);
        backToTop.tabIndex = visible ? 0 : -1;
    }

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth"
        });
    });


    // 10. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }


    // BONUS: PROJECT DETAILS POPUP
    const projectDetails = {
        climate: {
            title: "Climate Learning & Quiz Application",
            description:
                "A Java educational application that introduces climate-related topics through learning modules and interactive quizzes. The project includes question handling, score tracking and user interaction."
        },
        fitness: {
            title: "Fitness Club Management System",
            description:
                "A Python and SQLite command-line application designed to manage club information, including members, trainers, programmes, classes, payments and reporting."
        },
        auction: {
            title: "Online Auction Database",
            description:
                "A relational database project using SQL to organize users, items, bids, orders and payments. It demonstrates database relationships and CRUD operations."
        },
        network: {
            title: "Office Network Design",
            description:
                "A network design proposal for an organization with multiple office areas. It explores wired and wireless networking, device connectivity and infrastructure planning."
        },
        homepage: {
            title: "Personal Homepage Website",
            description:
                "A beginner-friendly personal website developed using HTML, CSS and JavaScript to present education, interests and background information."
        }
    };

    const projectDialog = document.getElementById("project-dialog");
    const dialogTitle = document.getElementById("dialog-title");
    const dialogDescription = document.getElementById("dialog-description");
    const closeDialog = document.getElementById("close-dialog");

    document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", () => {
            const project = projectDetails[button.dataset.project];

            if (!project) return;

            dialogTitle.textContent = project.title;
            dialogDescription.textContent = project.description;

            if (typeof projectDialog.showModal === "function") {
                projectDialog.showModal();
            }
        });
    });

    closeDialog.addEventListener("click", () => {
        projectDialog.close();
    });

    projectDialog.addEventListener("click", event => {
        if (event.target === projectDialog) {
            projectDialog.close();
        }
    });


    // AUTOMATIC COPYRIGHT YEAR
    document.getElementById("year").textContent =
        new Date().getFullYear();

});
