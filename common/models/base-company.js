'use strict';

let handlebars = require('handlebars');
let fs = require('fs')

var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
          throw err;
          callback(err);
      }
      else {
          callback(null, html);
      }
  });
};


module.exports = function(Company) {
    

    Company.signup = async function(email, password, priceplan, userInfo, companyInfo, paymentInfo) {
      //check if user already signed up with same email address

      var BaseUser = Company.app.models.BaseUser;

      try {
        var users = await BaseUser.find({where: {email: email}});
        if(users.length > 0){          
          return [0, "A user has already registered with this email address."];
        }
        else {
          //get priceplan
          var Priceplan = Company.app.models.PricePlan;
          var pp = await Priceplan.findOne({name: priceplan});          
          if(pp == undefined || pp == null){
            return [0, "Invalid price plan."];
          }
          //company info
          if (companyInfo !== undefined){
            var comp = await Company.create(companyInfo);
            
          }
          else {
            var comp = await Company.create({
              name: "Company",
              contact: {
                email: email
              }
            });
          }
          //user info
          var name = email;
          if(userInfo == null){
            userInfo = {email: email}
          }
          else {
            if(!userInfo.hasOwnProperty('email')){
              userInfo.email = email;
            }
            if(userInfo.hasOwnProperty('name')){
              name = userInfo.name;
            }
          }


          console.log(comp)
          var newuser = await BaseUser.create({name: name, email: email, password: password, contact: userInfo, company: comp});
 
          comp.paymentInfos.create(paymentInfo);

          //create default access rights
          var AccessGroup = Company.app.models.AccessGroup;
          var companyGroup = await AccessGroup.create({name: 'Company', userId: newuser.id});
          var AccessGroupRole = Company.app.models.AccessGroupRole;
          var AccessSetting = Company.app.models.AccessSetting;
          var pRoles = await pp.defaultRoles({where: {userId: "defaultAdmin"}});          
          pRoles.forEach(async element =>  {
            var grouprole = await AccessGroupRole.create({tier: 3, isDefault: true, accessGroupId: companyGroup.id, accessRoleId: element.id});
            AccessSetting.create({user: newuser, grouprole: grouprole});
          }); 
                       
          // all 1st sign up stuff here


          // Need to input Email as verification
          


          // VerifyEmail
          const HTMLTemplate = readHTMLFile(__dirname + '/Verification.html', function(err, html) {
              var template = handlebars.compile(html);
              var htmlToSend = template(template);
              return htmlToSend
          });
        

          Company.app.models.Email.send({
            to: 'gianjie@ocdigitalnetwork.com',
            from: 'igc14.gianjie@gmail.com',
            subject: 'testing email',
            html: HTMLTemplate
          }, function(err) {
            if (err) return console.log(err + '-> error sending email');
            console.log('> email successfully sent');
          });

          
          return [1,"Account created."];

        }
      }
      catch(e){
        console.log(e);
        throw e;
      }
      
      
     
    }

    Company.remoteMethod('signup', {
          accepts: [
            {arg: 'email', type: 'string', required: true}, 
            {arg: 'password', type: 'string', required:true}, 
            {arg: 'priceplan', type: 'string', required: true},
            {arg: 'userInfo', type: 'object'},
            {arg: 'companyInfo', type: 'object'},
            {arg: 'paymentInfo', type: 'object'}
          ],
          returns: [{arg: 'success', type: 'number'}, {arg: 'msg', type: 'string'}]
    });
    
};
