"use strict";
module.exports = function(Model, bootOptions = {}) {
  // give each dog a unique tag for tracking
  var bootOptions =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  const options = Object.assign(
    {
      quoteID: "quoteID",
      validateUpsert: false, // default to turning validation off
      silenceWarnings: false
    },
    bootOptions
  );

  if (!options.validateUpsert && Model.settings.validateUpsert) {
    Model.settings.validateUpsert = false;
    console.log(
      Model.pluralModelName + " settings.validateUpsert was overriden to false"
    );
  }

  if (Model.settings.validateUpsert && options.required) {
    console.log(
      "Upserts for " +
        Model.pluralModelName +
        " will fail when\n          validation is turned on and time stamps are required"
    );
  }

  Model.defineProperty(options.quoteID, {
    type: "string",
  });

  Model.observe("before save", function(ctx, next) {
   
    const SequenceSetting = Model.app.models.SequenceSetting;
  
    ctx.instance.quoteID = 'Q-MixinQuotation-01';
 
    ctx.instance.terms = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id felis ut sapien finibus vestibulum. Ut eget faucibus ligula. Integer vitae vehicula est. Aenean id neque enim. Fusce tempus nibh at augue feugiat, at aliquet elit sollicitudin. Fusce tellus massa, sollicitudin sit amet malesuada nec, sagittis dignissim neque. Nunc lacinia placerat est, a euismod odio sagittis nec. Aenean rhoncus lorem eget felis tristique facilisis. Vivamus convallis, justo nec consectetur laoreet, felis ante euismod neque, sit amet condimentum dolor justo fringilla enim. Donec pulvinar nulla non malesuada sagittis."
    
    if (ctx.options && ctx.options.skipUpdatedBy) {
      return next();
    }

    return next();
  });
};
