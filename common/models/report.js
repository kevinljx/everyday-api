"use strict";

module.exports = function(Report) {
  //==============================================================
  //==============================================================
  // LEAD REPORT
  //==============================================================
  //==============================================================

  /**
   * Leads by status
   */
  Report.beforeRemote("leadsByStatus", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Report.leadsByStatus = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const status = await Report.app.models.LeadStatus.find({ userId });
      for (let i = 0; i < status.length; i++) {
        var statusReport = {};
        statusReport.name = status[i].name;
        statusReport.color = status[i].color;
        var leads = await Report.app.models.Lead.find({
          where: {
            and: [
              { createdAt: { between: [startDate, endDate] } },
              { statusId: status[i].id }
            ]
          }
        }).map(lead => ({
          name: lead.name,
          companyName: lead.companyName,
          userInfo: lead.userInfo.name,
          source: lead.sourceInfo && lead.sourceInfo.name,
          interest: lead.interest
        }));
        statusReport.totalLeads = leads.length;
        statusReport.leads = leads;
        data.push(statusReport);
      }
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Report.remoteMethod("leadsByStatus", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/leadsbystatus" },
    returns: [{ arg: "data", type: "array" }]
  });

  /**
   * Leads by Owner
   */
  Report.beforeRemote("leadsByOwner", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Report.leadsByOwner = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const users = await Report.app.models.BaseUser.find();
      for (let i = 0; i < users.length; i++) {
        var userReport = {};
        userReport.name = users[i].name;
        var leads = await Report.app.models.Lead.find({
          where: {
            and: [
              { createdAt: { between: [startDate, endDate] } },
              { userId: users[i].id }
            ]
          }
        }).map(lead => ({
          name: lead.name,
          companyName: lead.companyName,
          status: lead.statusInfo.name,
          source: lead.sourceInfo && lead.sourceInfo.name,
          interest: lead.interest
        }));
        userReport.totalLeads = leads.length;
        userReport.leads = leads;
        data.push(userReport);
      }
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Report.remoteMethod("leadsByOwner", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/leadsbyowner" },
    returns: [{ arg: "data", type: "array" }]
  });

  /**
   * Leads by Source
   */
  Report.beforeRemote("leadsBySource", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Report.leadsBySource = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const source = await Report.app.models.LeadSource.find({ userId });
      for (let i = 0; i < source.length; i++) {
        var sourceReport = {};
        sourceReport.name = source[i].name;
        sourceReport.color = source[i].color;
        var leads = await Report.app.models.Lead.find({
          where: {
            and: [
              { createdAt: { between: [startDate, endDate] } },
              { sourceId: source[i].id }
            ]
          }
        }).map(lead => ({
          name: lead.name,
          companyName: lead.companyName,
          userInfo: lead.userInfo.name,
          status: lead.statusInfo.name,
          interest: lead.interest
        }));
        sourceReport.totalLeads = leads.length;
        sourceReport.leads = leads;
        data.push(sourceReport);
      }
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Report.remoteMethod("leadsBySource", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/leadsbysource" },
    returns: [{ arg: "data", type: "array" }]
  });

  //==============================================================
  //==============================================================
  // DEAL REPORT
  //==============================================================
  //==============================================================

  /**
   * Deals by owner
   */
  Report.beforeRemote("dealsByOwner", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Report.dealsByOwner = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const companyUsers = await Report.app.models.BaseUser.find();
      for (let i = 0; i < companyUsers.length; i++) {
        var userReport = {};
        userReport.name = companyUsers[i].name;
        var deals = await Report.app.models.Deal.find(
          {
            where: {
              and: [
                { createdAt: { between: [startDate, endDate] } },
                { userId: companyUsers[i].id }
              ]
            }
          },
          userId
        ).map(deal => ({
          name: deal.name,
          amount: deal.amount,
          closingDate: deal.closingDate,
          userInfo: deal.userInfo.name,
          stage: deal.stageInfo.name,
          chance: deal.stageInfo.chance,
          accountInfo: deal.accountInfo.name
        }));
        userReport.totalDeals = deals.length;
        userReport.totalAmount = deals.reduce(function(a, b) {
          return a + b["amount"];
        }, 0);
        userReport.deals = deals;
        data.push(userReport);
      }
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Report.remoteMethod("dealsByOwner", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/dealsbyowner" },
    returns: [{ arg: "data", type: "array" }]
  });

  /**
   * Deals by type
   */
  Report.beforeRemote("dealsByType", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Report.dealsByType = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const type = await Report.app.models.DealType.find({ userId });
      for (let i = 0; i < type.length; i++) {
        var typeReport = {};
        typeReport.name = type[i].name;
        typeReport.color = type[i].color;
        var deals = await Report.app.models.Deal.find(
          {
            where: {
              and: [
                { createdAt: { between: [startDate, endDate] } },
                { typeId: type[i].id }
              ]
            }
          },
          userId
        ).map(deal => ({
          name: deal.name,
          amount: deal.amount,
          closingDate: deal.closingDate,
          userInfo: deal.userInfo.name,
          stage: deal.stageInfo.name,
          chance: deal.stageInfo.chance,
          accountInfo: deal.accountInfo.name
        }));
        typeReport.totalDeals = deals.length;
        typeReport.totalAmount = deals.reduce(function(a, b) {
          return a + b["amount"];
        }, 0);
        typeReport.deals = deals;
        data.push(typeReport);
      }
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Report.remoteMethod("dealsByType", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/dealsbytype" },
    returns: [{ arg: "data", type: "array" }]
  });

  /**
   * Deals Pipeline
   */
  Report.beforeRemote("dealsPipeline", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Report.dealsPipeline = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const stage = await Report.app.models.DealStage.find({ userId });
      for (let i = 0; i < stage.length; i++) {
        var pipelineReport = {};
        pipelineReport.name = `${stage[i].name} - ${stage[i].chance}%`;
        var deals = await Report.app.models.Deal.find({
          userId: userId,
          where: {
            and: [
              { createdAt: { between: [startDate, endDate] } },
              { stageId: stage[i].id }
            ]
          }
        }).map(deal => ({
          name: deal.name,
          amount: deal.amount,
          closingDate: deal.closingDate,
          userInfo: deal.userInfo.name,
          source: deal.sourceInfo && deal.sourceInfo.name,
          type: deal.typeInfo && deal.typeInfo.name,
          chance: deal.stageInfo.chance,
          accountInfo: deal.accountInfo.name
        }));
        pipelineReport.totalDeals = deals.length;
        pipelineReport.totalAmount = deals.reduce(function(a, b) {
          return a + b["amount"];
        }, 0);
        pipelineReport.deals = deals;
        data.push(pipelineReport);
      }
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Report.remoteMethod("dealsPipeline", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/dealspipeline" },
    returns: [{ arg: "data", type: "array" }]
  });

  //==============================================================
  //==============================================================
  // ACCOUNT REPORT
  //==============================================================
  //==============================================================

  /**
   * Top Spender
   */
  Report.beforeRemote("topSpenderAcct", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Report.topSpenderAcct = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const closedLoss = await Report.app.models.DealStage.find({
        userId: userId,
        where: { chance: 0 }
      });
      const accounts = await Report.app.models.Account.find({ userId: userId });
      for (let i = 0; i < accounts.length; i++) {
        var allDealsWon = await Report.app.models.Deal.find({
          where: {
            and: [
              { stageId: { neq: closedLoss[0].id } },
              { accountId: accounts[i].id },
              { closingDate: { between: [startDate, endDate] } }
            ]
          }
        });
        if (allDealsWon.length > 0) {
          var acctReport = {};
          acctReport.name = accounts[i].name;
          var deals = allDealsWon.map(deal => ({
            name: deal.name,
            amount: deal.amount,
            closingDate: deal.closingDate,
            stage: deal.stageInfo.name,
            chance: deal.stageInfo.chance
          }));
          acctReport.totalSpent = allDealsWon.reduce(function(a, b) {
            return a + b.amount;
          }, 0);
          acctReport.deals = deals;
          data.push(acctReport);
        }
      }
      data.sort((a, b) => b.totalSpent - a.totalSpent);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Report.remoteMethod("topSpenderAcct", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/topspenderacct" },
    returns: [{ arg: "data", type: "array" }]
  });

  //==============================================================
  //==============================================================
  // CUSTOMER REPORT
  //==============================================================
  //==============================================================

  /**
   * Top Spender
   */
  Report.beforeRemote("topSpenderCust", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Report.topSpenderCust = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const closedLoss = await Report.app.models.DealStage.find({
        userId: userId,
        where: { chance: 0 }
      });
      const customers = await Report.app.models.Customer.find({
        userId: userId
      });
      for (let i = 0; i < customers.length; i++) {
        var allDealsWon = await Report.app.models.Deal.find({
          where: {
            and: [
              { stageId: { neq: closedLoss[0].id } },
              { customerId: customers[i].id },
              { closingDate: { between: [startDate, endDate] } }
            ]
          }
        });
        if (allDealsWon.length > 0) {
          var custReport = {};
          custReport.name = customers[i].name;
          var deals = allDealsWon.map(deal => ({
            name: deal.name,
            amount: deal.amount,
            closingDate: deal.closingDate,
            stage: deal.stageInfo.name,
            chance: deal.stageInfo.chance
          }));
          custReport.totalSpent = allDealsWon.reduce(function(a, b) {
            return a + b.amount;
          }, 0);
          custReport.deals = deals;
          data.push(custReport);
        }
      }
      data.sort((a, b) => b.totalSpent - a.totalSpent);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Report.remoteMethod("topSpenderCust", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/topspendercust" },
    returns: [{ arg: "data", type: "array" }]
  });

  //==============================================================
  //==============================================================
  // INDIVIDUAL REPORT
  //==============================================================
  //==============================================================

  Report.individualSales = async function(startDate, endDate, userId) {
    try {
      // leads to close ratio: 3.41,
      //   deals won / total leads * 100
      if (!userId) return null;
      const user = await Report.app.models.BaseUser.findById(userId);
      var data = {};
      data.name = user.name;
      data.startDate = startDate;
      data.endDate = endDate;

      const dealStages = await Report.app.models.DealStage.find({ userId });
      const allDealsByUser = await Report.app.models.Deal.find({
        where: {
          and: [
            { userId: userId },
            { closingDate: { between: [startDate, endDate] } }
          ]
        }
      });
      //const closedWon = dealStages.filter(stage => stage.chance == 100);
      //const closedLoss = dealStages.filter(stage => stage.chance == 0);

      // totalDealsWon: 3,
      const totalDealsWon = allDealsByUser.filter(
        deal => deal.stage.chance == 100
      );
      data.totalDealsWon = totalDealsWon.length;

      // totalDealsAmt: 40000,
      // totalDeals: 0,
      const totalDeals = allDealsByUser.filter(
        deal => !deal.stage.chance == 100 && !deal.stage.chance == 0
      );
      const totalDealsAmount = totalDeals.reduce(function(a, b) {
        return a + b.amount;
      }, 0);
      data.totalDealsAmount = totalDealsAmount;
      data.totalDeals = totalDeals.length;

      // totalLeads: 8,
      const totalLeads = await Report.app.models.Lead.find({
        where: {
          and: [
            { userId: userId },
            { createdAt: { between: [startDate, endDate] } }
          ]
        }
      });
      data.totalLeads = totalLeads.length;

      // accountsToDeals: 0.56,
      const totalAccts = await Report.app.models.Account.find({
        where: {
          and: [
            { userId: userId },
            { createdAt: { between: [startDate, endDate] } }
          ]
        }
      });
      if (totalAccts.length > 0) {
        data.accountsToDeals = (
          allDealsByUser.length / totalAccts.length
        ).toFixed(3);
      } else {
        data.accountsToDeals = 0;
      }

      //sales data
      const salesData = totalDealsWon.map(deal => ({
        date: deal.closingDate,
        amount: deal.amount
      }));
      data.salesData = salesData;

      // pipeline

      var pipeline = [];
      for (let i = 0; i < dealStages.length; i++) {
        var pipelineReport = {};
        pipelineReport.name = `${dealStages[i].name} - ${
          dealStages[i].chance
        }%`;
        var deals = await Report.app.models.Deal.find({
          where: {
            and: [
              { createdAt: { between: [startDate, endDate] } },
              { stageId: dealStages[i].id },
              { userId: userId }
            ]
          }
        }).map(deal => ({
          name: deal.name,
          amount: deal.amount,
          closingDate: deal.closingDate,
          userInfo: deal.userInfo.name,
          source: deal.sourceInfo && deal.sourceInfo.name,
          type: deal.typeInfo && deal.typeInfo.name,
          chance: deal.stageInfo.chance,
          accountInfo: deal.accountInfo.name
        }));
        pipelineReport.totalDeals = deals.length;
        pipelineReport.totalAmount = deals.reduce(function(a, b) {
          return a + b["amount"];
        }, 0);
        pipelineReport.deals = deals;
        pipeline.push(pipelineReport);
      }
      data.pipeline = pipeline;

      // leads status
      var leadStatus = [];
      const status = await Report.app.models.LeadStatus.find({ userId });
      for (let i = 0; i < status.length; i++) {
        var statusReport = {};
        statusReport.name = status[i].name;
        statusReport.color = status[i].color;
        var leads = await Report.app.models.Lead.find({
          where: {
            and: [
              { createdAt: { between: [startDate, endDate] } },
              { statusId: status[i].id },
              { userId: userId }
            ]
          }
        }).map(lead => ({
          name: lead.name,
          companyName: lead.companyName,
          userInfo: lead.userInfo.name,
          source: lead.sourceInfo && lead.sourceInfo.name,
          interest: lead.interest
        }));
        statusReport.totalLeads = leads.length;
        statusReport.leads = leads;
        leadStatus.push(statusReport);
      }
      data.leadStatus = leadStatus;

      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  Report.remoteMethod("individualSales", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/individualsales" },
    returns: [{ arg: "data", type: "object" }]
  });
};
