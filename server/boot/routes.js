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
    res.render('verified', {
      redirectUrl: '/login',
    });
  });
  

  app.get('/login', function(req, res) {
    // Process the data received in req.body

    const config = app.settings.host
    // const config = "api"

    let link = ''
    if(config == "localhost"){
      link = "http://localhost:3000/login"
    } else {
      link = "https://cloud.everydaycrm.sg/login"
    }

    res.redirect(link);
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