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
};
