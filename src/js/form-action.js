(function() {
  'use strict';

  document.addEventListener('submit', function(e) {
    e.preventDefault();
    var formData = document.querySelector('form#contact'),
        formError = {};

    [].forEach.call(formData, function(formInput) {
      if(formInput.value == '') {
        formError[formInput.name] = 'required';
      }
    });

    if(Object.keys(formError).length) {
      for(var error in formError) {
        if(formError.hasOwnProperty(error)) {
          console.log('Error '+error+' '+formError[error]);
        }
      }
    } else {
      kickback.request({
        url: '/contact',
        data: {
            name_full: formData.name_full.value,
            email: formData.email.value,
            msg: formData.msg.value
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
