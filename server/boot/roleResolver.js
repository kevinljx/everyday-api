
module.exports = function(app) {
    var Role = app.models.Role;

    /*
    Role.create({
      name: 'admin'
     }, function(err, role) {
      if (err) return debug(err);
      debug(role);

      // Make Bob an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[2].id
      }, function(err, principal) {
        if (err) return debug(err);
        debug(principal);
      });
    });
    */


    Role.registerResolver('companySet', function(role, context, cb) {
      function reject() {
        process.nextTick(function() {
          cb(null, false);
        });
      }
        
      // do not allow anonymous users
      var userId = context.accessToken.userId;
      if (!userId) {
        return reject();
      }

      //check user access role
      var AccessSetting = app.models.AccessSetting;
      AccessSetting.find({where: {userId: userId}}, function(err, settings){
        if(err) return reject();
        var setRoles = [];
        for(var i=0; i < settings.length; i++){
          setRoles.push(settings[i].grouproleId);
        }
        console.log(setRoles);

        //check if role has the rights
        //console.log(context.accessType);
      });
      
      
      
      cb(null, true);
      
    });
  };
