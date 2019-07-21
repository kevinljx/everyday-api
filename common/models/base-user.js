"use strict";
const path = require("path");
const handlebars = require("handlebars");
const fs = require("fs");
const config = require("../../server/config.json");

const readHTMLFile = function(path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

module.exports = function(Baseuser) {
  // invoke resend email
  Baseuser.verify = async function(id) {
    var user = await Baseuser.findById(id);
    console.log(user);
    // replace to Email address with user[0].email
    var options = {
      type: "email",
      to: user.baseContact.email,
      from: "Everyday <donotreply@everyday.com.sg>",
      subject: "[Everyday] Please verify your email address",
      template: path.resolve(__dirname, "../../server/views/verify.ejs"),
      redirect: `/verified`,
      user: Baseuser
    };

    user.verify(options, function(err, response) {
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

  Baseuser.on("resetPasswordRequest", function(info) {
    const url = "http://" + config.host + ":" + config.port + "/reset-password";
    const resetPassURL = url + "?accessToken=" + info.accessToken.id;

    // render html template to initiate reset password page
    readHTMLFile(
      path.resolve(__dirname, "../../server/views/resetPassword.html"),
      function(err, html) {
        var template = handlebars.compile(html);
        var replacements = { link: resetPassURL };
        var htmlToSend = template(replacements);
        Baseuser.app.models.Email.send(
          {
            // uncomment to info.email, for production.
            // to : info.email
            to: info.email,
            from: "Everyday <donotreply@everyday.com.sg>",
            subject: "[Everyday] Please reset your password",
            html: htmlToSend
          },
          function(err) {
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
  Baseuser.afterRemote("setPassword", function(context, user, next) {
    context.res.render("response", {
      title: "Password reset success",
      content: "Your password has been reset successfully",
      redirectTo: "http://localhost:3000/login",
      redirectToLinkText: "Log in"
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
      //console.log(ctx);
      return
  });

  Baseuser.beforeRemote("**", async function(ctx) {
    
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
      if(ctx.args.data.firstName !== undefined){
        baseContact.firstName = ctx.args.data.firstName;
      }
      if(ctx.args.data.lastName !== undefined){
        baseContact.lastName = ctx.args.data.lastName;
      }
      if(ctx.args.data.contact !== undefined){
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
};
