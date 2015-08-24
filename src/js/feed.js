window.addEventListener('load', function() {
    var gitfeed;
    var feedContainer = document.getElementById('feed');
    var gitRegEx = /(<a.*?href\s*=\s*[\"'])\s*/ig;
    var gitURL = "https://github.com";

    function feedBuilder(feed, limit) {
        limit = limit || 3;

        for(var i = 0; i < limit; i++) {
            var elem = document.createElement('div');
            var processedFeed = feed[i].content[0]._.replace(gitRegEx, "$1"+gitURL);
            elem.classList.add('alert');
            elem.innerHTML = processedFeed;
            feedContainer.appendChild(elem);
        }

        return;
    }

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
