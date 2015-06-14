var express = require('express');
var router = express.Router();

var request = require('request'),
    feed = 'https://github.com/ericandre615.atom',
    xml2js = require('xml2js'),
    parser = new xml2js.Parser();

/* GET home page. */
router.get('/', function(req, res, next) {
    //var data = request(feed);
    //res.send(data);
    request(feed, function(err, response, body) {
        if(err) {
            res.send(err);
        }
        if(res.statusCode != 200) {
            res.send(new Error('status not OK'));
        }

        var data;

        parser.parseString(body.toString(), function(err, result) {
            if(err) {
                return err;
            }

            data = result;
        });

        res.send(data);
    });
});

module.exports = router;
