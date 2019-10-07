// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

"use strict";

var loopback = require("loopback");
var boot = require("loopback-boot");
var app = (module.exports = loopback());
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

var cron = require("node-cron");
const handlebars = require("handlebars");
const fs = require("fs");

const readHTMLFile = function(path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit("started");
    var baseUrl = app.get("url").replace(/\/$/, "");
    // console.log('Web server listening at: %s', baseUrl);
    if (app.get("loopback-component-explorer")) {
      var explorerPath = app.get("loopback-component-explorer").mountPath;
      // console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }

    // console.log(app)
    cron.schedule("* * * * *", () => {
      // console.log('running a task every minute');
      // app.notification.find({where: })
      //
      // readHTMLFile(
      //   path.resolve(__dirname, "./views/resetPassword.html"),
      //   function (err, html) {
      //     var template = handlebars.compile(html);
      //     var replacements = { link: 'resetPassURL' };
      //     var htmlToSend = template(replacements);
      //     app.models.Email.send(
      //       {
      //         // uncomment to info.email, for production.
      //         to : 'igc14.gianjie@gmail.com',
      //         from: "Esther from Everyday <hello@everydaycrm.sg>",
      //         subject: "Testing Cron Job Email",
      //         html: htmlToSend
      //       },
      //       function (err) {
      //         if (err) return console.log("> error sending password reset email");
      //         // Sending password reset email to user
      //       }
      //     );
      //   }
      // );
    });
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) app.start();
});
