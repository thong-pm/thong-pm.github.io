(function($) {

    var $window = $(window),
        $body = $('body'),
        $header = $('#header'),
        $footer = $('#footer'),
        $main = $('#main'),
        settings = {

            // Parallax background effect?
            parallax: true,

            // Parallax factor (lower = more intense, higher = less intense).
            parallaxFactor: 20

        };

    // Breakpoints.
    breakpoints({
        xlarge:  [ '1281px',  '1800px' ],
        large:   [ '981px',   '1280px' ],
        medium:  [ '737px',   '980px'  ],
        small:   [ '481px',   '736px'  ],
        xsmall:  [ null,      '480px'  ],
    });

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Touch?
    if (browser.mobile) {

        // Turn on touch mode.
        $body.addClass('is-touch');

        // Height fix (mostly for iOS).
        window.setTimeout(function() {
            $window.scrollTop($window.scrollTop() + 1);
        }, 0);

    }

    // Footer.
    breakpoints.on('<=medium', function() {
        $footer.insertAfter($main);
    });

    breakpoints.on('>medium', function() {
        $footer.appendTo($header);
    });

    // Header.

    // Parallax background.

    // Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
    if (browser.name == 'ie' || browser.mobile)
        settings.parallax = false;

    if (settings.parallax) {

        breakpoints.on('<=medium', function() {

            $window.off('scroll.strata_parallax');
            $header.css('background-position', '')

        });

        breakpoints.on('>medium', function() {

            $header.css('background-position', 'left 0px');

            $window.on('scroll.strata_parallax', function() {
                $header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
            });

        });

        $window.on('load', function() {
            $window.triggerHandler('scroll');
        });

    }

    // Main Sections: Two.

	let isLooping = true; // Flag to track if the loop is running
    let timeout; // Variable to hold the timeout for restarting the loop

    // Function to handle the click event on images
    function handleClick(index) {
        const images = document.querySelectorAll('.reel-slider a');
        
        if (isLooping) {
            isLooping = false;

            // Stop all images and make them invisible
            images.forEach(image => {
                image.classList.remove('clicked'); // Remove clicked class
                image.style.animation = 'none'; // Stop the animation
                image.style.opacity = '0'; // Hide the image
            });

            // Show the clicked image for 3 seconds
            images[index].classList.add('clicked'); // Add clicked class
            images[index].style.opacity = '1'; // Make it visible

            // After 3 seconds, restart the loop and remove the "frozen" state
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                removeClickedImage(index); // Remove the clicked image after 3 seconds
                restartLoop(); // Restart the loop after 3 seconds
            }, 3000);
        }
    }

    // Function to remove the clicked image and restart animation
    function removeClickedImage(index) {
        const images = document.querySelectorAll('.reel-slider a');
        images[index].classList.remove('clicked'); // Remove the clicked class
        images[index].style.opacity = '0'; // Make it invisible again
        images[index].style.animation = 'reel-fade var(--total-duration) infinite'; // Re-enable animation
    }

    // Function to restart the loop from the first image
    function restartLoop() {
        isLooping = true;

        // Reset all images for the loop
        const images = document.querySelectorAll('.reel-slider a');
        images.forEach((image, index) => {
            image.style.animation = 'reel-fade var(--total-duration) infinite'; // Re-enable animation
            image.style.opacity = '0'; // Start as invisible
            image.style.animationDelay = `calc(${index} * var(--image-cycle))`; // Set the animation delay
        });

        // Trigger the next animation cycle
        const firstImage = images[0];
        firstImage.style.opacity = '1'; // Show the first image to kickstart the loop again
    }

    // Function to handle navigation button clicks
    function navigateTo(index) {
        const images = document.querySelectorAll('.reel-slider a');
        
        // Stop the loop and reset animations for all images
        isLooping = false;
        images.forEach(image => {
            image.classList.remove('clicked'); // Remove clicked class
            image.style.animation = 'none'; // Stop the animation
            image.style.opacity = '0'; // Hide all images
        });

        // Show the selected image immediately
        images[index].style.opacity = '1'; // Show the selected image
        images[index].classList.add('clicked'); // Mark it as clicked

        // Restart the loop after a short delay
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            removeClickedImage(index); // Remove clicked image after showing
            restartLoop(); // Restart the loop after 3 seconds
        }, 3000);
    }

    // Attach the click event to each image
    document.querySelectorAll('.reel-slider a').forEach((image, index) => {
        image.addEventListener('click', () => handleClick(index)); // Handle click event
    });

    // Attach the navigation buttons
    document.querySelectorAll('.nav-buttons button').forEach((button, index) => {
        button.addEventListener('click', () => navigateTo(index)); // Attach click event to navigation buttons
    });
})(jQuery);
