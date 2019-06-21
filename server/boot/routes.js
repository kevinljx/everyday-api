
const path = require('path');

module.exports = function(app) {
  // var User = app.models.User

  // verified
  app.get('/verified', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../views/verified.html"));
  });
  

  //show password reset form
  app.get('/reset-password', function(req, res, next) {
    const accessToken = req.query.accessToken 
    if (!accessToken) return res.sendStatus(401);
    res.render('password-reset', {
      redirectUrl: '/api/users/reset-password?access_token='+accessToken
    });
  });


  
};
