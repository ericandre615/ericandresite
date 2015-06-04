var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/redirected', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
