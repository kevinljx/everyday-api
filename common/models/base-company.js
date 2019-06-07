'use strict';

module.exports = function(Company) {
    
    Company.signup = function(username, password, priceplan, userinfo, companyinfo, paymentinfo, cb) {
      //check if user already signed up with same email address
      console.log(username+","+password);
      //company info
      //user info
      //create 1 user and 1 company
      //create default access rights
      //all 1st sign up stuff here
      cb(null, 1, "testing");
    }

    Company.remoteMethod('signup', {
          accepts: [{arg: 'email', type: 'string', required: true}, 
            {arg: 'password', type: 'string', required:true}, 
            {arg: 'priceplan', type: 'number', required: true},
            {arg: 'userinfo', type: 'object'},
            {arg: 'companyinfo', type: 'object'},
            {arg: 'paymentinfo', type: 'object'}
            ],
          returns: [{arg: 'success', type: 'number'}, {arg: 'msg', type: 'string'}]
    });
    
};
