'use strict';

module.exports = function(Accessrole) {
  Accessrole.getAllRoleRights = async function() {
    try {
      var roles = await Accessrole.app.models.AccessRole.find()
      var roleRights = []
      for (let i = 0; i < roles.length; i++) {
        let rights = await roles[i].accessRights.find()
        var access = {
          roleID: roles[i].id,
          rights: rights
        }
        roleRights.push(access)
      }
      return [roleRights];
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  
  Accessrole.remoteMethod('getAllRoleRights', {
    returns: {arg: 'data', type: 'array'},
    http: {verb: 'get'},
    description: "Get all access roles access rights data."
  });
};
