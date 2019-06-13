'use strict';

module.exports = function(Accesssetting) {
  Accesssetting.getUserAccessSetting = async function(userId) {
    try {
      var userAccessSettings = await Accesssetting.app.models.AccessSetting.find({where: {userId: userId}})
      var userGroupRoles = []
      var userRoles = []
      var userRights = []
      userAccessSettings.forEach(async setting => {
        var groupRoles = await Accesssetting.app.models.AccessGroupRole.findById(setting.grouproleId)
        userGroupRoles.push(groupRoles)
      });
      userGroupRoles.forEach(async groupRole => {
        var roles = await (Accesssetting.app.models.AccessRole.findById(groupRole.accessRoleId))
        userRoles.push(roles)
      });
      userRoles.forEach(async role => {
        userRights = userRights.filter((right) => {
          return role.accessRights.indexOf(right) < 0
        })
        userRights.concat(role.accessRights)
      });

      return userRights;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  
  Accesssetting.remoteMethod('getUserAccessSetting', {
    accepts: {arg: 'id', type: 'string', required: true},
    returns: {arg: 'data', type: 'array'},
    http: {path:'/:id/user/accessRights', verb: 'get'},
    description: "Find all access rights belonging to a user."
  });
};
