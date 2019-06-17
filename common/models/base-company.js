"use strict";

var path = require('path');


module.exports = function(Company) {
<<<<<<< HEAD
    


    Company.signup = async function(email, password, priceplan, userInfo, companyInfo, paymentInfo) {
      //check if user already signed up with same email address
      console.log('initiating Company signup')
      var BaseUser = Company.app.models.BaseUser;

      try {

        var users = await BaseUser.find({where: {email: email}});
        if(users.length > 0){
          var error = new Error("A user has already registered with this email address.");
          error.status = 400;          
=======
  Company.signup = async function(
    email,
    password,
    priceplan,
    userinfo,
    companyinfo,
    paymentinfo
  ) {
    //check if user already signed up with same email address
    var BaseUser = Company.app.models.BaseUser;
    try {
      var users = await BaseUser.find({ where: { email: email } });
      if (users.length > 0) {
        var error = new Error(
          "A user has already registered with this email address."
        );
        error.status = 400;
        throw error;
      } else {
        //get priceplan
        var Priceplan = Company.app.models.PricePlan;
        var pp = await Priceplan.findOne({ name: priceplan });
        if (pp == undefined || pp == null) {
          var error = new Error("Invalid price plan.");
          error.status = 400;
>>>>>>> dcd4acd76684e8696962a5a3439a0f5841325768
          throw error;
        }
        else {
          //get priceplan
          var Priceplan = Company.app.models.PricePlan;
<<<<<<< HEAD
          var pp = await Priceplan.findOne({name: priceplan});  
          console.log('-----pp-------')
          console.log(pp)        
=======
          var pp = await Priceplan.findOne({where: {name: priceplan}});          
>>>>>>> dcd4acd76684e8696962a5a3439a0f5841325768
          if(pp == undefined || pp == null){
            var error = new Error("Invalid price plan.");
            error.status = 400;          
            throw error;
          }
          //company info
<<<<<<< HEAD
          if (companyInfo !== undefined){
            var comp = await Company.create(companyInfo);
          } 
=======
          if (companyinfo !== undefined){
            companyinfo.pricePlanId = pp.id;
            var comp = await Company.create(companyinfo);
            
          }
>>>>>>> dcd4acd76684e8696962a5a3439a0f5841325768
          else {
            var comp = await Company.create({
              name: "Company",
              contact: {
                email: email
              },
              pricePlanId: pp.id
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
<<<<<<< HEAD


          var newuser = await BaseUser.create({name: name, email: email, password: password, contact: userInfo, company: comp});
          
          console.log('--------------------')
          console.log('creating user with baseuser create')
          console.log(newuser)
          
          console.log('--------------------')
          console.log('creating paymentInfos')
          comp.paymentInfos.create(paymentInfo)
          console.log('--------------------')

=======
        }
        //user info
        var name = email;
        if (userinfo == null) {
          userinfo = { email: email };
        } else {
          if (!userinfo.hasOwnProperty("email")) {
            userinfo.email = email;
          }
          if (userinfo.hasOwnProperty("name")) {
            name = userinfo.name;
          }
          var newuser = await BaseUser.create({name: name, email: email, password: password, contact: userinfo, company: comp});
          comp.paymentInfos.create(paymentinfo);
>>>>>>> dcd4acd76684e8696962a5a3439a0f5841325768
          //create default access rights
          var AccessGroup = Company.app.models.AccessGroup;
          var companyGroup = await AccessGroup.create({name: 'Company', userId: newuser.id, editable: false});
          var AccessGroupRole = Company.app.models.AccessGroupRole;
          var AccessSetting = Company.app.models.AccessSetting;
          var AccessRole = Company.app.models.AccessRole;
          var pRoles = await pp.defaultRoles.find();  
          
          //duplicate the role for company
          pRoles.forEach(async element =>  {
            var roleRights = await element.accessRights.find();
            var r1 = await AccessRole.create({name: element.name, userId: newuser.id, editable: false});
            roleRights.forEach(async right1 => {
              r1.accessRights.add(right1);
            });
            if(element.userId == "defaultAdmin"){
              var grouprole = await AccessGroupRole.create({tier: 3, isDefault: true, accessGroupId: companyGroup.id, accessRoleId: r1.id});
              AccessSetting.create({user: newuser, grouprole: grouprole});
            }
          }); 
                       
          // all 1st sign up stuff here

          // Need to input Email as verification
          
          // VerifyEmail
       
          console.log('Success! Account Created!')
          // Added Email as a parameter for afterRemote Method below
          return [1 , "Account created.", newuser];

        }
      }
      //user info
      var name = email;
      if (userinfo == null) {
        userinfo = { email: email };
      } else {
        if (!userinfo.hasOwnProperty("email")) {
          userinfo.email = email;
        }
        if (userinfo.hasOwnProperty("name")) {
          name = userinfo.name;
        }
        var newuser = await BaseUser.create({
          name: name,
          email: email,
          password: password,
          contact: userinfo,
          company: comp
        });
        comp.paymentInfos.create(paymentinfo);
        //create default access rights
        var AccessGroup = Company.app.models.AccessGroup;
        var companyGroup = await AccessGroup.create({
          name: "Company",
          userId: newuser.id,
          editable: false
        });
        var AccessGroupRole = Company.app.models.AccessGroupRole;
        var AccessSetting = Company.app.models.AccessSetting;
        var AccessRole = Company.app.models.AccessRole;
        var pRoles = await pp.defaultRoles.find();

        //duplicate the role for company
        pRoles.forEach(async element => {
          var roleRights = await element.accessRights.find();
          var r1 = await AccessRole.create({
            name: element.name,
            userId: newuser.id,
            removable: false
          });
          roleRights.forEach(async right1 => {
            r1.accessRights.add(right1);
          });
          if (element.userId == "defaultAdmin") {
            var grouprole = await AccessGroupRole.create({
              tier: 3,
              isDefault: true,
              accessGroupId: companyGroup.id,
              accessRoleId: r1.id
            });
            AccessSetting.create({ user: newuser, grouprole: grouprole });
          }
        });

        //all 1st sign up stuff here
        return [1, "Account created."];
      }
<<<<<<< HEAD
      
=======
      var newuser = await BaseUser.create({
        name: name,
        email: email,
        password: password,
        contact: userinfo,
        company: comp
      });
      comp.paymentInfos.create(paymentinfo);
      //create default access rights
      var AccessGroup = Company.app.models.AccessGroup;
      var companyGroup = await AccessGroup.create({
        name: "Company",
        userId: newuser.id
      });
      var AccessGroupRole = Company.app.models.AccessGroupRole;
      var AccessSetting = Company.app.models.AccessSetting;
      var pRoles = await pp.defaultRoles({
        where: { userId: "defaultAdmin" }
      });
      pRoles.forEach(async element => {
        var grouprole = await AccessGroupRole.create({
          tier: 3,
          isDefault: true,
          accessGroupId: companyGroup.id,
          accessRoleId: element.id
        });
        AccessSetting.create({ user: newuser, grouprole: grouprole });
      });

      //all 1st sign up stuff here
      return [1, "Account created."];
    } catch (e) {
      console.log(e);
      throw e;
>>>>>>> dcd4acd76684e8696962a5a3439a0f5841325768
    }
  };

<<<<<<< HEAD
    Company.remoteMethod('signup', {
          accepts: [
            {arg: 'email', type: 'string', required: true}, 
            {arg: 'password', type: 'string', required:true}, 
            {arg: 'priceplan', type: 'string', required: true},
            {arg: 'userInfo', type: 'object'},
            {arg: 'companyInfo', type: 'object'},
            {arg: 'paymentInfo', type: 'object'}
          ],
          returns: [{arg: 'success', type: 'number'}, {arg: 'msg', type: 'string'}, {arg: 'newuser', type: 'object'}]
    });



    Company.afterRemote('signup', function(context, user, next) {
        var BaseUser = Company.app.models.BaseUser;

        var options = {
          type: 'email',
          to: 'gianjie@ocdigitalnetwork.com',
          from: 'Everyday account team <donotreply@everyday.com.sg>',
          subject: 'Thanks For Registering.',
          template: path.resolve(__dirname, '../../server/views/verify.ejs'),
          redirect: '/verified',
          user: BaseUser
        };
    
     
        user.newuser.verify(options, function(err, response) {
          if (err) {
            BaseUser.deleteById(user.id);
            return next(err);
          }
          console.log(response)

    
        });


      
      next()
    });
    
=======
  Company.remoteMethod("signup", {
    accepts: [
      { arg: "email", type: "string", required: true },
      { arg: "password", type: "string", required: true },
      { arg: "priceplan", type: "string", required: true },
      { arg: "userinfo", type: "object" },
      { arg: "companyinfo", type: "object" },
      { arg: "paymentinfo", type: "object" }
    ],
    returns: [
      { arg: "success", type: "number" },
      { arg: "msg", type: "string" }
    ]
  });
>>>>>>> dcd4acd76684e8696962a5a3439a0f5841325768
};


  // Company.app.models.Email.send({
  //   to: 'gianjie@ocdigitalnetwork.com',
  //   from: 'Everyday account team <donotreply@everyday.com.sg>',
  //   subject: 'Verify your email address',
  //   html: path.resolve(__dirname, '../../server/views/verify.ejs')
  // }, function(err) {
  //   if (err) return console.log(err + '-> error sending email');
  //   console.log('> email successfully sent');
  // });