var express = require('express');
var router = express.Router();

var details = {
    title: 'Home',
    description: 'Home of Nashville artist and web developer Eric Andre.'
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', details);
});

module.exports = router;
