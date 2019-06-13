'use strict';

module.exports = function(Basemodel) {
    
    Basemodel.observe('access', (ctx, next)=>{

        var token = ctx.options && ctx.options.accessToken;
        var userId = token && token.userId;
        if (!userId) return next();  // no access token, internal or test request;
        var whereClause = {userId: userId};
        
        //check if model is access related. to avoid circular calls
        
            

            //first get user access setting
            /*
            var AccessSetting = app.models.AccessSetting;
            AccessSetting.find({where: {userId: userId}}, function(err, settings){
                for(var i=0; i < settings.length; i++){
                    setRoles.push(settings[i].grouproleId);
                  }
                  var AccessGroupRole = app.models.AccessGroupRole;
                  AccessGroupRole.find({where: {id: {inq: setRoles}}}, function(err, grpRoles){
                    var roleIds = [];
                    if(grpRoles.tier < 3){

                    }
                  });
            });
            */
        

        // this part is tricky because you may need to add
        // the userId filter to an existing where-clause

        ctx.query = ctx.query || {};
        if (ctx.query.where) {
            if (ctx.query.where.and) {
                
                ctx.query.where.and.push(whereClause);
                
            } else {
                var tmpWhere = ctx.query.where;
                ctx.query.where = {};
                ctx.query.where.and = [tmpWhere, whereClause];
                
            }
        } else {
            ctx.query.where = whereClause;
        }
        next();
    });
    
};
