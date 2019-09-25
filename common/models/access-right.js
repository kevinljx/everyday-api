'use strict';

module.exports = function (Accessright) {

    /*
   Accessright.beforeRemote( "**", async function( ctx) {
       if(ctx.method.name.includes("find")) {
            var token = ctx.req.accessToken;
            var userId = token && token.userId;
            if (userId){
                //get user
                var rightsArray = [];
                var BaseUser = Accessright.app.models.BaseUser;
                var user = await BaseUser.findById(userId);
                var comp = await user.company.get();
                var pp = await comp.pricePlan.get();
                var companyRights = await pp.accessRights.find();
                for(const right of companyRights){
                    rightsArray.push(right.id);
                }
                var whereClause = {"id": { "inq": rightsArray} };
                var filter = ctx.args.filter || {};
        
                if (filter.where) {
                    if (filter.where.and) {
                        
                        filter.where.and.push(whereClause);
                        
                    } else {
                        var tmpWhere = filter.where;
                        filter.where = {};
                        filter.where.and = [tmpWhere, whereClause];
                        
                    }
                } else {
                    filter.where = whereClause;
                }
                ctx.args.filter = filter;
                
            }
       }
        
        return;
    });
    */
};
