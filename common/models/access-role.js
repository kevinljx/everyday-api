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

    function getAccessCategories(allCategories) {
        //remove inherited rights and methods
        var categories = [];
        for (var i = 0; i < allCategories.length; i++) {
            var catObj = {
                name: allCategories[i].name,
                description: allCategories[i].description,
                module: allCategories[i].module,
                accessrights: []
            }
            var rights = allCategories[i].accessrights;
            for (var j = 0; j < rights.length; j++) {
                if (rights[j].parentModel == "" || rights[j].parentModel == undefined) {
                    var rightObj = {
                        name: rights[j].name,
                        type: rights[j].type,
                        description: rights[j].description,
                        model: rights[j].model,
                        accessRightMethods: []
                    }
                    var methods = rights[j].methods();
                    for (var k = 0; k < methods.length; k++) {
                        if ((methods[k].parentModel == "" || methods[k].parentModel == undefined) && (methods[k].parentMethod == "" || methods[k].parentMethod == undefined)) {
                            rightObj.accessRightMethods.push(methods[k]);
                        }
                    }
                    catObj.accessrights.push(rightObj);
                }
            }
            categories.push(catObj);
        }
        return categories;
    }

    Accessrole.beforeRemote("**", async function (ctx) {
        if (ctx.method.name.includes("find")) {
            var token = ctx.req.accessToken;
            var userId = token && token.userId;
            if (userId) {
                ctx = userOnlyQuery(ctx, userId);
            }
        }
        else if (ctx.method.name == "viewall" || ctx.method.name == "createRole") {
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

        var userobj = await Accessrole.app.models.BaseUser.findOne({ where: { id: userId } });
        //var companyUsers = await BaseUser.find({ where: { companyId: userobj.companyId } });
        var companyRoles = await Accessrole.find({ where: { companyId: userobj.companyId }, order: 'tier asc' });
        for (const role of companyRoles) {
            var currentObj = {};
            currentObj.name = role.name;
            currentObj.id = role.id;
            currentObj.tier = role.tier;
            currentObj.seePeer = role.seePeer;
            var cats = await role.accessCategories();
            var categories = getAccessCategories(cats);
            currentObj.accessRightCategories = categories;
            currentObj.children = [];
            if (role.tier == 0) {
                data = currentObj;
            }
            else {
                //search for parent
                var parent = data;
                if (!parent.id.equals(role.parentId)) {

                    parent = findParent(parent.children, role.parentId);
                }
                if (!parent.children) {
                    parent.children = [];
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

    Accessrole.createRole = async function (userId, role) {
        var userobj = await Accessrole.app.models.BaseUser.findOne({ where: { id: userId } });

        var roleObj = {
            name: role.name,
            userId: userId,
            companyId: userobj.companyId,
            tier: role.tier,
            accessRightCategories: []
        }
        roleObj.accessRightCategories = await Accessrole.saveHelper(role.accessRightCategories);

        await Accessrole.create(roleObj);
        return Accessrole.viewall(userId);

    }

    Accessrole.remoteMethod('viewall', {
        accepts: { arg: 'userId', type: 'any' },
        returns: { arg: 'data', type: 'object' }
    });

    Accessrole.remoteMethod('createRole', {
        accepts: [{ arg: 'userId', type: 'any' }, { arg: 'role', type: 'object', required: true }],
        returns: { arg: 'data', type: 'object' }
    });

    Accessrole.remoteMethod('saveRights', {
        accepts: [{ arg: 'userId', type: 'any' }, { arg: 'id', type: 'any', required: true }, { arg: 'rights', type: 'array' }],
        returns: { arg: "data", type: "array" }
    });

    Accessrole.saveHelper = async function (allCats) {
        var cats = [];
        var AccessRightMethod = Accessrole.app.models.AccessRightMethod;
        var AccessRight = Accessrole.app.models.AccessRight;
        var AccessRightCategory = Accessrole.app.models.AccessRightCategory;
        for (var j = 0; j < allCats.length; j++) {
            var accCatObj = {
                name: allCats[j].name,
                module: allCats[j].module,
                description: allCats[j].description,
                accessrights: []
            };
            var rights = allCats[j].accessrights;

            for (var k = 0; k < rights.length; k++) {
                var rightObj = {
                    name: rights[k].name,
                    description: rights[k].description,
                    model: rights[k].model,
                    parentModel: rights[k].parentModel,
                    accessRightMethods: []
                }
                var methods = rights[k].accessRightMethods;
                for (var m = 0; m < methods.length; m++) {
                    var methodObj = {
                        name: methods[m].name,
                        editable: methods[m].editable,
                        parentModel: methods[m].parentModel,
                        parentMethod: methods[m].parentMethod,
                        access: methods[m].access
                    }
                    var methodSave = await AccessRightMethod.create(methodObj);
                    rightObj.accessRightMethods.push(methodSave);
                }

                var rightSave = await AccessRight.create(rightObj);
                accCatObj.accessrights.push(rightSave);
            }
            var cat1 = await AccessRightCategory.create(accCatObj);
            cats.push(cat1);
        }
        return cats;

    }

    Accessrole.saveRights = async function (userId, id, rights) {
        //check if role id is valid
        var BaseUser = Accessrole.app.models.BaseUser;
        var AccessRightCategory = Accessrole.app.models.AccessRightCategory;

        var userobj = await BaseUser.findOne({ where: { id: userId } });

        var role = await Accessrole.findById(id);
        if (!role.companyId.equals(userobj.companyId)) {
            var error = new Error("Invalid role id");
            error.status = 400;
            throw error;
        }
        else if (role.tier == 0) {
            var error = new Error("You cannot edit Company Admin role!");
            error.status = 400;
            throw error;
        }
        else {
            //delete all access role rights and update all
            var rightCats = await role.accessCategories();
            for (var i = 0; i < rightCats.length; i++) {
                await AccessRightCategory.destroyById(rightCats[i]);
            }
            var cats = await Accessrole.saveHelper(rights);
            await role.updateAttribute("accessRightCategories", cats);
        }
        //return updated groups and roles
        return Accessrole.viewall(userId);
    }

};
