'use strict';

module.exports = function(Accesssetting) {
  Accesssetting.getUserAccessSetting = async function(userId) {
    try {
      var userAccessSettings = await Accesssetting.app.models.AccessSetting.find({where: {userId: userId}})
      return userAccessSettings;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  
  Accesssetting.remoteMethod('getUserAccessSetting', {
    accepts: {arg: 'userId', type: 'string', required: true},
    returns: {arg: 'data', type: 'array'},
    http: {verb: 'get'},
    description: "Find all access settings belonging to a user."
  });
};
