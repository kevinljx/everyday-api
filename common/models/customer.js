"use strict";

module.exports = function(Customer) {
  //===========================================
  //===========================================
  // Customer Info
  //===========================================
  //===========================================
  Customer.showFullAddress = function showFullAddress(cust) {
    var address = "";
    if (cust.baseContact && cust.baseContact._address) {
      if (cust.baseContact._address.address_1) {
        address += cust.baseContact._address.address_1 + "\n";
      }
      if (cust.baseContact._address.address_2) {
        address += cust.baseContact._address.address_2 + "\n";
      }
      if (cust.baseContact._address.state) {
        address += cust.baseContact._address.state + ",";
      }
      if (cust.baseContact._address.city) {
        address += cust.baseContact._address.city + " ";
      }
      if (cust.baseContact._address.zip) {
        address += cust.baseContact._address.zip;
      }
    }
    return address;
  };

  Customer.showFullName = function showFullName(cust) {
    var fullName = "";
    if (cust.baseContact) {
      fullName =
        (cust.baseContact.firstName ? cust.baseContact.firstName + " " : "") +
        cust.baseContact.lastName;
    }
    return fullName;
  };
  Customer.showSourceInfo = async function showSourceInfo(cust) {
    if (cust.sourceId) {
      var source = await Customer.app.models.LeadSource.findById(cust.sourceId);
      return source.name;
    }
  };
  Customer.showAccountInfo = async function showAccountInfo(cust) {
    if (cust.accountId) {
      var account = await Customer.app.models.Account.findById(cust.accountId);
      return { name: account.name, id: account.id };
    }
  };

  //===========================================
  //===========================================
  // Get All Customer
  //===========================================
  //===========================================
  Customer.beforeRemote("customGet", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Customer.customGet = async function(userId) {
    try {
      var allCustomer = await Customer.find({ userId }).map(obj => ({
        name: obj.name,
        id: obj.id,
        accountInfo: obj.accountInfo && obj.accountInfo,
        categoryInfo: obj.categoryInfo && obj.categoryInfo,
        source: obj.sourceInfo && obj.sourceInfo,
        isActive: obj.isActive,
        userInfo: obj.userInfo,
        email: obj.baseContact.email,
        mobile: obj.baseContact.mobile,
        phone: obj.baseContact.phone,
        title: obj.baseContact.title,
        fax: obj.baseContact.fax
      }));
      return allCustomer;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Customer.remoteMethod("customGet", {
    accepts: { arg: "userId", type: "any" },
    http: { path: "/getall", verb: "get" },
    returns: { arg: "data", type: "array" }
  });

  Customer.showAllDeal = async function showAllDeal(cust) {
    var allDeal = await Customer.app.models.Deal.find({
      where: {
        customerId: cust.id
      },
      fields: {
        name: true,
        stageId: true,
        stageInfo: true,
        sourceId: true,
        sourceInfo: true,
        typeId: true,
        typeInfo: true,
        amount: true,
        closingDate: true,
        type: true,
        userId: true,
        userInfo: true,
        id: true
      }
    });
    return allDeal;
  };

  Customer.beforeRemote("deleteById", async function(ctx) {
    var id = ctx.req.params.id;
    var cust = await Customer.findById(id);
    // update all deals to remove cust
    await Customer.app.models.Deal.updateAll(
      { customerId: cust.id },
      { customerId: null },
      (err, info) => {
        if (err) throw err;
      }
    );
    return;
  });

  Customer.transfer = async function(custIds, newOwner) {
    try {
      let updatedRecords = [];
      for (const custId of custIds) {
        await Customer.updateAll({ id: custId }, { userId: newOwner });
        var updatedCust = await Customer.findById(custId);
        updatedRecords.push(updatedCust);
      }
      return updatedRecords;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  Customer.remoteMethod("transfer", {
    accepts: [
      { arg: "custIds", type: "array", required: true },
      { arg: "newOwner", type: "string", required: true }
    ],
    returns: [{ arg: "updatedRecords", type: "array" }]
  });

  Customer.beforeRemote("formFields", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  Customer.formFields = async function(userId) {
    try {
      const leadSource = await Customer.app.models.LeadSource.find({
        userId
      }).map(source => {
        return { name: source.name, value: source.id };
      });
      const accounts = await Customer.app.models.Account.find({ userId }).map(
        acct => {
          return { name: acct.name, value: acct.id };
        }
      );
      const users = await Customer.app.models.BaseUser.find({ userId }).map(
        user => {
          return { name: user.name, value: user.id };
        }
      );

      return { leadSource, accounts, users };
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Customer.remoteMethod("formFields", {
    accepts: [{ arg: "userId", type: "any" }],
    http: { path: "/formFields", verb: "get" },
    returns: [{ arg: "fields", type: "object" }]
  });
};
