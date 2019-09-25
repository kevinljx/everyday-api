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
        var data = {};
        var BaseUser = Accessrole.app.models.BaseUser;
        var AccessSetting = Accessrole.app.models.AccessSetting;
        var AccessRight = Accessrole.app.models.AccessRight;

        function findParent(siblings, pid) {
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i] == pid) {
                    return siblings[i];
                }
                else {
                    var foundchild = findParent(siblings[i].children, pid);
                    if (foundchild) {
                        return foundchild;
                    }
                }
            }
            return false;

        }

        //var userobj = await BaseUser.findOne({ where: { id: userId } });
        //var companyUsers = await BaseUser.find({ where: { companyId: userobj.companyId } });
        var companyRoles = await Accessrole.find({ where: { companyId: userobj.companyId }, order: 'tier asc' });
        for (const role of companyRoles) {
            currentObj = {};
            currentObj.name = role.name;
            currentObj.id = role.id;
            currentObj.tier = role.tier;
            currentObj.seePeer = role.seePeer;
            currentObj.accessRights = [];
            currentObj.children = [];
            if (role.tier == 1) {
                data = currentObj;
            }
            else {
                //search for parent
                var parent = data;
                if (parent.id != role.parentId) {
                    parent = findParent(parent.children, role.parentId);
                }
                parent.children.push(currentObj);


            }
        }
        return data;

        /* return {
            id: role id
            name: rolename,
            accessRights: [ 
                { id: rightid,
                  name: name,
                  descripton: 
                  methods: 
                  categoryName:
                  description:
                }
            ],
            tier: number
            seePeer: true or false,
            children: [array of sub roles] 

        } */

    }

    Accessrole.remoteMethod('viewall', {
        accepts: { arg: 'userId', type: 'any' },
        returns: { arg: 'data', type: 'object' }
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
            where: { companyId: userobj.companyId }
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
            for (const rt of currentRights) {
                await role.accessRights.remove(rt);
            }

            for (const right of rights) {
                await role.accessRights.add(right.id);
            }
        }
        //return updated groups and roles
        return Accessrole.viewall(userId);
    }

};
