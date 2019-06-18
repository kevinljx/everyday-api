'use strict';

module.exports = function(Baseuser) {
    //filter only company users


    Baseuser.afterRemote('verify', function(context, user, next) {

        console.log('Baseuser prototype verify')
        context.res.render('response', {
          title: 'A Link to reverify your identity has been sent '+
            'to your email successfully',
          content: 'Please check your email and click on the verification link '+
            'before logging in',
          redirectTo: '/',
          redirectToLinkText: 'Log in'
        });
      });

};
