
const path = require('path');
const fs = require('fs')
const logo = '../views/logo.png'



module.exports = function(app) {
  // var User = app.models.User

  // verified
  app.get('/verified', (req, res) => {
    // res.sendFile(path.resolve(__dirname, "../views/verified.html"));

    res.render("verified", {
      redirectTo: `https://${app.settings.host}/login`,
      redirectToLinkText: "Click to login"
    });
  });
  

  //show password reset form
  app.get('/reset-password', function(req, res, next) {
    const accessToken = req.query.accessToken 
    if (!accessToken) return res.sendStatus(401);
    res.render('password-reset', {
      redirectUrl: '/api/users/reset-password?access_token='+accessToken,
      logo: logo,
    });
  });


  
};


// process.env.NODE_ENV