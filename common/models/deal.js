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
};
