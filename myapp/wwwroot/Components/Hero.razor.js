export function onLoad() {
    
    // Select the 'About Azure Fest' button
    const aboutButton = document.querySelector('#about-button');

    // Add a click event listener to the button
    aboutButton.addEventListener('click', () => {
        // Select the About section
        const aboutSection = document.querySelector('#about');
        const headerSize = 70;

        const elementPosition = aboutSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition - headerSize;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    });
}
