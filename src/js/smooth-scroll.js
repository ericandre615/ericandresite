(function() {

    'use strict';

    // Function to animate the scroll
    var smoothScroll = function(anchor, duration, offset) {

      // Calculate how far and how fast to scroll
      var startLocation = window.pageYOffset;
      var endLocation = anchor.offsetTop;
      var distance = endLocation - startLocation;
      var increments = distance / (duration / 16);
      var stopAnimation, runAnimation, travelled;

      if(offset > 0) {
        endLocation = endLocation - offset;
      }

      // Scroll the page by an increment, and check if it's time to stop
      var animateScroll = function() {
        window.scrollBy(0, increments);
        travelled = window.pageYOffset;

        runAnimation = requestAnimationFrame(animateScroll);

        // If scrolling down
          if (increments >= 0) {
            // Stop animation when you reach the anchor OR the bottom of the page
              if ((travelled >= (endLocation - increments)) || ((window.innerHeight + travelled) >= document.body.offsetHeight)) {
                cancelAnimationFrame(runAnimation);
              }
          }
          // If scrolling up
          else {
            // Stop animation when you reach the anchor OR the top of the page
              if (travelled <= (endLocation || 0)) {
                cancelAnimationFrame(runAnimation);
              }
          }
      };

      // Loop the animation function
      runAnimation = requestAnimationFrame(animateScroll);

    };

    // When the smooth scroll link is clicked
    document.addEventListener('click', function(e) {
    // event delegation
    if(e.target && e.target.nodeName == 'A') {
        if(e.target.classList.contains('scroll')) {
            e.preventDefault();

            // Get anchor link and calculate distance from the top
            var dataID = e.target.getAttribute('href');
            var dataTarget = document.querySelector(dataID);
            var dataSpeed = (e.target.getAttribute('data-scroll-speed')) ? e.target.getAttribute('data-scroll-speed') : 500;
            var dataOffset = (e.target.getAttribute('data-scroll-offset')) ? e.target.getAttribute('data-scroll-offset') : 0;

            // If the anchor exists
            if (dataTarget) {
              // Scroll to the anchor
              smoothScroll(dataTarget, dataSpeed, dataOffset);
            }
        }
    }

    }, false);

})();
