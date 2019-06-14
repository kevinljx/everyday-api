"use strict";

module.exports = function(Accessrole) {
  Accessrole.getAllRoleRights = async function() {
    try {
      var roles = await Accessrole.app.models.AccessRole.find();
      var roleRights = [];
      for (let i = 0; i < roles.length; i++) {
        let rights = await roles[i].accessRights.find();
        var access = {
          roleId: roles[i].id,
          rights: rights
        };
        roleRights.push(access);
      }
      return roleRights;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  Accessrole.remoteMethod("getAllRoleRights", {
    returns: { arg: "data", type: "array" },
    http: { path: "/accessRights", verb: "get" },
    description: "Get all access roles access rights data."
  });

  Accessrole.patchRoleRights = async function(id, data) {
    try {
      var role = await Accessrole.app.models.AccessRole.findById(id);
      await role.accessRights.remove()
      data.forEach(async right => {
        await role.accessRights.add(right.id)
      });
      var result = role.accessRights
      console.log(role.accessRights)
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  Accessrole.remoteMethod("patchRoleRights", {
    accepts: [
      { arg: "id", type: "string", required: true },
      { arg: "data", type: "array" }
    ],
    returns: { arg: "data", type: "array" },
    http: { path: "/:id/accessRights", verb: "patch" },
    description: "Put array of accessRights to related role."
  });
};
