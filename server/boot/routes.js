"use strict";

const path = require('path');
const fs = require('fs')
const logo = '../views/logo.png'
const handlebars = require("handlebars");

const readHTMLFile = function(path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};


module.exports = function(app) {
  // var User = app.models.User

  // verified
  app.get('/verified', async (req, res) => {
    res.sendFile(path.resolve(__dirname, "../views/verified.html"));

    // let link = ""
    // if(app.settings.host=="localhost"){
    //   link = "localhost/login"
    // } else {
    //   link = "cloud.everydaycrm.sg/login"
    // }


    // // href="{{link}}"
    // readHTMLFile(
    //   path.resolve(__dirname, "../views/verified.html"),
    //   function(err, html) {

    //     const resetPassURL = link

    //     var template = handlebars.compile(html);
    //     var replacements = { link: resetPassURL };
    //     var htmlToSend = template(replacements);
        
        
    //     res.sendFile(htmlToSend);
    //   }
    // );


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