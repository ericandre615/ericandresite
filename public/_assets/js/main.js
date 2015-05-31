// RequestAnimationFrame Polyfill
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

function Timemap(dateObj) {
    'use strict';

    var dateObj = dateObj || new Date(),
    month = dateObj.getMonth(), // cus javascript starts month at 0
    day = dateObj.getDate(),
    dayOfWeek = dateObj.getDay(),
    year = dateObj.getFullYear(),
    time = dateObj.getTime(),
    hour = dateObj.getHours(),
    minutes = dateObj.getMinutes(),
    seconds = dateObj.getSeconds();

    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    function format(str) {
        return str.replace(/Y/, year) // 2015
        .replace(/y/, year.toString().substr(2,3)) //15
        .replace(/mm/, month+1) //5, 9, 11
        .replace(/MM/, (month.toString().length > 1) ? month + 1 : '0'+(month+1)) // 05, 09, 11
        .replace(/M/, months[month]) // January, March, June
        .replace(/m/, months[month].toString().substr(0,3)) // Jan, Mar, Jun
        .replace(/dd/, day) // 1, 5, 20, 26
        .replace(/DD/, (day.toString().length > 1) ? day : '0'+day) // 01, 04, 15, 22
        .replace(/d/, days[dayOfWeek].toString().substr(0,3)) // Mon, Tue
        .replace(/D/, days[dayOfWeek]); // Monday, Tuesday
    }
    
    return {
        date: dateObj,
        format: format
    };
};

if(typeof module !== 'undefined' && module.exports) {
    module.exports = Timemap;
}

var kickback = (function(kickback) {
    'use strict';
    // make a new object
    kickback = {};

    // private method
    function _serialize(obj) {
        var str = [];
        for(var p in obj){
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    };

    // main public method
    kickback.request = function(kbOptions) {
        // options configuration and defaults
        if(typeof kbOptions === 'string') {
            // assume it's a url and we are using GET 
            var tmp = kbOptions;
            kbOptions = {};
            kbOptions.url = tmp;
            tmp = null;
        }

        kbOptions.url = (kbOptions.url) ? kbOptions.url : '/';
        kbOptions.data = (kbOptions.data) ? kbOptions.data : null;
        kbOptions.method = (kbOptions.method) ? kbOptions.method : 'GET';
        kbOptions.headers = (kbOptions.headers) ? kbOptions.headers : false;
        kbOptions.cors = (kbOptions.cors) ? kbOptions.cors : false;
        kbOptions.async = (kbOptions.async) ? kbOptions.async : true;
        kbOptions.serialize = (kbOptions.serialize) ? kbOptions.serialize : false;
        kbOptions.auto = (kbOptions.auto) ? kbOptions.auto : false; 
        Object.defineProperty(kbOptions, 'tmp', {
            configurable: true,
            writable: true
        });

        if(kbOptions.auto === true) {
            if(typeof window.FormData !== 'undefined') { 
                if(kbOptions.data instanceof HTMLElement) {
                    kbOptions.data = new FormData(kbOptions.data);
                } else if (typeof kbOptions.data === 'object' && kbOptions.data instanceof Array === false) {
                    kbOptions.tmp = kbOptions.data;
                    kbOptions.data = new FormData();
                    Object.keys(kbOptions.tmp).forEach(function(key) {
                        kbOptions.data.append(key, kbOptions.tmp[key]);
                    });
                    delete kbOptions.tmp;
                } else {
                    throw new Error('Submit data as object or HTMLElement');
                }
            } else {
                if(kbOptions.data instanceof HTMLElement) {
                    kbOptions.tmp = {};
                    [].forEach.call(kbOptions.data, function(elem) {
                        kbOptions.tmp[elem.name] = elem.value;
                    });
                    kbOptions.data = kbOptions.tmp;
                    delete kbOptions.tmp;
                }
                
                kbOptions.serialize = true;
            }
        }

        if(kbOptions.serialize === true) {
            kbOptions.data = _serialize(kbOptions.data);
        }

        if(kbOptions.data instanceof FormData) {
            console.log('formDATA');
        } else {
            console.log('notFormData');
        } 

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(kbOptions.method, kbOptions.url, kbOptions.async);

            // check status
            xhr.onload = function() {
                if(xhr.status == 200) {
                    resolve(xhr.response);
                } else {
                    reject(Error('Error: ', xhr.statusTxt));
                }
            };

            // network error
            xhr.onerror = function() {
                reject(Error('Network Error'));
            };

            // set headers
            if(kbOptions.headers !== false) {
                kbOptions.headers.type = kbOptions.headers.type || 'Content-Type';
                kbOptions.headers.value = kbOptions.headers.value || 'text/plain;charset=UTF-8';
                xhr.setRequestHeader(kbOptions.headers.type, kbOptions.headers.value);
            }
            
            if(kbOptions.headers === false && kbOptions.method.toLowerCase() === 'post' && kbOptions.serialize === true) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            // make the request
            if(kbOptions.method.toLowerCase() === 'get') {
                xhr.send(null);
            } else {
                xhr.send(kbOptions.data);
            }
        });
    }; // end main method


    return kickback;

}(kickback));

// see if we are in node if so support it!
if(typeof module !== 'undefined' && module.exports) {
    module.exports = kickback;
}

(function(window) {
    'use strict';

    var scrollTimer = null,
        scrollCacheTimer = null,
        cacheScrollPos = 0;

    var navmenu = document.querySelector('ul[role="menubar"]'),
        menubar = document.getElementById('main-nav'),
        masthead = document.getElementById('masthead');

    var sections = [
            '#about',
            '#work',
            '#projects'
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
            elem = document.querySelector(elem);
        }
        
        var rect = elem.getBoundingClientRect();
        
        if(rect.top > window.innerHeight || rect.bottom < 0) {
            console.log(elem, 'is NOT in view');
            if(elem.classList.contains('in-view')) {
                elem.classList.remove('in-view');
            }
            return false;
        } else {
            console.log(elem, 'is in view');
            elem.classList.add('in-view');
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
            menubar.classList.add('hide-nav');
        }
        if(cacheScrollPos > window.scrollY) {
            //scrolling up
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
            var dataOffset = (e.target.getAttribute('data-scroll-offset')) ? e.target.getAttribute('data-scroll-offset') : false;

            // If the anchor exists
            if (dataTarget) {
              // Scroll to the anchor
              smoothScroll(dataTarget, dataSpeed, dataOffset);
            }
        }
    }

    }, false);

})();


