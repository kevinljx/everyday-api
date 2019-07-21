"use strict";

module.exports = function (Accessrole) {
    function userOnlyQuery(ctx, userId) {
        var whereClause = { "userId": userId };
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

        return ctx;

    }

    Accessrole.beforeRemote("**", async function (ctx) {
        if (ctx.method.name.includes("find")) {
            var token = ctx.req.accessToken;
            var userId = token && token.userId;
            if (userId) {
                ctx = userOnlyQuery(ctx, userId);
            }
        }
        else if (ctx.method.name == "viewall") {
            var token = ctx.req.accessToken;
            var userId = token && token.userId;
            if (userId) {
                ctx.args.userId = userId;
            }
        }

        return;
    });


    Accessrole.viewall = async function (userId) {
        //get company from user
        var data = [];
        var BaseUser = Accessrole.app.models.BaseUser;
        var AccessGroupRole = Accessrole.app.models.AccessGroupRole;
        var AccessGroup = Accessrole.app.models.AccessGroup;
        var AccessSetting = Accessrole.app.models.AccessSetting;
        var AccessRight = Accessrole.app.models.AccessRight;

        var userobj = await BaseUser.findOne({ where: { id: userId } });
        var companyUsers = await BaseUser.find({ where: { company: userobj.company } });

        for (const user of companyUsers) {
            var companyRoles = await Accessrole.find({ where: { userId: user.id } });
            for (const role of companyRoles) {
                var dataObj = { id: role.id, name: role.name, rights: [] };
                var roleRights = await role.accessRights.find();
                for (const rRights of roleRights) {
                    var rightObj = { id: rRights.id, name: rRights.name, model: rRights.model }
                    if (rRights.categoryName) {
                        rightObj.categoryName = rRights.categoryName;
                    }
                    if (rRights.description) {
                        rightObj.description = rRights.description;
                    }
                    dataObj.rights.push(rRights);
                }
                data.push(dataObj);
            }
        }
        return data;

        /* return {
            id: role id
            name: rolename,
            rights: [ 
                { id: rightid,
                  name: right name,
                  model: 
                  method: 
                  categoryName:
                  description:
                }
            ]

        } */

    }

    Accessrole.remoteMethod('viewall', {
        accepts: { arg: 'userId', type: 'any' },
        returns: { arg: 'data', type: 'array' }
    });

    Accessrole.remoteMethod('saveRights', {
        accepts: [{ arg: 'userId', type: 'any' }, { arg: 'id', type: 'any', required: true }, { arg: 'rights', type: 'array' }],
        returns: { arg: "data", type: "array" }
    });

    Accessrole.saveRights = async function (userId, id, rights) {
        //check if role id is valid
        var BaseUser = Accessrole.app.models.BaseUser;
        
        var userobj = await BaseUser.findOne({ where: { id: userId } });
        var companyUsers = await BaseUser.find({
            where: { company: userobj.company }
        });
        var role = await Accessrole.findById(id);
        if (companyUsers.find(user => { return user.id.equals(role.userId) }) == undefined) {
            var error = new Error("Invalid role id");
            error.status = 400;
            throw error;
        }
        else {
            //delete all access role rights and update all
            var currentRights = await role.accessRights.find();
            for(const rt of currentRights){
                await role.accessRights.remove(rt);
            }                        
            
            for(const right of rights){
                await role.accessRights.add(right.id);
            }
        }
        //return updated groups and roles
        return Accessrole.viewall(userId);
    }

};
