export function onLoad() {

    initializeBackToTopButton();

    window.backToTop = {
        scrollToTop: scrollToTop
    };
}

function initializeBackToTopButton() {
    let backToTop = document.querySelector('.back-to-top')
    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.scrollY > 100) {
                backToTop.classList.add('active')
            } else {
                backToTop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBackToTop)
        document.addEventListener('scroll', toggleBackToTop)
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    return false;
}