(function(window) {
    'use strict';

    var scrollTimer = null,
        scrollCacheTimer = null,
        cacheScrollPos = 0,
        scrollDirection;

    var navmenu = document.querySelector('ul[role="menubar"]'),
        menubar = document.getElementById('main-nav'),
        masthead = document.getElementById('masthead');

    var sections = [
            '#about',
            '#work',
            '#skills',
            '#projects',
            '#education'
        ];

    var initialBGColor = '#eaeaea',
        bGColor_1 = '#AFB4D8',
        bGColor_2 = '#6F94BE',
        bGColor_3 = '#6EAEB3',
        bGColor_4 = '#66CF97',
        bGColor_5 = '#49DB45',
        bGColor_6 = '#1DE410';

    function scrollSetCached() {
        cacheScrollPos = window.scrollY;
        console.log('set cache Y', cacheScrollPos);
    }

    function handleScroll() {
        console.log('scrolling stopped');
    }

    function isElementVisible(elem) {
        if(typeof elem === 'string') {
          var elemAnchor = document.querySelector('a[href="'+elem+'"]');
          elem = document.querySelector(elem); 
        }
       
        if(!elem) {
          return false;
        }

        var rect = elem.getBoundingClientRect();
        
        if(rect.top > window.innerHeight || rect.bottom < 0) {
            console.log(elem, 'is NOT in view');
            if(elem.classList.contains('in-view')) {
                elem.classList.remove('in-view');
            }
            if(elemAnchor.classList.contains('active-nav')) {
                elemAnchor.classList.remove('active-nav');
            }

            return false;
        } else {
            console.log(elem, 'is in view');
            console.log(elemAnchor, 'is active');
            elem.classList.add('in-view');
            elemAnchor.classList.add('active-nav');

            return true;
        }
    }

    window.onscroll = function detectScroll(e) {
        if(scrollTimer != null) {
            clearTimeout(scrollTimer);
        }

        if(scrollCacheTimer != null) {
            clearTimeout(scrollCacheTimer);
        } 

        if(cacheScrollPos < window.scrollY) {
            //scrolling down
            scrollDirection = 'down';
            menubar.classList.add('hide-nav');
        }
        if(cacheScrollPos > window.scrollY) {
            //scrolling up
            scrollDirection = 'up';
            menubar.classList.remove('hide-nav');
        }

        scrollTimer = setTimeout(handleScroll, 1500);
        scrollCacheTimer = setTimeout(scrollSetCached, 100);

        if(window.scrollY == 0) { masthead.style.backgroundColor = initialBGColor; } 
        if(window.scrollY > 0 && window.scrollY <= 20) { masthead.style.backgroundColor = bGColor_1; }
        if(window.scrollY >= 21 && window.scrollY <= 40) { masthead.style.backgroundColor = bGColor_2; }
        if(window.scrollY >= 41 && window.scrollY <= 60) { masthead.style.backgroundColor = bGColor_3; }
        if(window.scrollY >= 61 && window.scrollY <= 80) { masthead.style.backgroundColor = bGColor_4; }
        if(window.scrollY >= 81 && window.scrollY <= 100) { masthead.style.backgroundColor = bGColor_5; }
        if(window.scrollY >= 101 && window.scrollY <= 120) { masthead.style.backgroundColor = bGColor_6; }
        if(window.scrollY >= 121) { masthead.style.backgroundColor = initialBGColor; }

        sections.forEach(function(elem) {
            isElementVisible(elem);
        });
    };

})(window);
