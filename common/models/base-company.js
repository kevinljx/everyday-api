"use strict";

const path = require("path");

module.exports = function (Company) {
  Company.signup = async function (
    email,
    password,
    priceplan,
    userInfo,
    companyInfo,
    paymentInfo
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
          throw error;
        }
        //company info
        if (companyInfo !== undefined) {
          companyInfo.pricePlanId = pp.id;
          var comp = await Company.create(companyInfo);
        } else {
          var comp = await Company.create({
            name: "Company",
            pricePlanId: pp.id,
            contact: {
              email: email
            }
          });
        }

        // user info
        // { firstName: 'Hello', lastName: 'World' }
        var name = userInfo.lastName + " " + userInfo.firstName;

        if (userInfo == null) {
          userInfo = { email: email };
        } else {
          if (!userInfo.hasOwnProperty("email")) {
            userInfo.email = email;
          }
          if (userInfo.hasOwnProperty("name")) {
            name = userInfo.lastName + " " + userInfo.firstName;;
          }
        }

        var newuser = await BaseUser.create({
          name: name,
          email: email,
          password: password,
          contact: userInfo,
          company: comp
        });

        comp.paymentInfos.create(paymentInfo);

        //create default access rights
        var AccessGroup = Company.app.models.AccessGroup;
        var companyGroup = await AccessGroup.create({
          name: "Company",
          userId: newuser.id
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
            userId: newuser.id
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

        //copy leads and deals stuff
        var LeadStatus = Company.app.models.LeadStatus;
        var LeadSource = Company.app.models.LeadSource;
        var LeadInterest = Company.app.models.LeadInterestLevel;
        var LeadIndustry = Company.app.models.LeadIndustry;
        var DealType = Company.app.models.DealType;
        var DealStage = Company.app.models.DealStage;
        var statuses = await LeadStatus.find({ where: { userId: "default" } });
        statuses.forEach(async element => {
          LeadStatus.create({
            name: element.name,
            color: element.color,
            userId: newuser.id
          });
        });
        var sources = await LeadSource.find({ where: { userId: "default" } });
        sources.forEach(async element => {
          LeadSource.create({
            name: element.name,
            color: element.color,
            userId: newuser.id
          });
        });
        var interests = await LeadInterest.find({ where: { userId: "default" } });
        interests.forEach(async element => {
          LeadInterest.create({
            name: element.name,
            level: element.level,
            userId: newuser.id
          });
        });
        var industries = await LeadIndustry.find({ where: { userId: "default" } });
        industries.forEach(async element => {
          LeadIndustry.create({
            name: element.name,
            userId: newuser.id
          });
        });
        var dealtypes = await DealType.find({ where: { userId: "default" } });
        dealtypes.forEach(async element => {
          DealType.create({
            name: element.name,
            color: element.color,
            userId: newuser.id
          });
        });
        var dealstages = await DealStage.find({ where: { userId: "default" } });
        dealstages.forEach(async element => {
          DealStage.create({
            name: element.name,
            chance: element.chance,
            color: element.color,
            step: element.step,
            invoice: element.invoice,
            quotation: element.quotation,
            description: element.description,
            userId: newuser.id
          });
        });

        return [1, "Account created.", newuser];
      }
    } catch (e) {
      throw e;
    }
  };

  Company.remoteMethod("signup", {
    accepts: [
      { arg: "email", type: "string", required: true },
      { arg: "password", type: "string", required: true },
      { arg: "priceplan", type: "string", required: true },
      { arg: "userInfo", type: "object" },
      { arg: "companyInfo", type: "object" },
      { arg: "paymentInfo", type: "object" }
    ],
    returns: [
      { arg: "success", type: "number" },
      { arg: "msg", type: "string" },
      { arg: "newuser", type: "object" }
    ]
  });

  Company.afterRemote("signup", function (context, user, next) {
    var BaseUser = Company.app.models.BaseUser;
    
    var options = {
      type: "email",
      to: context.args.email,
      // to: 'gianjie@ocdigitalnetwork.com',
      from: "Everyday <donotreply@everyday.com.sg>",
      subject: "[Everyday] Thank you for registering",
      template: path.resolve(__dirname, "../../server/views/verify.ejs"),
      redirect: `/verified`,
      user: BaseUser
    };

    user.newuser.verify(options, function (err, response) {
      if (err) {
        // Prevent Spam Accounts
        // BaseUser.deleteById(user.id);
        return next(err);
      }
      // No error, send new user email verification
    });
    
    next();
  });
};
