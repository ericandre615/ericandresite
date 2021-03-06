var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

router.post('/', function(req, res) {

  var name_full = req.body.name_full,
      email = req.body.email,
      message = req.body.msg,
      response = false;

  var transport = nodemailer.createTransport(smtpTransport({
      host: "smtp.webfaction.com",
      port:25,
      auth: {
        user: "newmail",
        pass: "webmailtest615"
      }
    }));

  var mailOptions = {
    from: 'Eric Andre <eric@ericandre615.webfactional.com>',
    to: 'ericandre615@gmail.com',
    subject: 'Message from Ericandre.info',
    text: 'contact from ericandre.info name:'+name_full+', email: '+email+', message: '+message,
    html: '<b>From ericandre.info contact form</b>'+
          'name: '+name_full+'<br />'+
          'email: '+email+'<br />'+
          'message: '+message+'<br />'
  };

  if(name_full != '' && email != '' && message != '') {
    transport.sendMail(mailOptions, function(err, info) {
      if(err) {
        response = {
          success: false,
          error: new Error('Mail Error: ', err),
          message: 'Email could not be sent'
        };
        return done(err, response);
      } else {
        response = {
          'success': true,
          'message': 'email message was sent',
          'info':info
        };
        return done(null, response);
      }
    });

  } else {
    response = {
      'success': false,
      'error': 'required input had empty value'
    };
    return done(response.error, response);
  }

    function done(err, data) {
        if(err) {
            res.send(err);
            res.end();
            return;
        }
        res.send(data);
        res.end();
        return;
    }
});

module.exports = router;
