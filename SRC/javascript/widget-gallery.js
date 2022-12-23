var galleryImages = document.querySelectorAll('.gallery-image');

// Add hover event listeners to all gallery images
galleryImages.forEach((image) => {
    image.addEventListener('mouseenter', () => {
        // set z index to 2
        image.style.zIndex = 2;

        // Enlarge the image by 35%
        image.style.transform = 'scale(1.35)';

    });

    image.addEventListener('mouseleave', () => {
        // Set the z index back to 0
        image.style.zIndex = 0;
        image.style.transform = 'scale(1)';

    });
});