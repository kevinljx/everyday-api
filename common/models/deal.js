"use strict";

function getDiffInDays(date1, date2) {
  var one_day = 1000 * 60 * 60 * 24;
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();
  var difference_ms = date2_ms - date1_ms;
  return Math.round(difference_ms / one_day);
}

module.exports = function(Deal) {
  //===========================================
  //===========================================
  // Deal Info
  //===========================================
  //===========================================
  Deal.showCustomerInfo = async function showCustomerInfo(deal) {
    if (deal.customerId) {
      var customer = await Deal.app.models.Customer.findById(deal.customerId);
      return { name: customer.name, id: customer.id };
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
        name: stage.name,
        chance: stage.chance,
        color: stage.color,
        step: stage.step
      };
    }
  };
  Deal.showSourceInfo = async function showSourceInfo(deal) {
    if (deal.sourceId) {
      var source = await Deal.app.models.LeadSource.findById(deal.sourceId);
      return source.name;
    }
  };
  Deal.showTypeInfo = async function showTypeInfo(deal) {
    if (deal.typeId) {
      var type = await Deal.app.models.DealType.findById(deal.typeId);
      return type.name;
    }
  };

  //===========================================
  //===========================================
  // Get All Deal
  //===========================================
  //===========================================
  Deal.beforeRemote("customGet", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Deal.customGet = async function(userId) {
    try {
      var allDeal = await Deal.find({ userId }).map(obj => ({
        name: obj.name,
        id: obj.id,
        amount: obj.amount,
        closingDate: obj.closingDate,
        type: obj.typeInfo && obj.typeInfo,
        source: obj.sourceInfo && obj.sourceInfo,
        stageInfo: obj.stageInfo,
        userInfo: obj.userInfo,
        accountInfo: obj.accountInfo && obj.accountInfo,
        customerInfo: obj.customerInfo && obj.customerInfo
      }));
      return allDeal;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Deal.remoteMethod("customGet", {
    accepts: { arg: "userId", type: "any" },
    http: { path: "/getall", verb: "get" },
    returns: { arg: "data", type: "array" }
  });

  //===========================================
  //===========================================
  // Transfer Record
  //===========================================
  //===========================================
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

  //===========================================
  //===========================================
  // Update Stage
  //===========================================
  //===========================================
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
      var data = await Deal.findById(deal.id);
      return data;
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

  //===========================================
  //===========================================
  // Form Fields
  //===========================================
  //===========================================
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
          return { name: `${stage.name} - ${stage.chance}%`, value: stage.id };
        }
      );
      const dealType = await Deal.app.models.DealType.find({ userId }).map(
        type => {
          return { name: type.name, value: type.id };
        }
      );
      const users = await Deal.app.models.BaseUser.find({ userId }).map(
        user => {
          return { name: user.name, value: user.id };
        }
      );
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
};
