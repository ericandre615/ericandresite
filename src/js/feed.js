window.addEventListener('load', function() {
    var gitfeed;
    var feedContainer = document.getElementById('feed');

    function feedBuilder(feed, limit) {
        var limit = limit || 3;
        
        for(var i = 0; i < limit; i++) {
            var elem = document.createElement('div');
            elem.classList.add('alert');
            elem.innerHTML = feed[i].content[0]._;
            feedContainer.appendChild(elem);
        }

        return;
    };

    kickback.request({
        url: '/feed',
        method: 'GET'
    })
    .then(function(response) {
        gitfeed = JSON.parse(response);
        var entries = gitfeed.feed.entry;
        
        feedBuilder(entries, 6);
        
        return;
    })['catch'](function(err) {
        return err;
    });
    
}, false);
