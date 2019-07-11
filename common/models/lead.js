"use strict";

module.exports = function(Lead) {
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
      return { name: source.name, id: source.id, color: source.color };
    }
  };
  Lead.showStatusInfo = async function showStatusInfo(lead) {
    if (lead.statusId) {
      var status = await Lead.app.models.LeadStatus.findById(lead.statusId);
      return { name: status.name, id: status.id, color: status.color };
    }
  };
  Lead.showIndustryInfo = async function showIndustryInfo(lead) {
    if (lead.industryId) {
      var ind = await Lead.app.models.LeadIndustry.findById(lead.industryId);
      return { name: ind.name, id: ind.id };
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

      // delete lead instance
      Lead.destroyById(lead.id);
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
      { arg: "existingAccountId", type: "string" },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/convert/:id", verb: "post" },
    returns: [
      { arg: "newCust", type: "object" },
      { arg: "newAcct", type: "object" },
      { arg: "newDeal", type: "object" }
    ]
  });

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
      const users = await Lead.app.models.BaseUser.find().map(user => {
        return { name: user.name, value: user.id };
      });

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

  //===============
  // Reports
  //===============

  /**
   * Leads by status
   */
  Lead.beforeRemote("leadsByStatus", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Lead.leadsByStatus = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const status = await Lead.app.models.LeadStatus.find({ userId });
      for (let i = 0; i < status.length; i++) {
        var statusReport = {};
        statusReport.name = status[i].name;
        statusReport.color = status[i].color;
        var leads = await Lead.find(
          {
            where: {
              and: [
                { createdAt: { between: [startDate, endDate] } },
                { statusId: status[i].id }
              ]
            }
          },
          userId
        ).map(lead => ({
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
  Lead.remoteMethod("leadsByStatus", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/reports/leadsbyStatus" },
    returns: [{ arg: "data", type: "array" }]
  });

  /**
   * Leads by Owner
   */
  Lead.beforeRemote("leadsByOwner", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Lead.leadsByOwner = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const users = await Lead.app.models.BaseUser.find();
      for (let i = 0; i < users.length; i++) {
        var userReport = {};
        userReport.name = users[i].name;
        var leads = await Lead.find(
          {
            where: {
              and: [
                { createdAt: { between: [startDate, endDate] } },
                { userId: users[i].id }
              ]
            }
          },
          userId
        ).map(lead => ({
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
  Lead.remoteMethod("leadsByOwner", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/reports/leadsbyowner" },
    returns: [{ arg: "data", type: "array" }]
  });

  /**
   * Leads by Source
   */
  Lead.beforeRemote("leadsBySource", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Lead.leadsBySource = async function(startDate, endDate, userId) {
    try {
      var data = [];
      const source = await Lead.app.models.LeadSource.find({ userId });
      for (let i = 0; i < source.length; i++) {
        var sourceReport = {};
        sourceReport.name = source[i].name;
        sourceReport.color = source[i].color;
        var leads = await Lead.find(
          {
            where: {
              and: [
                { createdAt: { between: [startDate, endDate] } },
                { sourceId: source[i].id }
              ]
            }
          },
          userId
        ).map(lead => ({
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
  Lead.remoteMethod("leadsBySource", {
    accepts: [
      { arg: "startDate", type: "date", required: true },
      { arg: "endDate", type: "date", required: true },
      { arg: "userId", type: "any" }
    ],
    http: { path: "/reports/leadsbysource" },
    returns: [{ arg: "data", type: "array" }]
  });
};
