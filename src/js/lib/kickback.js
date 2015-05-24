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
