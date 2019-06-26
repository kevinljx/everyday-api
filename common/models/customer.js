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
      fullName = cust.baseContact.firstName + " " + cust.baseContact.lastName;
    }
    return fullName;
  };

  Customer.showAccountInfo = async function showAccountInfo(cust) {
    if (cust.accountId) {
      var account = await Customer.app.models.Account.findById(cust.accountId);
      return { id: account.id, name: account.name };
    }
  };

  Customer.showAllDeal = async function showAllDeal(cust) {
    var allDeal = await Customer.app.models.Deal.find({
      where: {
        and: [{ customerId: cust.id }]
      },
      fields: {
        name: true,
        stageId: true,
        amount: true,
        closingDate: true,
        type: true,
        userInfo: true,
        id: true
      }
    });
    return allDeal;
  };

  // Customer.beforeRemote("updateStatus", async function(ctx) {
  //   var token = ctx.req.accessToken;
  //   var userId = token && token.userId;
  //   if (userId) {
  //     ctx.args.userId = userId;
  //   }
  //   return;
  // });

  // Customer.updateStatus = async function(custId, userId) {
  //   var cust = await Customer.findById(custId);
  // };

  // Customer.remoteMethod("updateStatus", {
  //   accepts: [
  //     { arg: "customerId", type: "string", required: true },
  //     { arg: "userId", type: "any", required: true }
  //   ],
  //   returns: [{ arg: "data", type: "object" }]
  // });
};
