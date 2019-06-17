
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

      var checkCount = 0;
      var checkSize = 0;
      var hasRight = false;
      function finishCheckRight(){
        checkCount++;
        if(checkCount == checkSize){
          if(hasRight){
            cb(null, true);
          }
          else {
            return reject();
          }
        }
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
        var AccessGroupRole = app.models.AccessGroupRole;
        AccessGroupRole.find({where: {id: {inq: setRoles}}}, function(err, grpRoles){
          var roleIds = [];
          for(var j=0; j < grpRoles.length; j++){
            roleIds.push(grpRoles[j].accessRoleId)
          }
          //check if role has the rights
          var AccessRole = app.models.AccessRole;
          
          var methodName = context.method.toLowerCase();
          if(context.accessType == "READ"){
            methodName = "read";
          }
          else if(methodName.includes("update")){
            methodName = "update";
          }
          else if(methodName.includes("destroy")){
            methodName = "delete";
          }
          AccessRole.find({where: {id: {inq: roleIds}}}, function(err, accRoles){
            checkSize = accRoles.length;
            accRoles.forEach(element => {
              
              element.accessRights({where: {and: [{method: methodName}, {model: context.modelName}]}}, function(err, rights){
                
                if(rights.length > 0){
                  hasRight = true;
                }
                finishCheckRight();
              });
              
            });
          })
        });


        
      });
      
      
      
      
      
    });
  };
