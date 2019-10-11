"use strict";

module.exports = function (Accesssetting) {
  Accesssetting.getUserAccessSetting = async function (userId) {
    try {
      var userAccessSettings = await Accesssetting.app.models.AccessSetting.find(
        { where: { userId: userId } }
      );
      var userRoles = [];
      var userRightCats = {};
      var userRights = [];
      for (const setting of userAccessSettings) {
        var role = await setting.role.get();
        var categories = role.accessRightCategories;
        for (var i = 0; i < categories.length; i++) {
          var cat = categories[i];
          var catname = cat.name.replace(/\s+/g, '');
          //console.log(catname);
          userRightCats[catname] = cat.accessrights;
        }

      }
      var keys = Object.keys(userRightCats);
      for (var key of keys) {

        userRights.push(userRightCats[key]);
      }

      return userRights;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  Accesssetting.remoteMethod("getUserAccessSetting", {
    accepts: { arg: "userId", type: "any" },
    returns: { arg: "data", type: "array" },
    http: { path: "/user/accessRights", verb: "get" },
    description: "Find all access rights belonging to a user."
  });

  function userOnlyQuery(ctx, userId) {
    var whereClause = { userId: userId };
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

  Accesssetting.beforeRemote("**", async function (ctx) {
    if (ctx.method.name.includes("find")) {
      var token = ctx.req.accessToken;
      var userId = token && token.userId;
      if (userId) {
        ctx = userOnlyQuery(ctx, userId);
      }
    } else if (ctx.method.name == "viewall" || ctx.method.name == "getUserAccessSetting" || ctx.method.name == "saveUserRights") {
      var token = ctx.req.accessToken;
      var userId = token && token.userId;
      if (userId) {
        ctx.args.userId = userId;
      }
    }

    return;
  });

  Accesssetting.viewall = async function (userId) {
    //get company from user
    var data = [];
    var BaseUser = Accesssetting.app.models.BaseUser;
    //var AccessRole = Accesssetting.app.models.AccessRole;

    var userobj = await BaseUser.findOne({ where: { id: userId } });

    var dataObj = { userid: userobj.id, username: userobj.name };
    dataObj.roles = [];

    var settings = await Accesssetting.find({ where: { userId: userobj.id } });
    for (var i = 0; i < settings.length; i++) {
      //console.log(settings[i]);
      await settings[i].role.get();
      var role = settings[i].role();
      dataObj.roles.push(role);
    }

    data.push(dataObj);
    return data;

  };

  Accesssetting.remoteMethod('viewall', {
    accepts: { arg: 'userId', type: 'any' },
    returns: { arg: 'data', type: 'array' }
  });


  Accesssetting.remoteMethod("saveUserRights", {
    accepts: [{ arg: "userId", type: "any" }, { arg: "saveUserId", type: "any" }, { arg: "rights", type: "array" }],
    returns: { arg: "data", type: "array" }
  });

  Accesssetting.saveUserRights = async function (userId, saveUserId, roles) {
    //check if user id and save user is in the same company
    //rights in the form of groups, then rights
    var BaseUser = Accesssetting.app.models.BaseUser;
    var userobj = await BaseUser.findById(userId);
    var saveUser = await BaseUser.findById(saveUserId);
    if (!userobj.companyId.equals(saveUser.companyId)) {
      var error = new Error("Invalid user");
      error.status = 400;
      throw error;
    }
    //clear all user access rights
    await Accesssetting.destroyAll({ userId: saveUserId });
    for (const role of roles) {
      await Accesssetting.create({ userId: saveUserId, roleId: role.id, companyId: userobj.companyId });

    }
    return Accesssetting.getUserAccessSetting(userId);

  }


};
