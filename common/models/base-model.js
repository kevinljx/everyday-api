'use strict';

module.exports = function (Basemodel) {


    Basemodel.observe('access', async function (ctx) {
        var token = ctx.options && ctx.options.accessToken;
        var userId = token && token.userId;
        if (!userId) {
            if (ctx.query.userId != null) {
                userId = ctx.query.userId;
            }
            else {
                return;
            }
        }  // no access token, internal or test request;
        var whereClause = { userId: userId };

        var AccessSetting = Basemodel.app.models.AccessSetting;
        var AccessRole = Basemodel.app.models.AccessRole;
        var BaseUser = Basemodel.app.models.BaseUser;
        //get user setting
        var settings = await AccessSetting.find({ where: { userId: userId } });
        //get roles
        var roles = [];
        for (const setting of settings) {
            await setting.role.get();
            role.push(setting.role())
        }
        var modelFound = false;
        var validroles = [];
        //find if role has model, if not find out if has parent model and check if user has model
        for (const role of roles) {
            var rightCats = await role.accessCategories();
            for (var i = 0; i < rightCats.length; i++) {
                var rights = rightCats[i].accessrights;
                for (var j = 0; j < rights.length; j++) {
                    if (rights[j].model == ctx.Model.name) {
                        modelFound = true;
                        validroles.push(role);
                        j = rights.length;
                        i = rightCats.length;
                    }
                }
            }
        }
        if (!modelFound) {
            //get company admin and find model
            var user = BaseUser.findById(userId);
            var companyAdmin = await AccessRole.find({ where: { and: [{ companyId: user.companyId }, { tier: 0 }] } });
            var rightCats = await companyAdmin.accessCategories();
            //find the parent model
            var parentModel = "";
            for (var i = 0; i < rightCats.length; i++) {
                var rights = rightCats[i].accessrights;
                for (var j = 0; j < rights.length; j++) {
                    if (rights[j].model == ctx.Model.name) {
                        if (rights[j].parentModel) {
                            parentModel = rights[j].parentModel;
                        }
                        j = rights.length;
                        i = rightCats.length;
                    }
                }
            }

            for (const role of roles) {
                var rightCats = await role.accessCategories();
                for (var i = 0; i < rightCats.length; i++) {
                    var rights = rightCats[i].accessrights;
                    for (var j = 0; j < rights.length; j++) {
                        if (rights[j].model == ctx.Model.name) {
                            modelFound = true;
                            validroles.push(role);
                            j = rights.length;
                            i = rightCats.length;
                        }
                    }
                }
            }

        }

        //if has peer, select all users with the same role
        var allOwnerIds = [userId];
        for (const vrole of validroles) {
            if (vrole.hasPeer) {
                var usersettings = await AccessSetting.find({ where: { and: [{ roleId: vrole.id }, { neq: { userId: userId } }] } });
                for (const setting of usersettings) {
                    allOwnerIds.push(setting.id);
                }
            }
            //find children
            var childRoles = await AccessRole.find({ where: { parentId: vrole.id } });
            for (const child of childRoles) {
                var usersettings = await AccessSetting.find({ where: { roleId: child.id } });
                for (const setting of usersettings) {
                    allOwnerIds.push(setting.id);
                }
            }
        }


        if (allOwnerIds.length > 0) {
            whereClause = { userId: { inq: allOwnerIds } };
        }


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
