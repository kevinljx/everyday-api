"use strict";

const path = require('path');
const fs = require('fs')
const logo = '../views/logo.png';
const pdf = require('html-pdf');
const ejs = require('ejs');
const handlebars = require("handlebars");

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};


module.exports = function (app) {
  // var User = app.models.User

  // verified
  app.get('/verified', async (req, res) => {
    res.render('verified', {
      redirectUrl: '/login',
    });
  });


  app.get('/login', function (req, res) {
    // Process the data received in req.body

    const config = app.settings.host
    // const config = "api"

    let link = ''
    if (config == "localhost") {
      link = "http://localhost:3000/login"
    } else {
      link = "https://huttons-api.everydaycrm.sg/login"
    }

    res.redirect(link);
  });

  //show password reset form
  app.get('/reset-password', function (req, res, next) {
    const accessToken = req.query.accessToken
    if (!accessToken) return res.sendStatus(401);
    res.render('password-reset', {
      redirectUrl: '/api/users/reset-password?access_token=' + accessToken,
      logo: logo,
    });
  });

  app.post('/api/create-pdf', function (req, res, next) {

    var compiled = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../docs/linux_template.html'), 'utf8'));
    //console.log(req.body);
    var html = "";
    function genDir() {
      var dirName = "";
      for (var i = 0; i < 7; i++) {
        var num = Math.random();
        var startChar = 65;
        if (num > 0.5) {
          startChar = 97;
        }
        num = Math.floor(Math.random() * 26) + startChar;
        dirName += String.fromCharCode(num);
      }
      return dirName;
    }
    try {
      html = compiled(req.body);
      var assetpath = path.join(__dirname, '..', '/assets/');
      assetpath = assetpath.replace(new RegExp(/\\/g), '/');
      //console.log(assetpath);
      var options = {
        format: 'A4',
        "base": "file:///" + assetpath,
      };



      var dirName = genDir();
      while (fs.existsSync('./server/storage/' + dirName)) {
        dirName = genDir();
      }
      fs.mkdirSync('./server/storage/' + dirName);

      pdf.create(html, options).toFile('./server/storage/' + dirName + '/result.pdf', function (err, ggg) {
        if (err) {
          res.statusCode = 500;
        }
        res.send(dirName);
      });
    }
    catch (err) {
      console.log(err);
      res.status(500).send("Error generating PDF");
    }


    //res.send("ok");

  });

  app.get('/api/fetch-pdf/:dirname', function (req, res, next) {
    var dirName = req.params.dirname;
    if (dirName == undefined || dirName == "") {
      res.statusCode = 500;
      res.send({});
    }
    else {
      res.download('./server/storage/' + dirName + '/result.pdf', 'wealth_report.pdf')
    }

  });


};


// process.env.NODE_ENV