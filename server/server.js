// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
const path = require("path");


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var cron = require('node-cron');
const handlebars = require("handlebars");
const fs = require("fs");

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
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
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    // console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      // console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }


    // console.log(app)
    cron.schedule('* * * * *', async() => {
      console.log('running a task every minute');

      const reminderArray = await app.models.Reminder.find({where : {['status.result']: { inq: [null, false]}, reminderTime: {lte: Date.now()}}})

      let i = 0
      if(reminderArray.length > 0){
        const interval = setInterval(() => {
          if (i < reminderArray.length) { 
              // send email 
              const item = reminderArray[i]
              console.log(reminderArray[i])
              readHTMLFile(
                path.resolve(__dirname, "./views/reminder.html"),
                function (err, html) {
                  var template = handlebars.compile(html);
                  var replacements = { 
                    title: item.title, // reminderArray[i].title
                    description: item.description // reminderArray[i].description
                  };
                  var htmlToSend = template(replacements);
                    app.models.Email.send({
                      to : item.reminderMedium.email,
                      from: "Esther from Everyday <hello@everydaycrm.sg>",
                      subject: "Reminder For Invoice",
                      html: htmlToSend
                    },
                    function (err, info) {
                      if (err) {
                        console.log("err", err)
                        // save into the database, status and error msg
                        item.status.result = false
                        item.status.response = "Failed delivery"
                        item.status.send_date = Date.now()
                        
                        // check for the recurringInterval : true || False
                        // check recurringInterval // Daily, Weekly, 2 Weeks, Monthly, Yearly
                        // reminderArray[i].reminderTime = Date.now() + Daily
                        
                        if(item.isRecurring){
                          // implement the recurring date to current date
                          // item.reminderTime = Date.now()
                        }

                        item.save()

                        return
                      }
                       
                        console.log('email sent!')
                  
                        item.status.result = true
                        item.status.response = "Delivered successfully"
                        item.status.send_date = Date.now()
                        
                        // check for the recurringInterval : true || False
                        // check recurringInterval // Daily, Weekly, 2 Weeks, Monthly, Yearly
                        // reminderArray[i].reminderTime = Date.now() + Daily

                        if(item.isRecurring){
                          // implement the recurring date to current date
                          // item.reminderTime = Date.now()
                        }
                        

                        item.save()

                        i++;
                    }
                  );
                }
              );
             
          } else {
            console.log('interval done and cleared!', i)
            clearInterval(interval)
          }
        }, 5000);
      } else {
        console.log('reminderArray 0 items')
      }
      
    

    });

  });
};


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});


// reminders

// notifications
// ProposedSchema = new Schema({
//   title: String, // Title of the content || Auto populate title?
//   description: String, // any description of the notification message || Auto populate description?
//   reminderMedium: {
//     "email": "", // use user's default email
//     "sms": "",
//   },
//   reminderTime: Date, // company default time || allow users to set time ||
//   status: {
//     result: Boolean, // True for success || False for failure,
//     response: String, // Successfully delivered || Error msg
//     send_date: Date // Execution time. 
//   },
//   reminderType : String, 
//   created_at: {type: Date, default: Date.now},
//   isRecurring: {
//     type: Boolean,
//     required: true,
//     default: false
//   },
//   recurringInterval: String // Daily, Weekly, 2 Weeks, Monthly, Yearly
// });



// reminders Collections 
// Set 1 minute interval for cron job
// 1) Every 1 minute, search date <= reminder date and status.result == null || false
// 2) Returns collection of items []
// 3) Loop through the array: // Items belong in this array are destined to send out, only by what method, what content
// 4) Search Method: "Email" || "Phone", assuming only Email by default option and only one option
// 5) Search reminderType: "CRM - DEALS | LEADS" || "ACCOUNTING - QUOTATION | INVOICE | PAYMENT" // Determines email template
// 6) Get the Title and Content into the email template, placeholder
// 7) Send email template to the "Email", with the title and placeholder into the correct type email template
// 8) if Succeeded, status.result == true, status.response == "Successfully delivered", status.date == Date.now()
// 9) if Failed, status.result == false, status.response == error.log, status.date == Date.now()
// 10) Check if isRecurring // 
// 11) If yes, check the Interval and add into the reminderTime
// 12) Save the record with the updated fields



// examples
// By default - Calender
// When creating an event in calender
// Before submission - Set Reminder is by default on
// ProposedSchema = new Schema({
//   title: "Client ZXY Meeting", // Title of the content
//   description: "SEO & SEM & Digital Consultation", // any description of the notification message 
//   reminderMedium:{
//     "email": "User01@gmail.com",
//     "sms": "",
//   },
//   reminderTime: Date.now(),
//   status: {
//     result: null, // Null || not created // True for success || False for failure,
//     response: null, // Null || not created || Successfully delivered || Error msg
//     send_data: null // Null || not created || Execution time. 
//   },
//   reminderType : "Leads", // Leads Template 
//   created_at:{type: Date, default: Date.now},
// });




// ProposedSchema = new Schema({
//   title: "Client ZXY Meeting", // Title of the content
//   description: "SEO & SEM & Digital Consultation", // any description of the notification message 
//   reminderMedium:{
//     "email": "User01@gmail.com",
//     "sms": "",
//   },
//   reminderTime: Date.now(),
//   status: {
//     result: true, // Null || not created // True for success || False for failure,
//     response: "Successfully Delivered", // Null || not created || Successfully delivered || Error msg
//     send_data: 1823890933 // Null || not created || Execution time. 
//   },
//   reminderType : "Leads", // Leads Template 
//   created_at:{type: Date, default: Date.now},
// });




// UI UX Implementation
// a reuseable component
// redux
// Submit API || Success || Failure
// Lightweight api
// manual tag with pages that may need reminders OR possibly to tag along with saga
// Plan forward - 1) Use a generic template. 2) Introduced type templates. 3) Introduced customised templates
// Limit to certain features




// rental 
// servicing 
// new  & used car sales