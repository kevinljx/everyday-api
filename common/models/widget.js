"use strict";

module.exports = function(Widget) {
  Widget.beforeRemote("**", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });

  Widget.crmsummary = async function(userId) {
    try {
      // total leads
      // leads not contacted
      const allLeads = await Widget.app.models.Lead.find({
        where: { userId }
      });
      const totalLeads = allLeads.length;

      // open deal amount
      // open deals
      const totalDeals = await Widget.app.models.Deal.find({
        where: { userId }
      });
      const totalOpenDeals = totalDeals.filter(
        deal => deal.stageInfo.chance != 100 && deal.stageInfo.chance != 0
      );
      const openDealsAmount = totalOpenDeals.reduce(function(a, b) {
        return a + b.amount;
      }, 0);
      const dealsWon = totalDeals.filter(deal => deal.stageInfo.chance == 100);
      var dealsWonAmount = 0;
      if (dealsWon.length > 0)
        dealsWonAmount = dealsWon.reduce((a, b) => a + b.amount, 0);

      var data = {
        totalLeads,
        openDealsAmount,
        totalOpenDeals: totalOpenDeals.length,
        dealsWonAmount
      };

      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  Widget.remoteMethod("crmsummary", {
    accepts: [{ arg: "userId", type: "any" }],
    http: { path: "/crmsummary", verb: "get" },
    returns: [{ arg: "data", type: "object" }]
  });

  Widget.untouchedleads = async function(userId, date) {
    try {
      var oldLeads = Widget.app.models.Lead.find({
        where: { userId: userId, updatedAt: { lte: date } }
      }).map(lead => ({
        id: lead.id,
        name: lead.name,
        companyName: lead.companyName,
        email: lead.baseContact.email,
        mobile: lead.baseContact.mobile,
        statusInfo: lead.statusInfo,
        updatedAt: lead.updatedAt
      }));
      return oldLeads;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Widget.remoteMethod("untouchedleads", {
    accepts: [{ arg: "userId", type: "any" }, { arg: "date", type: "date" }],
    http: { path: "/untouchedleads" },
    returns: [{ arg: "data", type: "array" }]
  });
};
