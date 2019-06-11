'use strict';

module.exports = function(Accessrole) {
  Accessrole.getAllRoleRights = async function() {
    var roles = await Accessrole.app.models.AccessRole.find()
    var rolesRights = []
    for (let i = 0; i < roles.length; i++) {
      var rights = await roles[i].accessRights.find()
      var accessRights = {
        roleID: roles[i].id,
        rights: rights
      }
      rolesRights.push(accessRights)
    }
    try {
        return [rolesRights];
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  
  Accessrole.remoteMethod('getAllRoleRights', {
    returns: {arg: 'data', type: 'array'},
    http: {verb: 'get'}
  });
};
