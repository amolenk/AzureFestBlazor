export function onLoad() {
    
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', function () {
        setTimeout(() => {
            const elements = form.querySelectorAll(
                'input:not([type="hidden"]), select, textarea, button'
            );
            elements.forEach(el => {
                el.disabled = true;
            });
        }, 0);
    });
}
