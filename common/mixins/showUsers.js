"use strict";
module.exports = function(Model, bootOptions = {}) {
  Model.afterRemote("**", async function(ctx, modelInstance) {
    var BaseUser = Model.app.models.BaseUser;
    if (ctx.result && ctx.result.length > 0) {
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
    } else {
      if (ctx.result.userId) {
        var userobj = await BaseUser.findById(ctx.result.userId);
        ctx.result.userInfo = {
          id: userobj.id,
          name: userobj.name
        };
      }
      if (ctx.result.createdBy) {
        var userobj = await BaseUser.findById(ctx.result.createdBy);
        ctx.result.creatorInfo = {
          id: userobj.id,
          name: userobj.name
        };
      }
      if (ctx.result.updatedBy) {
        var userobj = await BaseUser.findById(ctx.result.updatedBy);
        ctx.result.updaterInfo = {
          id: userobj.id,
          name: userobj.name
        };
      }
    }
    return;
  });
};
