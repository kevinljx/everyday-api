"use strict";
module.exports = function(Model, bootOptions = {}) {
  Model.afterRemote("**", async function(ctx, modelInstance) {
    var BaseUser = Model.app.models.BaseUser;
    if (ctx.result) {
      for (var res of ctx.result) {
        if (res.userId) {
          var userobj = await BaseUser.findById(res.userId);
          res.userInfo = {
            id: userobj.id,
            name: userobj.name
          };
        }
        if (res.createdBy) {
          var userobj = await BaseUser.findById(res.createdBy);
          res.creatorInfo = {
            id: userobj.id,
            name: userobj.name
          };
        }
        if (res.updatedBy) {
          var userobj = await BaseUser.findById(res.updatedBy);
          res.updaterInfo = {
            id: userobj.id,
            name: userobj.name
          };
        }
      }
    }
    return;
  });
};
