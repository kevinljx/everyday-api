'use strict';

module.exports = function (Basemodel) {


    Basemodel.observe('access', async function (ctx) {
        var token = ctx.options && ctx.options.accessToken;
        var userId = token && token.userId;
        if (!userId) {
            if (ctx.query.userId != null) {
                userId = ctx.query.userId;
            }
        }  // no access token, internal or test request;
        var whereClause = { userId: userId };

        var AccessSetting = Basemodel.app.models.AccessSetting;
        //get user setting
        var settings = await AccessSetting.find({ where: { userId: userId } });
        //get roles
        var setRoles = settings.map(e => { return e.grouproleId });
        var AccessGroupRole = Basemodel.app.models.AccessGroupRole;
        var accessgrpRoles = await AccessGroupRole.find({ where: { id: { inq: setRoles } } });

        var roleIds = [[], [], []];
        var groupIds = [[], [], []];
        for (const groupRole of accessgrpRoles) {
            roleIds[groupRole.tier - 1].push(groupRole.accessRoleId);
            groupIds[groupRole.tier - 1].push(groupRole.accessGroupId);
        }
        //which role has the model
        var allOwnerIds = [];
        //find Company Group id
        var BaseUser = Basemodel.app.models.BaseUser;
        var AccessRole = Basemodel.app.models.AccessRole;
        var AccessGroup = Basemodel.app.models.AccessGroup;
        var AccessGroupUser = Basemodel.app.models.AccessGroupUser;
        //ignore tier 1 because can only see own
        //console.log(ctx.Model.name);
        var user = await BaseUser.findById(userId);
        for (var i = 1; i < roleIds.length; i++) {
            var isCompany = false;
            if (roleIds[i].length > 0) {
                var roles = await AccessRole.find({ where: { id: { inq: roleIds[i] } } });
                for (var j = 0; j < roles.length; j++) {
                    var rights = await roles[j].accessRights({ where: { model: ctx.Model.name } });
                    if (rights && rights.length > 0) {
                        var groupObj = await AccessGroup.findById(groupIds[i][j]);
                        if (groupObj.name == "Company") {
                            isCompany = true;
                            break;
                        }

                        var groupUsers = await AccessGroupUser.find({ where: { and: [{ tier: { lt: i + 2 } }, { accessGroupId: groupIds[i][j] }] } });
                        var ownerIds = groupUsers.map(e => { return e.userId });
                        allOwnerIds = allOwnerIds.concat(ownerIds);
                    }
                }
                if (isCompany) {
                    var groupUsers = await AccessGroupUser.find({ where: { and: [{ tier: { lt: i + 2 } }, { companyId: user.companyId }] } });
                    var ownerIds = await groupUsers.map(e => { return e.userId });
                    allOwnerIds = allOwnerIds.concat(ownerIds);
                }
            }
        }
        if (allOwnerIds.length > 0) {
            whereClause = { userId: { inq: allOwnerIds } };
        }

        /*
        if(roleIds[2].length > 0){
            var roles = await AccessRole.find({where: {id: {inq: roleIds[2]}}});
            
            for(var i=0; i < roles.length; i++){
                var rights = await roles[i].accessRights.find({where: {model: ctx.modelName}});
                if(rights && rights.length > 0){
                    var groupObj = await AccessGroup.findById(groupIds[2][i]);
                    
                    var agroupRoles = await AccessGroupRole.find({where: {and: [ {accessGroupId: groupIds[2][i]}, {tier: {lt: 4}} ]}});
                    var agroupRoleIds = agroupRoles.map(function (e) { return e.id; });
                    var groupSettings = await AccessSetting.find({where: {id: {inq: agroupRoleIds}}});
                    var ownerIds = groupSettings.map(function(e) { return e.id});
                    allOwnerIds.concat(ownerIds);
                   
                }
            }
        }
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
        //console.log(ctx);
        return
    });

};
