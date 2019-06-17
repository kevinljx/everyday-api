"use strict";

module.exports = function(Lead) {
  Lead.showFullAddress = function showFullAddress(lead) {
    var address = "";
    if (lead.baseContact._address.address_1) {
      address += lead.baseContact._address.address_1 + "\n";
    }
    if (lead.baseContact._address.address_2) {
      address += lead.baseContact._address.address_2 + "\n";
    }
    if (lead.baseContact._address.state) {
      address += lead.baseContact._address.state + ",";
    }
    if (lead.baseContact._address.city) {
      address += lead.baseContact._address.city + " ";
    }
    if (lead.baseContact._address.zip) {
      address += lead.baseContact._address.zip;
    }
    return address;
  };

  Lead.showFullName = function showFullName(lead) {
    var fullName = lead.baseContact.firstName + " " + lead.baseContact.lastName;
    return fullName;
  };

  Lead.beforeRemote("convert", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });

  Lead.convert = async function(leadID, dealDetails, userId) {
    console.log(leadID);
    console.log(dealDetails);
    console.log(userId);
  };

  Lead.remoteMethod("convert", {
    accepts: [
      { arg: "leadID", type: "string", required: true },
      { arg: "dealDetails", type: "any", required: false },
      { arg: "userId", type: "any" }
    ],
    returns: [
      { arg: "newCust", type: "object" },
      { arg: "newAcct", type: "object" },
      { arg: "newDeal", type: "object" }
    ]
  });
};
