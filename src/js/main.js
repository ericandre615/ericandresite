window.onload = function() {
    var gitfeed;
    var feedContainer = document.getElementById('feed');

    function feedBuilder(feed) {
        for(var i = 0; i < 3; i++) {
            var elem = document.createElement('div');
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
        
        feedBuilder(entries);
        
        return;
    })['catch'](function(err) {
        return err;
    });
    
};
