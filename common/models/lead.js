"use strict";

module.exports = function(Lead) {
  //===========================================
  //===========================================
  // Computed Fields
  //===========================================
  //===========================================
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
      fullName =
        (lead.baseContact.firstName ? lead.baseContact.firstName + " " : "") +
        lead.baseContact.lastName;
    }
    return fullName;
  };
  Lead.showSourceInfo = async function showSourceInfo(lead) {
    if (lead.sourceId) {
      var source = await Lead.app.models.LeadSource.findById(lead.sourceId);
      return source.name;
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
  Lead.showEventInfo = async function showEventInfo(lead) {
    var participatedId = await Lead.app.models.EventParticipant.find({
      where: { participantsId: lead.id }
    }).map(obj => obj.eventId);
    let participated = [];
    for (let i = 0; i < participatedId.length; i++) {
      var participatedEvent = await Lead.app.models.Event.findById(
        participatedId[i]
      );
      participated.push(participatedEvent);
    }
    var related = await Lead.app.models.Event.find({
      where: { eventableId: lead.id }
    });
    var allEvents = [...participated, ...related].sort(
      (a, b) => a.start > b.start
    );
    return allEvents;
  };

  //===========================================
  //===========================================
  // Get All Lead
  //===========================================
  //===========================================
  Lead.beforeRemote("customGet", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Lead.customGet = async function(userId) {
    try {
      var allLead = await Lead.find({ userId }).map(obj => ({
        name: obj.name,
        id: obj.id,
        companyName: obj.companyName,
        interest: obj.interest,
        statusInfo: obj.statusInfo.name && obj.statusInfo,
        source: obj.sourceInfo && obj.sourceInfo,
        industry: obj.industryInfo && obj.industryInfo,
        userInfo: obj.userInfo,
        email: obj.baseContact.email,
        mobile: obj.baseContact.mobile,
        phone: obj.baseContact.phone,
        fax: obj.baseContact.fax,
        website: obj.baseContact.website
      }));
      return allLead;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Lead.remoteMethod("customGet", {
    accepts: { arg: "userId", type: "any" },
    http: { path: "/getall", verb: "get" },
    returns: { arg: "data", type: "array" }
  });

  //===========================================
  //===========================================
  // Convert Lead
  //===========================================
  //===========================================
  Lead.beforeRemote("convert", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });

  Lead.convert = async function(
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

      // delete or set converted lead instance
      Lead.destroyById(lead.id);
      //await lead.patchAttributes({ isConverted: true });
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
  // If Account exist (convert lead)
  Lead.ifAccountExist = async function ifAccountExist(accountName) {
    try {
      var pattern = new RegExp(".*" + accountName + ".*", "i");
      var existAccount = await Lead.app.models.Account.find({
        where: { "baseContact.name": { like: pattern } },
        fields: {
          baseContact: true,
          id: true,
          name: true
        }
      });
      return [existAccount.length, existAccount];
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Lead.remoteMethod("ifAccountExist", {
    accepts: [{ arg: "accountName", type: "string", required: true }],
    returns: [{ arg: "count", type: "number" }, { arg: "data", type: "array" }]
  });

  //===========================================
  //===========================================
  // Transfer Record
  //===========================================
  //===========================================
  Lead.transfer = async function(leadIds, newOwner) {
    try {
      let updatedRecords = [];
      for (const leadId of leadIds) {
        await Lead.updateAll({ id: leadId }, { userId: newOwner });
        var updatedLead = await Lead.findById(leadId);
        updatedRecords.push(updatedLead);
      }
      return updatedRecords;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Lead.remoteMethod("transfer", {
    accepts: [
      { arg: "leadIds", type: "array", required: true },
      { arg: "newOwner", type: "string", required: true }
    ],
    returns: [{ arg: "updatedRecords", type: "array" }]
  });

  //===========================================
  //===========================================
  // Form Fields
  //===========================================
  //===========================================
  Lead.beforeRemote("formFields", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Lead.formFields = async function(userId) {
    try {
      const leadSource = await Lead.app.models.LeadSource.find({ userId }).map(
        source => {
          return { name: source.name, value: source.id };
        }
      );
      const leadStatus = await Lead.app.models.LeadStatus.find({ userId }).map(
        status => {
          return { name: status.name, value: status.id };
        }
      );
      const industry = await Lead.app.models.LeadIndustry.find({ userId }).map(
        ind => {
          return { name: ind.name, value: ind.id };
        }
      );
      const leadInterest = await Lead.app.models.LeadInterestLevel.find({
        userId
      }).map(interest => {
        return { name: interest.name, value: interest.level };
      });
      const users = await Lead.app.models.BaseUser.find({ userId }).map(
        user => {
          return { name: user.name, value: user.id };
        }
      );

      return { leadSource, leadStatus, industry, leadInterest, users };
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Lead.remoteMethod("formFields", {
    accepts: [{ arg: "userId", type: "any" }],
    http: { path: "/formFields", verb: "get" },
    returns: [{ arg: "fields", type: "object" }]
  });
};
