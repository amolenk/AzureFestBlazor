export function onLoad() {
    
    InitializeGallery("img/2024/event-photos.json", ".galleria");
}

function InitializeGallery(dataUrl, selector) {
    fetch(dataUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            Galleria.run(selector, {
                dataSource: data,
                imageCrop: false
            });
        });
}