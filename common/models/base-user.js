'use strict';

module.exports = function (Baseuser) {
    function companyOnlyQuery(ctx, companyId) {
        var whereClause = { "companyId": companyId };
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

    Baseuser.beforeRemote("**", async function (ctx) {
        var token = ctx.req.accessToken;
        var userId = token && token.userId;
        if (ctx.method.name.includes("find")) {
            //show all company users
            var user = await Baseuser.findById(userId);
            ctx = companyOnlyQuery(ctx, user.companyId);
        }
        else if (ctx.method.name.includes("create")) {
            //include companyId
            var user = await Baseuser.findById(userId);
            ctx.args.data.companyId = user.companyId;
        }
    });
};
