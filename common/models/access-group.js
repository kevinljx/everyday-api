'use strict';

module.exports = function(Accessgroup) {
    Accessgroup.beforeRemote( "**", async function( ctx) {
        if(ctx.method.name.includes("find")) {
             var token = ctx.req.accessToken;
             var userId = token && token.userId;
             if (userId){
                 //get user
                 var groupsArray = [];
                 var BaseUser = Accessgroup.app.models.BaseUser;
                 var user = await BaseUser.findById(userId);
                 var companyUsers = await BaseUser.find({where: { companyId: user.companyId}});
                 for(const cUser of companyUsers){
                     var groups = await Accessgroup.find({where: { userId: cUser.id}});
                     if(groups && groups.length > 0){
                         for(var grp of groups){
                            groupsArray.push(grp.id);
                         }
                     }
                 }
                 var whereClause = {"id": { "inq": groupsArray} };
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
};
