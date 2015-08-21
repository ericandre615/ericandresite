(function() {
  'use strict';

  var contactForm = document.getElementById('contact');
  [].forEach.call(contactForm, function(input) {
    if(input.nodeName !== 'BUTTON') {
      input.addEventListener('focus', function(e) {
        var inputName = e.target.name;
        var inputLabel = document.querySelector('label[for="'+inputName+'"]');
        inputLabel.classList.add('active');
      }, false);
      input.addEventListener('blur', function(e) {
        var inputName = e.target.name;
        var inputLabel = document.querySelector('label[for="'+inputName+'"]');
        if(e.target.value.length) {
          inputLabel.classList.add('valid');
        }
        if(!e.target.value.length) {
          inputLabel.classList.remove('valid');
          inputLabel.classList.add('error');
        }
        inputLabel.classList.remove('active');
      }, false);
    }
  });

  document.addEventListener('submit', function(e) {
    e.preventDefault();
    var formError = {};

    [].forEach.call(contactForm, function(formInput) {
      if(formInput.nodeName !== 'BUTTON') {
        if(formInput.value == '') {
          formError[formInput.name] = 'required';
        } else {
          var inputLabel = document.querySelector('label[for="'+formInput.name+'"]');
          inputLabel.classList.remove('error');
          inputLabel.classList.add('valid');
        }
      }
    });

    if(Object.keys(formError).length) {
      for(var error in formError) {
        if(formError.hasOwnProperty(error)) {
          var errorLabel = document.querySelector('label[for="'+error+'"]');
          errorLabel.classList.add('error');
          console.log('Error '+error+' '+formError[error]);
        }
      }
    } else {
      kickback.request({
        url: '/contact',
        data: {
            name_full: contactForm.name_full.value,
            email: contactForm.email.value,
            msg: contactForm.msg.value
        },
        method: 'POST',
        serialize: true
      })
      .then(function(response) {
        if(response.success === true) {
          console.log('SUCCESS', response);
        } else if(response.code) {
          console.log('hmmm', response);
        } else {
            console.log('dang', response);
        }
        return response;
      })['catch'](function (err) {
        return new Error('Prom fail: ',err);
      });
    }

  }, false);
})();
