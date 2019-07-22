"use strict";
module.exports = function (Model, bootOptions = {}) {
  // give each dog a unique tag for tracking
  var bootOptions =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  const options = Object.assign(
    {
      createdBy: "createdBy",
      updatedBy: "updatedBy",
      userId: "userId",
      required: true,
      validateUpsert: false, // default to turning validation off
      silenceWarnings: false
    },
    bootOptions
  );

  if (!options.validateUpsert && Model.settings.validateUpsert) {
    Model.settings.validateUpsert = false;
    // console.log(Model.pluralModelName + ' settings.validateUpsert was overriden to false');
  }

  if (Model.settings.validateUpsert && options.required) {
    // console.log('Upserts for ' + Model.pluralModelName + ' will fail when\n          validation is turned on and time stamps are required');
  }

  Model.defineProperty(options.createdBy, {
    type: "string",
    required: options.required
  });

  Model.defineProperty(options.updatedBy, {
    type: "string",
    required: options.required
  });

  /*
    Model.defineProperty(options.userId, {
        type: 'string',
        required: options.required,
        mongodb: {dataType: 'ObjectId'}
    });
    */
  Model.observe('loaded', async function (ctx) {
    const BaseUser = Model.app.models.BaseUser;
    if (ctx.data.userId != null && typeof ctx.data.userId != "string") {
      var userobj = await BaseUser.findById(ctx.data.userId);
      ctx.data.userInfo = {
        id: userobj.id,
        name: userobj.name
      };
    }
    if (ctx.data.createdBy) {
      var userobj = await BaseUser.findById(ctx.data.createdBy);
      ctx.data.creatorInfo = {
        id: userobj.id,
        name: userobj.name
      };
    }
    if (ctx.data.updatedBy) {
      var userobj = await BaseUser.findById(ctx.data.updatedBy);
      ctx.data.updaterInfo = {
        id: userobj.id,
        name: userobj.name
      };
    }
    return;
  });

  Model.observe('before save', function (ctx, next) {

    var token = ctx.options && ctx.options.accessToken;
    var userId = token && token.userId;
    if (ctx.options && ctx.options.skipUpdatedBy) {
      return next();
    }


    if (!userId) {
      return next();
    }

    if (ctx.instance) {
      if (ctx.isNewInstance) {
        // FIXME: check for support of ctx.isNewInstance
        ctx.instance[options.createdBy] = userId;
        if (ctx.instance[options.userId] === undefined || ctx.instance[options.userId] == null) {
          ctx.instance[options.userId] = userId;
        }
      }
      ctx.instance[options.updatedBy] = userId;
    } else {
      ctx.data[options.updatedBy] = userId;
    }
    return next();
  });
};
