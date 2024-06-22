export function onLoad() {
    
    initializeHeaderScrollEffect();
    updateActiveLink();
    
    window.navMenu = {
        toggleMobileNavigation: toggleMobileNavigation
    };
}

export function onUpdate() {
    updateActiveLink();
}

function initializeHeaderScrollEffect() {
    let selectHeader = document.querySelector('#header');
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 50) {
                selectHeader.classList.add('header-scrolled')
            } else {
                selectHeader.classList.remove('header-scrolled')
            }
        }
        document.addEventListener('scroll', headerScrolled);
        headerScrolled();
    }
}

function updateActiveLink() {
    document.querySelectorAll('#navbar a.nav-link').forEach(link => {
        if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function toggleMobileNavigation() {
    const mobileNav = document.querySelector('.mobile-nav-toggle');
    const navBar = document.getElementById('navbar');
    // useMobileNav = !useMobileNav;
    mobileNav.classList.toggle('bi-list');
    mobileNav.classList.toggle('bi-x');
    navBar.classList.toggle('navbar');
    navBar.classList.toggle('navbar-mobile');
}