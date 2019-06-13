'use strict';

module.exports = function(Company) {
    

    Company.signup = async function(email, password, priceplan, userInfo, companyInfo, paymentInfo) {
      //check if user already signed up with same email address

      // console.log(Company)
      console.log(email)
      console.log(password)
      console.log(priceplan)
      console.log(userInfo)
      console.log(companyInfo)
      console.log(paymentInfo)


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


          var newuser = await BaseUser.create({name: name, email: email, password: password, contact: userinfo, company: comp});

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
                       
          //all 1st sign up stuff here
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
