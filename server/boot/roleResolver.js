
module.exports = function (app) {
  var Role = app.models.Role;

  // Role.create({
  //   name: 'admin'
  //  }, function(err, role) {
  //   if (err) return console.log(err);
  //   console.log(role);
  //   // Make Bob an admin
  //   role.principals.create({
  //     principalType: RoleMapping.USER,
  //     principalId: role.id
  //   }, function(err, principal) {
  //     if (err) return console.log(err);
  //     console.log(principal);
  //   });
  // });


  Role.registerResolver('companySet', function (role, context, cb) {
    function reject(errormsg) {
      if (errormsg) {
        var error = new Error(errormsg);
        error.status = 403;
        cb(error, false);
      }
      else {
        process.nextTick(function () {
          cb(null, false);
        });
      }

    }

    var checkCount = 0;
    var checkSize = 0;
    var hasRight = false;
    var AccessSetting = app.models.AccessSetting;
    var methodName = context.method.toLowerCase();
    var firstCheck = true;
    if (context.accessType == "READ") {
      methodName = "read";
    }
    else if (methodName.includes("update") || context.accessType == "WRITE") {
      methodName = "update";
    }
    else if (methodName.includes("destroy")) {
      methodName = "delete";
    }

    function finishCheckRight() {
      checkCount++;
      if (checkCount == checkSize) {
        if (hasRight) {
          cb(null, true);
        }
        else {
          if (firstCheck) {
            checkCount = 0;
            checkAgain();
          }
          else {
            return reject("You do not have the correct access rights.");
          }
        }
      }
    }

    function checkAgain() {
      //get parent model
      firstCheck = false;
      AccessRole.find({ where: { and: [{ companyId: user.companyId }, { tier: 0 }] } }, function (err, roles) {
        if (err) return reject();
        var rightCats = roles[0].accessCategories();
        //find the parent model
        var parentModel = "";
        for (var i = 0; i < rightCats.length; i++) {
          var rights = rightCats[i].accessrights;
          for (var j = 0; j < rights.length; j++) {
            if (rights[j].model == context.modelName) {
              if (rights[j].parentModel) {
                parentModel = rights[j].parentModel;
              }
              j = rights.length;
              i = rightCats.length;
            }
            else {
              var methods = rights[j].methods();
              for (var k = 0; k < methods.length; k++) {
                if (rights[j].model == context.modelName && methods[k].name == methodName) {
                  if (methods[k].parentModel) {
                    parentModel = rights[j].parentModel;
                    j = rights.length;
                    i = rightCats.length;
                  }
                  if (methods[k].parentMethod) {
                    methodName = methods[k].parentMethod;
                  }
                }
              }
            }
          }
        }
        checkSetting(parentModel, methodName);
      });
    }

    // do not allow anonymous users
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    checkSetting(context.modelName, methodName);

    //check user access role
    function checkSetting(roleModel, roleMethod) {
      AccessSetting.find({ where: { userId: userId } }, function (err, settings) {
        if (err) return reject();
        var setRoles = [];
        for (var i = 0; i < settings.length; i++) {
          setRoles.push(settings[i].roleId);
        }
        var AccessRole = app.models.AccessRole;
        AccessRole.find({ where: { id: { inq: setRoles } } }, function (err, accRoles) {


          //find model and method name
          checkSize = accRoles.length;
          //if not found get company admin and find parent
          accRoles.forEach(element => {
            var categories = role.accessCatgories();
            for (var i = 0; i < categories.length; i++) {
              var rights = categories[i].accessrights;
              for (var j = 0; j < rights.length; j++) {
                var methods = rights[j].methods();
                for (var k = 0; k < methods.length; k++) {
                  if (rights[j].model == roleModel && methods[k].name == roleMethod) {
                    hasRight = true;
                  }
                }
              }
            }
            finishCheckRight();
          });



        });


      });
    }


  });

};
