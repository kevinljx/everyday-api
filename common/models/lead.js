"use strict";

module.exports = function (Lead) {
  Lead.showFullAddress = function showFullAddress(lead) {
    var address = "";
    if (lead.baseContact) {
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
    }

    return address;
  };

  Lead.showFullName = function showFullName(lead) {
    var fullName = "";
    if (lead.baseContact) {
      fullName = lead.baseContact.firstName + " " + lead.baseContact.lastName;
    }
    return fullName;
  };
  Lead.showSourceInfo = async function showSourceInfo(lead) {
    if (lead.sourceId) {
      var source = await Lead.app.models.LeadSource.findById(lead.sourceId);
      return { name: source.name, color: source.color };
    }
  };
  Lead.showStatusInfo = async function showStatusInfo(lead) {
    if (lead.statusId) {
      var status = await Lead.app.models.LeadStatus.findById(lead.statusId);
      return { name: status.name, color: status.color };
    }
  };
  Lead.showIndustryInfo = async function showIndustryInfo(lead) {
    if (lead.industryId) {
      var ind = await Lead.app.models.LeadIndustry.findById(lead.industryId);
      return ind.name;
    }
  };

  Lead.showUpcoming = async function showUpcoming(lead) {
    var allUpcoming = [];
    var Event = Lead.app.models.Event;
    const currentTime = new Date();
    //allUpcoming = await Event.find({ where: { end_date: { gt: currentTime.toISOString() } } });
    allUpcoming = await Event.find({
      where: {
        and: [
          { eventableId: lead.id },
          { eventableType: "Lead" },
          { end_date: { gt: currentTime.toISOString() } }
        ]
      }
    });
    return allUpcoming;
  };

  Lead.showPast = async function showPast(lead) {
    var allPast = [];
    var Event = Lead.app.models.Event;
    const currentTime = new Date();
    //allUpcoming = await Event.find({ where: { end_date: { gt: currentTime.toISOString() } } });
    allPast = await Event.find({
      where: {
        and: [
          { eventableId: lead.id },
          { eventableType: "Lead" },
          { end_date: { lt: currentTime.toISOString() } }
        ]
      }
    });
    return allPast;
  };

  Lead.beforeRemote("convert", async function (ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });

  Lead.convert = async function (
    leadID,
    dealDetails,
    existingAccountId,
    userId
  ) {
    try {
      var newDeal = null;
      var lead = await Lead.findById(leadID);

      var acct;
      if (!existingAccountId) {
        // No Account Id - create new account
        var acctBaseContact = lead.baseContact;
        acctBaseContact.name = lead.companyName;
        acctBaseContact.isCompany = true;
        delete acctBaseContact.firstName;
        delete acctBaseContact.lastName;
        acct = await Lead.app.models.Account.create({
          userId: userId,
          createdBy: userId,
          updatedBy: userId,
          industryId: lead.industryId,
          baseContact: acctBaseContact
        });
      } else {
        acct = await Lead.app.models.Account.findById(existingAccountId);
      }

      // create customer
      var cust = await Lead.app.models.Customer.create({
        baseContact: lead.baseContact,
        sourceId: lead.sourceId,
        userId: userId,
        createdBy: userId,
        updatedBy: userId,
        accountId: acct.id
      });
      var newCust = await Lead.app.models.Customer.findById(cust.id);
      var newAcct = await Lead.app.models.Account.findById(acct.id);

      // check if new deal
      if (
        "amount" in dealDetails &&
        "name" in dealDetails &&
        "stageId" in dealDetails &&
        "closingDate" in dealDetails
      ) {
        var deal = await Lead.app.models.Deal.create({
          userId: userId,
          createdBy: userId,
          updatedBy: userId,
          accountId: acct.id,
          customerId: cust.id,
          amount: dealDetails.amount,
          name: dealDetails.name,
          stageId: dealDetails.stageId,
          closingDate: dealDetails.closingDate,
          sourceId: lead.sourceId
        });
        newDeal = await Lead.app.models.Deal.findById(deal.id);
      }

      // delete lead instance
      Lead.destroyById(lead.id);
      return [newCust, newAcct, newDeal];
    } catch (e) {
      // console.log(e);
      throw e;
    }
  };

  Lead.remoteMethod("convert", {
    accepts: [
      { arg: "id", type: "string", required: true },
      { arg: "dealDetails", type: "any", required: false },
      { arg: "existingAccountId", type: "any" },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/convert/:id", verb: "post" },
    returns: [
      { arg: "newCust", type: "object" },
      { arg: "newAcct", type: "object" },
      { arg: "newDeal", type: "object" }
    ]
  });

  /*
  Lead.beforeRemote("formfields", async function (ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });

  Lead.formfields = async function (userId) {
    var sources = await Lead.app.models.LeadSource.find({ userId: userId });
    var industry = await Lead.app.models.LeadIndustry.find({ userId: userId });
    return [sources, industry];
  }

  Lead.remoteMethod("formfields", {
    accepts: { arg: "userId", type: "any" },
    http: { verb: "get" },
    returns: [
      { arg: "sources", type: "object" },
      { arg: "industry", type: "object" }
    ]
  })
  */
};
