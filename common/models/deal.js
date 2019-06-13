"use strict";

module.exports = function(Deal) {
  Deal.updateStage = async function(dealID, stageID) {
    //check if user already signed up with same email address
    try {
      var BaseDeal = await Deal.findById(dealID);
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
