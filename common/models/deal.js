"use strict";

function getDiffInDays(date1, date2) {
  var one_day = 1000 * 60 * 60 * 24;
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();
  var difference_ms = date2_ms - date1_ms;
  return Math.round(difference_ms / one_day);
}

module.exports = function(Deal) {
  Deal.updateStage = async function(dealID, stageID) {
    //check if user already signed up with same email address
    try {
      var BaseDeal = await Deal.findById(dealID);
      // create history
      let startTime;
      var now = new Date();

      // get all related deal history
      var BaseHistory = await Deal.app.models.DealHistory.find({
        where: { dealId: BaseDeal.id }
      });
      // set starting date
      if (BaseHistory.length == 0) {
        startTime = BaseDeal.createdAt;
      } else {
        startTime = new Date(
          Math.max.apply(
            null,
            BaseHistory.map(e => {
              return new Date(e.createdAt);
            })
          )
        );
      }
      const prevStage = await Deal.app.models.DealStage.findById(
        BaseDeal.stageId
      );
      await Deal.app.models.DealHistory.create({
        stageName: prevStage.name,
        amount: BaseDeal.amount,
        chance: prevStage.chance,
        duration: getDiffInDays(startTime, now),
        closingDate: BaseDeal.closingDate,
        dealId: BaseDeal.id,
        userId: BaseDeal.userId
      });
      // change Stage
      var deal = await BaseDeal.patchAttributes({ stageId: stageID });
      //var data = await Deal.findById(deal.id);
      return deal;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  Deal.remoteMethod("updateStage", {
    accepts: [
      { arg: "dealID", type: "string", required: true },
      { arg: "stageID", type: "string", required: true }
    ],
    returns: [{ arg: "data", type: "object" }]
  });

  Deal.showCustomerInfo = async function showCustomerInfo(deal) {
    if (deal.customerId) {
      var customer = await Deal.app.models.Customer.findById(deal.customerId);
      if (customer) {
        return { name: customer.name, id: customer.id };
      }
    }
  };
  Deal.showAccountInfo = async function showAccountInfo(deal) {
    if (deal.accountId) {
      var acct = await Deal.app.models.Account.findById(deal.accountId);
      return { name: acct.name, id: acct.id };
    }
  };
  Deal.showStageInfo = async function showStageInfo(deal) {
    if (deal.stageId) {
      var stage = await Deal.app.models.DealStage.findById(deal.stageId);
      return {
        id: stage.id,
        name: stage.name,
        chance: stage.chance,
        color: stage.color
      };
    }
  };
  Deal.showSourceInfo = async function showSourceInfo(deal) {
    if (deal.sourceId) {
      var source = await Deal.app.models.LeadSource.findById(deal.sourceId);
      return { id: source.id, name: source.name, color: source.color };
    }
  };
  Deal.showTypeInfo = async function showTypeInfo(deal) {
    if (deal.typeId) {
      var type = await Deal.app.models.DealType.findById(deal.typeId);
      return { id: type.id, name: type.name, color: type.color };
    }
  };

  // Transfer Record
  Deal.transfer = async function(dealIds, newOwner) {
    try {
      let updatedRecords = [];
      for (const dealId of dealIds) {
        await Deal.updateAll({ id: dealId }, { userId: newOwner });
        var updatedDeal = await Deal.findById(dealId);
        updatedRecords.push(updatedDeal);
      }
      return updatedRecords;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Deal.remoteMethod("transfer", {
    accepts: [
      { arg: "dealIds", type: "array", required: true },
      { arg: "newOwner", type: "string", required: true }
    ],
    returns: [{ arg: "updatedRecords", type: "array" }]
  });

  // Get Form Fields
  Deal.beforeRemote("formFields", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Deal.formFields = async function(userId) {
    try {
      const leadSource = await Deal.app.models.LeadSource.find({ userId }).map(
        source => {
          return { name: source.name, value: source.id };
        }
      );
      const dealStage = await Deal.app.models.DealStage.find({ userId }).map(
        stage => {
          return { name: stage.name, value: stage.id };
        }
      );
      const dealType = await Deal.app.models.DealType.find({ userId }).map(
        type => {
          return { name: type.name, value: type.id };
        }
      );
      const users = await Deal.app.models.BaseUser.find().map(user => {
        return { name: user.name, value: user.id };
      });
      const accounts = await Deal.app.models.Account.find({ userId }).map(
        acct => {
          return { name: acct.name, value: acct.id };
        }
      );
      const customers = await Deal.app.models.Customer.find({ userId }).map(
        cust => {
          return { name: cust.name, value: cust.id };
        }
      );

      return { leadSource, dealStage, dealType, users, accounts, customers };
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Deal.remoteMethod("formFields", {
    accepts: [{ arg: "userId", type: "any" }],
    http: { path: "/formFields", verb: "get" },
    returns: [{ arg: "fields", type: "object" }]
  });

  //===============
  // Reports
  //===============

  /**
   * Deals by owner
   */
  Deal.beforeRemote("dealsByOwner", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Deal.dealsByOwner = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const companyUsers = await Deal.app.models.BaseUser.find();
      for (let i = 0; i < companyUsers.length; i++) {
        var userReport = {};
        userReport.name = companyUsers[i].name;
        var deals = await Deal.find(
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
  Deal.remoteMethod("dealsByOwner", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/reports/dealsbyowner" },
    returns: [{ arg: "data", type: "array" }]
  });

  /**
   * Deals by type
   */
  Deal.beforeRemote("dealsByType", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Deal.dealsByType = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const type = await Deal.app.models.DealType.find({ userId });
      for (let i = 0; i < type.length; i++) {
        var typeReport = {};
        typeReport.name = type[i].name;
        typeReport.color = type[i].color;
        var deals = await Deal.find(
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
  Deal.remoteMethod("dealsByType", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/reports/dealsbytype" },
    returns: [{ arg: "data", type: "array" }]
  });

  /**
   * Deals Pipeline
   */
  Deal.beforeRemote("dealsPipeline", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Deal.dealsPipeline = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const stage = await Deal.app.models.DealStage.find({ userId });
      for (let i = 0; i < stage.length; i++) {
        var pipelineReport = {};
        pipelineReport.name = `${stage[i].name} - ${stage[i].chance}%`;
        var deals = await Deal.find(
          {
            where: {
              and: [
                { createdAt: { between: [startDate, endDate] } },
                { stageId: stage[i].id }
              ]
            }
          },
          userId
        ).map(deal => ({
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
  Deal.remoteMethod("dealsPipeline", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/reports/dealspipeline" },
    returns: [{ arg: "data", type: "array" }]
  });
};
