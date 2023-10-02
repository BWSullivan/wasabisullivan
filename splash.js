document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splashScreen');
    const blackOverlay = document.getElementById('blackOverlay');
    const locations = document.getElementById('locations');

    setTimeout(() => {
        // Fade out splash screen
        splashScreen.style.opacity = '0';
        splashScreen.style.transition = 'opacity 2s';

        // Fade in black overlay
        setTimeout(() => {
            blackOverlay.style.opacity = '1';
            blackOverlay.style.transition = 'opacity 2s';

            // Fade out black overlay and show locations
            setTimeout(() => {
                blackOverlay.style.opacity = '0';
                locations.style.display = 'block';
                document.body.style.overflow = 'auto'; // Allow scrolling
            }, 2000); // Wait 2 seconds

        }, 2000); // Wait 2 seconds

    }, 2000); // Show splash screen for 2 seconds
});