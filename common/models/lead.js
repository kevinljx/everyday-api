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
    try {
      var lead = await Lead.findById(leadID);

      // convert to customer and acct
      var acctBaseContact = lead.baseContact;
      acctBaseContact.name = lead.companyName;
      delete acctBaseContact.firstName;
      delete acctBaseContact.lastName;
      var acct = await Lead.app.models.Account.create({
        userId: userId,
        industryId: lead.industryId,
        baseContact: acctBaseContact
      });

      var cust = await Lead.app.models.Customer.create({
        baseContact: lead.baseContact,
        userId: userId,
        accountId: acct.id
      });

      var newCust = await Lead.app.models.Customer.findById(cust.id);
      var newAcct = await Lead.app.models.Account.findById(acct.id);

      // new deal
      let newDeal = null;
      // if (
      //   "amount" in dealDetails &&
      //   "name" in dealDetails &&
      //   "stageId" in dealDetails &&
      //   "closingDate" in dealDetails
      // ) {
      //   console.log("true");
      // }

      // delete lead instance

      return [newCust, newAcct, newDeal];
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  Lead.remoteMethod("convert", {
    accepts: [
      { arg: "id", type: "string", required: true },
      { arg: "dealDetails", type: "any", required: false },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/convert/:id", verb: "post" },
    returns: [
      { arg: "newCust", type: "object" },
      { arg: "newAcct", type: "object" },
      { arg: "newDeal", type: "object" }
    ]
  });
};
