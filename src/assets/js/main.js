// Main JavaScript file for common functionality

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav ul');
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-nav-toggle mobile-show';
    mobileToggle.innerHTML = '☰';
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');

    nav.parentElement.insertBefore(mobileToggle, nav);

    mobileToggle.addEventListener('click', function() {
        nav.classList.toggle('show');
        mobileToggle.innerHTML = nav.classList.contains('show') ? '✕' : '☰';
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active Navigation Highlight
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href').endsWith(currentPath)) {
            link.classList.add('active');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavItem();
});

// Fade In Elements on Scroll
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.fade');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('fade-in');
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', fadeInOnScroll);
document.addEventListener('DOMContentLoaded', fadeInOnScroll); 