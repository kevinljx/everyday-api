"use strict";

module.exports = function(Deal) {
  Deal.updateStage = async function(dealID, stageID) {
    //check if user already signed up with same email address
    try {
      var BaseDeal = await Deal.findById(dealID);
      // create history
      await Deal.app.models.DealHistory.create({
        stageName: BaseDeal.stage.name,
        amount: BaseDeal.amount,
        chance: BaseDeal.stage.chance,
        duration: 10,
        closingDate: BaseDeal.closingDate,
        dealId: BaseDeal.id
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
};
