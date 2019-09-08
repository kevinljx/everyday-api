"use strict";
const path = require("path");
const handlebars = require("handlebars");
const fs = require("fs");
const config = require("../../server/config.json");

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

module.exports = function (Baseuser) {
  // invoke resend email
  Baseuser.verify = async function (id) {
    var user = await Baseuser.findById(id);
    // console.log(user);
    // replace to Email address with user[0].email
    var options = {
      type: "email",
      to: user.baseContact.email,
      from: "Esther from Everyday <hello@everydaycrm.sg>",
      subject: "Please verify your email address",
      template: path.resolve(__dirname, "../../server/views/verify.ejs"),
      redirect: `/verified`,
      user: Baseuser
    };

    user.verify(options, function (err, response) {
      if (err) {
        // Prevent Spam Accounts
        // BaseUser.deleteById(user.id);
        return next(err);
      }
      // will replace exisiting token with new, so previously sent verification emails will be invalidated
    });

    return [1, "success"];
  };

  Baseuser.remoteMethod("verify", {
    accepts: [{ arg: "id", type: "string" }],
    returns: [
      { arg: "success", type: "number" },
      { arg: "msg", type: "string" }
    ]
  });

  Baseuser.on("resetPasswordRequest", function (info) {
    const url = "http://" + config.host + ":" + config.port + "/reset-password";
    const resetPassURL = url + "?accessToken=" + info.accessToken.id;

    // render html template to initiate reset password page
    readHTMLFile(
      path.resolve(__dirname, "../../server/views/resetPassword.html"),
      function (err, html) {
        var template = handlebars.compile(html);
        var replacements = { link: resetPassURL };
        var htmlToSend = template(replacements);
        Baseuser.app.models.Email.send(
          {
            // uncomment to info.email, for production.
            to : info.email,
            from: "Ester from Everyday <hello@everydaycrm.sg>",
            subject: "Reset your password",
            html: htmlToSend
          },
          function (err) {
            if (err) return console.log("> error sending password reset email");
            // Sending password reset email to user
          }
        );
      }
    );
  });

  // to be implmented in the user admin to change password
  // Baseuser.afterRemote('changePassword', function(context, user, next) {
  //   context.res.render('response', {
  //     title: 'Password changed successfully',
  //     content: 'Please login again with new password',
  //     redirectTo: '/',
  //     redirectToLinkText: 'Log in'
  //   });
  // });

  // render UI page after password reset
  // redirectTo actualy everyday domain website
  Baseuser.afterRemote("setPassword", function (context, user, next) {
    context.res.render("response", {
      title: "Password reset success",
      content: "Your password has been reset successfully",
      redirectTo: "https://cloud.everydaycrm.sg/login",
      redirectToLinkText: "Click to login"
    });
  });

  function companyOnlyQuery(ctx, companyId) {
    var whereClause = { companyId: companyId };
    var filter = ctx.args.filter || {};

    if (filter.where) {
      if (filter.where.and) {
        filter.where.and.push(whereClause);
      } else {
        var tmpWhere = filter.where;
        filter.where = {};
        filter.where.and = [tmpWhere, whereClause];
      }
    } else {
      filter.where = whereClause;
    }
    ctx.args.filter = filter;

    return ctx;
  }

  Baseuser.observe('access', async function (ctx) {
    var token = ctx.options && ctx.options.accessToken;
    var userId = token && token.userId;
    if (!userId) {
      if (ctx.query.userId != null) {
        userId = ctx.query.userId;
      }
      else {
        return;
      }
    }  // no access token, internal or test request;
    var user = await Baseuser.findById(userId);
    var whereClause = { companyId: user.companyId };
    ctx.query = ctx.query || {};
    if (ctx.query.where) {
      if (ctx.query.where.and) {

        ctx.query.where.and.push(whereClause);

      } else {
        var tmpWhere = ctx.query.where;
        ctx.query.where = {};
        ctx.query.where.and = [tmpWhere, whereClause];

      }
    } else {
      ctx.query.where = whereClause;
    }
    return
  });

  Baseuser.beforeRemote("**", async function (ctx) {

    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    /*
    if (ctx.method.name.includes("find")) {
      //show all company users
      var user = await Baseuser.findById(userId);
      ctx = companyOnlyQuery(ctx, user.companyId);
    } else */
    if (ctx.method.name.includes("create")) {
      //include companyId
      var user = await Baseuser.findById(userId);
      ctx.args.data.companyId = user.companyId;
      var baseContact = {};
      if (ctx.args.data.firstName !== undefined) {
        baseContact.firstName = ctx.args.data.firstName;
      }
      if (ctx.args.data.lastName !== undefined) {
        baseContact.lastName = ctx.args.data.lastName;
      }
      if (ctx.args.data.contact !== undefined) {
        baseContact.contactNo = ctx.args.data.contact;
      }
      ctx.args.data.baseContact = baseContact;

      ctx.args.data.emailVerified = true;



    }
  });

  /*
  Baseuser.observe("before delete", async function (ctx) {
    //cannot delete if lead, deal, customer, account, quotation
    var allusers = await Baseuser.find({ where: ctx.where });

    var Lead = Baseuser.app.models.Lead;
    var Deal = Baseuser.app.models.Deal;
    var Customer = Baseuser.app.models.Customer;
    var Account = Baseuser.app.models.Account;
    var Quotation = Baseuser.app.models.Quotation;
    for (const user of allusers) {
      var count = await Lead.count({ userId: user.id });
      if (count > 0) {
        throw new Error(
          "There is data associated with this user. User cannot be deleted."
        );

      }
    }
    return;
  });
  */

 Baseuser.signup = async function (
  email,
  password,
  priceplan,
  userInfo,
  companyInfo,
  paymentInfo
) {
  //check if user already signed up with same email address
  //var BaseUser = Company.app.models.BaseUser;
  var Company = Baseuser.app.models.BaseCompany;
  try {
    var users = await Baseuser.find({ where: { email: email } });
    if (users.length > 0) {
      var error = new Error(
        "A user has already registered with this email address."
      );
      error.status = 400;
      throw error;
    } else {
      //get priceplan
      var Priceplan = Baseuser.app.models.PricePlan;
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
      var name = userInfo.firstName + " " + userInfo.lastName;
      //console.log(userInfo);
      if (userInfo == null) {
        userInfo = { email: email };
      } else {
        if (!userInfo.hasOwnProperty("email")) {
          userInfo.email = email;
        }
        if (userInfo.hasOwnProperty("name")) {
          name = userInfo.firstName + " " + userInfo.lastName;;
        }
      }

      var newuser = await Baseuser.create({
        name: name,
        email: email,
        password: password,
        baseContact: userInfo,
        company: comp
      });


      comp.paymentInfos.create(paymentInfo);

      //create default access rights
      var AccessGroup = Baseuser.app.models.AccessGroup;
      var companyGroup = await AccessGroup.create({
        name: "Company",
        userId: newuser.id
      });
      var AccessGroupRole = Baseuser.app.models.AccessGroupRole;
      var AccessSetting = Baseuser.app.models.AccessSetting;
      var AccessRole = Baseuser.app.models.AccessRole;
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
      var LeadStatus = Baseuser.app.models.LeadStatus;
      var LeadSource = Baseuser.app.models.LeadSource;
      var LeadInterest = Baseuser.app.models.LeadInterestLevel;
      var LeadIndustry = Baseuser.app.models.LeadIndustry;
      var DealType = Baseuser.app.models.DealType;
      var DealStage = Baseuser.app.models.DealStage;
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

Baseuser.remoteMethod("signup", {
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

Baseuser.afterRemote("signup", function (context, user, next) {
  //var BaseUser = Company.app.models.BaseUser;

  var options = {
    type: "email",
    to: context.args.email,
    // to : `igc14.gianjie@gmail.com`,
    from: "Esther from Everyday <hello@everydaycrm.sg>",
    subject: "Thank you for registering",
    template: path.resolve(__dirname, "../../server/views/verify.ejs"),
    redirect: `/verified`,
    user: Baseuser,
    // host: 'api.everydaycrm.sg'
  };

  user.newuser.verify(options, function (err, response) {
    if (err) {
      console.log('err')
      // Prevent Spam Accounts
      // BaseUser.deleteById(user.id);
      return next(err);
    }

    // No error, send new user email verification
  });

  next();
});
};
