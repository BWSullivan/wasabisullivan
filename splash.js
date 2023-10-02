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

                // Show locations div but keep it invisible
                locations.style.display = 'block';

                // Fade in locations after a short delay to ensure it's part of the layout
                setTimeout(() => {
                    locations.style.opacity = '1';
                }, 50); // Short delay

                document.body.style.overflow = 'auto'; // Allow scrolling

                // Remove splashScreen from the layout
                splashScreen.style.display = 'none';
            }, 1000); // Wait 1 seconds

        }, 1000); // Wait 1 seconds

    }, 1000); // Show splash screen for 1 seconds
});