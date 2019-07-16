'use strict';

module.exports = function (Accessgroup) {
    Accessgroup.beforeRemote("**", async function (ctx) {
        if (ctx.method.name.includes("find")) {
            var token = ctx.req.accessToken;
            var userId = token && token.userId;
            if (userId) {
                //get user
                var groupsArray = [];
                var BaseUser = Accessgroup.app.models.BaseUser;
                var user = await BaseUser.findById(userId);
                var companyUsers = await BaseUser.find({ where: { companyId: user.companyId } });
                for (const cUser of companyUsers) {
                    var groups = await Accessgroup.find({ where: { userId: cUser.id } });
                    if (groups && groups.length > 0) {
                        for (var grp of groups) {
                            groupsArray.push(grp.id);
                        }
                    }
                }
                var whereClause = { "id": { "inq": groupsArray } };
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
        else if (ctx.method.name == "viewall" || ctx.method.name == "saveRoles") {
            var token = ctx.req.accessToken;
            var userId = token && token.userId;
            if (userId) {
                ctx.args.userId = userId;
            }
        }

        return;
    });

    Accessgroup.viewall = async function (userId) {
        //get company from user
        var data = [];
        var BaseUser = Accessgroup.app.models.BaseUser;
        var AccessRole = Accessgroup.app.models.AccessRole;
        var AccessGroupRole = Accessgroup.app.models.AccessGroupRole;

        var userobj = await BaseUser.findOne({ where: { id: userId } });
        var companyUsers = await BaseUser.find({
            where: { company: userobj.company }
        });
        for (const user of companyUsers) {

            var accessGroups = await Accessgroup.find({
                where: { userId: user.id }
            });
            for (const grp of accessGroups) {
                var dataObj = { id: grp.id, name: grp.name, roles: [] };
                //find accessgrouprole
                var agr = await AccessGroupRole.find({
                    where: { accessGroupId: grp.id }
                });
                for (const a1 of agr) {
                    var role = await AccessRole.findById(a1.accessRoleId);
                    if (role) {
                        dataObj.roles.push({
                            id: role.id,
                            name: role.name,
                            tier: a1.tier
                        })
                    }
                }
                data.push(dataObj);

            }
        }
        return data;

        /* return {
                {
                    id: groupid
                    name: groupname,
                    roles: [ {id: grouprole id, name: rolename, tier: role tier}]
                }
    
            } */
    };

    Accessgroup.remoteMethod('viewall', {
        accepts: { arg: 'userId', type: 'any' },
        returns: { arg: 'data', type: 'array' }
    });

    Accessgroup.remoteMethod('saveRoles', {
        accepts: [{ arg: 'userId', type: 'any' }, { arg: 'id', type: 'string', required: true }, { arg: 'roles', type: 'array' }],
        returns: { arg: "success", type: "number" }
    });

    Accessgroup.saveRoles = async function (userId, id, roles) {
        //check if group id is valid
        var BaseUser = Accessgroup.app.models.BaseUser;
        var AccessGroupRole = Accessgroup.app.models.AccessGroupRole;
        var userobj = await BaseUser.findOne({ where: { id: userId } });
        var companyUsers = await BaseUser.find({
            where: { company: userobj.company }
        });
        var group = await Accessgroup.findById(id);
        if (companyUsers.find(user => { return user.id == group.userId }) == undefined) {
            var error = new Error("Invalid group id");
            error.status = 400;
            throw error;
        }
        else {
            //cannot clean and remove as all users will be affected
            for (const role of roles) {

            }
        }
        return 1;
    }

};
