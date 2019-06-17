"use strict";

module.exports = function(Accesssetting) {
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

  Accesssetting.beforeRemote("**", async function(ctx) {
    if (ctx.method.name.includes("find")) {
      var token = ctx.req.accessToken;
      var userId = token && token.userId;
      if (userId) {
        ctx = userOnlyQuery(ctx, userId);
      }
    } else if (ctx.method.name == "viewall") {
      var token = ctx.req.accessToken;
      var userId = token && token.userId;
      if (userId) {
        ctx.args.userId = userId;
      }
    }

    return;
  });

  Accesssetting.viewall = async function(userId) {
    //get company from user
    var data = [];
    var BaseUser = Accesssetting.app.models.BaseUser;
    var AccessGroupRole = Accesssetting.app.models.AccessGroupRole;
    var AccessGroup = Accesssetting.app.models.AccessGroup;
    var AccessRole = Accesssetting.app.models.AccessRole;

    var userobj = await BaseUser.findOne({ where: { id: userId } });
    var companyUsers = await BaseUser.find({
      where: { company: userobj.company }
    });
    for (const user of companyUsers) {
      var dataObj = { userid: user.id, username: user.name };
      dataObj.groups = [];

      var settings = await Accesssetting.find({ where: { userId: user.id } });
      var setRoles = [];
      for (var i = 0; i < settings.length; i++) {
        setRoles.push(settings[i].grouproleId);
      }
      var grpRoles = await AccessGroupRole.find({
        where: { id: { inq: setRoles } }
      });
      var groupIds = [];
      for (var j = 0; j < grpRoles.length; j++) {
        var isAdded = false;
        for (var k = 0; k < groupIds.length; k++) {
          if (groupIds[k] == grpRoles[j].accessGroupId) {
            isAdded = true;
          }
        }
        if (!isAdded) {
          groupIds.push(grpRoles[j].accessGroupId);
        }
      }
      var accessGroups = await AccessGroup.find({
        where: { id: { inq: groupIds } }
      });
      for (const grp of accessGroups) {
        dataObj.groups.push({
          id: grp.id,
          name: grp.name,
          roles: []
        });
      }
      var aRoles = [];
      for (var j = 0; j < grpRoles.length; j++) {
        var isAdded = false;
        for (var k = 0; k < aRoles.length; k++) {
          if (aRoles[k] == grpRoles[j].accessRoleId) {
            isAdded = true;
          }
        }
        if (!isAdded) {
          aRoles.push(grpRoles[j].accessRoleId);
        }
      }
      var accessRoles = await AccessRole.find({
        where: { id: { inq: aRoles } }
      });
      for (const rl of accessRoles) {
        for (var i = 0; i < grpRoles.length; i++) {
          if (String(rl.id) == grpRoles[i].accessRoleId) {
            var roleData = {
              id: grpRoles[i].id,
              name: rl.name,
              tier: grpRoles[i].tier
            };
            //console.log(roleData);
            for (var j = 0; j < dataObj.groups.length; j++) {
              if (String(dataObj.groups[j].id) == grpRoles[i].accessGroupId) {
                dataObj.groups[j].roles.push(roleData);
                break;
              }
            }
          }
        }
      }
      data.push(dataObj);
    }
    return data;

    /* return {
            userid: userid,
            username: name,
            groups: [{
                id: groupid
                name: groupname,
                roles: [ {id: grouprole id, name: rolename, tier: role tier}]
            }]

        } */
  };

  Accesssetting.remoteMethod("viewall", {
    accepts: { arg: "userId", type: "any" },
    returns: { arg: "data", type: "array" }
  });

  Accesssetting.observe("after save", function(ctx, next) {
    if (ctx.instance) {
      //also save the AccessGroup user
      var AccessGroupUser = Accesssetting.app.models.AccessGroupUser;
      var AccessGroupRole = Accesssetting.app.models.AccessGroupRole;
      var BaseUser = Accesssetting.app.models.BaseUser;
      var accessGroup = AccessGroupRole.findById(
        ctx.instance.grouproleId,
        function(err, group) {
          //get company id
          BaseUser.findById(ctx.instance.userId, function(err, user) {
            AccessGroupUser.create(
              {
                userId: user.id,
                companyId: user.companyId,
                accessGroupId: group.accessGroupId,
                tier: group.tier
              },
              function(err, item) {
                next();
              }
            );
          });
        }
      );
    } else {
      next();
    }
  });

  Accesssetting.observe("before delete", function(ctx, next) {
    //get all the access setting and group first
    //then delete the access group user
  });
};
