"use strict";

module.exports = function(Customer) {
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
      return { name: source.name, color: source.color };
    }
  };
  Customer.showAccountInfo = async function showAccountInfo(cust) {
    if (cust.accountId) {
      var account = await Customer.app.models.Account.findById(cust.accountId);
      return { name: account.name, id: account.id };
    }
  };

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
