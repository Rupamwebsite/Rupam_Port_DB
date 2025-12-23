/* ----- NAVIGATION BAR FUNCTION ----- */
function myMenuFunction() {
    var menuBtn = document.getElementById("myNavMenu");

    if (menuBtn.className === "nav-menu") {
        menuBtn.className += " responsive";
    } else {
        menuBtn.className = "nav-menu";
    }
}

/* ----- ADD SHADOW ON NAVIGATION BAR WHILE SCROLLING ----- */
window.onscroll = function () { headerShadow() };

function headerShadow() {
    const navHeader = document.getElementById("header");

    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
        navHeader.style.height = "70px";
        navHeader.style.lineHeight = "70px";
        navHeader.style.background = "rgba(15, 15, 22, 0.95)";
    } else {
        navHeader.style.boxShadow = "none";
        navHeader.style.height = "80px";
        navHeader.style.background = "rgba(15, 15, 22, 0.8)";
    }
}

/* ----- TYPING EFFECT ----- */
var typingEffect = new Typed(".typedText", {
    strings: ["Developer", "Data Analyst", "Coder", "Designer"],
    loop: true,
    typeSpeed: 100,
    backSpeed: 80,
    backDelay: 2000
})

/* ----- SCROLL REVEAL ----- */
const sr = ScrollReveal({ origin: 'top', distance: '80px', duration: 2000, reset: true });

sr.reveal('.featured-text-card', {})
sr.reveal('.featured-name', { delay: 100 })
sr.reveal('.featured-text-info', { delay: 200 })
sr.reveal('.featured-text-btn', { delay: 200 })
sr.reveal('.social_icons', { delay: 200 })
sr.reveal('.featured-image', { delay: 300 })

// Project Box Animation
sr.reveal('.project-box', { interval: 200 })

// Headers
sr.reveal('.top-header', {})


const srLeft = ScrollReveal({ origin: 'left', distance: '80px', duration: 2000, reset: true })
srLeft.reveal('.about-info', { delay: 100 })
srLeft.reveal('.contact-info', { delay: 100 })

const srRight = ScrollReveal({ origin: 'right', distance: '80px', duration: 2000, reset: true })
srRight.reveal('.skills-box', { delay: 100 })
srRight.reveal('.form-control', { delay: 100 })

/* ----- CHANGE ACTIVE LINK ----- */
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 50,
            sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active-link')
        } else {
            document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}

window.addEventListener('scroll', scrollActive);

/* ----- CONTACT FORM SUBMIT ----- */
const form = document.querySelector(".form-control form");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            phone: form.querySelector('[name="phone"]').value,
            message: form.querySelector('[name="message"]').value
        };

        // Visual Feedback
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending...';

        fetch("/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(res => res.text())
            .then(response => {
                showNotify(response, 'success');
                form.reset();
                btn.innerHTML = originalText;
            })
            .catch(err => {
                console.error(err);
                btn.innerHTML = originalText;
                showNotify('Something went wrong!', 'error');
            });
    });
}

/* ----- PRELOADER ----- */
window.addEventListener('load', function () {
    var loader = document.getElementById('pre_loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(function () {
            loader.style.display = 'none';
        }, 500);
    }
});


/* ----- FETCH PROJECTS FROM DB ----- */
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        const container = document.querySelector('.project-container');

        // Only if we actually have projects in DB, otherwise keep static ones
        if (projects.length > 0) {
            container.innerHTML = ''; // Clear static ones
            projects.forEach(project => {
                const projectDiv = document.createElement('a');
                projectDiv.classList.add('project-box');
                projectDiv.setAttribute('data-tilt', ''); // Add tilt effect
                projectDiv.href = project.link || '#';
                projectDiv.target = '_blank';

                projectDiv.innerHTML = `
                    <i class="uil uil-folder"></i>
                    <h3>${project.title}</h3>
                    <label>${project.description || 'View Project'}</label>
                `;
                container.appendChild(projectDiv);
            });
            // Re-init Tilt for new elements
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(document.querySelectorAll(".project-box"), {
                    max: 25,
                    speed: 400
                });
            }
        }
    } catch (err) {
        console.log("Using static projects (DB might be empty or offline)");
    }
}
loadProjects();


/* ----- VANILLA TILT INIT ----- */
/* Data-tilt attribute handles initialization auto-magically by the library,
   but we can force re-init if needed. */


/* ----- PARTICLES BACKGROUND ----- */
const canvas = document.getElementById('particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() * 1.5) - 0.75;
            this.speedY = (Math.random() * 1.5) - 0.75;
            this.color = 'rgba(0, 210, 255, 0.3)'; // Neon Blue opacity
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < 50; i++) { // Number of particles
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });
}

/* ----- NOTIFICATION (REPLACE alert) ----- */
function showNotify(message, type = 'success', timeout = 3000) {
    const modal = document.getElementById('notify-modal');
    if (!modal) {
        // Fallback to alert if modal not present
        alert(message);
        return;
    }

    const titleEl = modal.querySelector('.notify-title');
    const messageEl = modal.querySelector('.notify-message');
    const iconEl = modal.querySelector('.notify-icon i');
    const contentEl = modal.querySelector('.notify-modal-content');

    messageEl.textContent = message;
    if (type === 'success') {
        titleEl.textContent = 'Success';
        iconEl.className = 'uil uil-check-circle';
        iconEl.style.color = '';
    } else {
        titleEl.textContent = 'Error';
        iconEl.className = 'uil uil-times-circle';
        iconEl.style.color = '';
    }

    modal.classList.add('show');

    // Close handler
    const closeBtn = modal.querySelector('.notify-close');
    function hide() {
        modal.classList.remove('show');
        closeBtn.removeEventListener('click', hide);
        if (hideTimeout) clearTimeout(hideTimeout);
    }

    closeBtn.addEventListener('click', hide);

    const hideTimeout = setTimeout(() => {
        hide();
    }, timeout);
}
