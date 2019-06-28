"use strict";

module.exports = function(Account) {
  Account.beforeRemote("create", async function(ctx) {
    if (ctx.args.data) {
      ctx.args.data.baseContact.isCompany = true;
    }
    return;
  });

  Account.showFullAddress = function showFullAddress(acct) {
    var address = "";
    if (acct.baseContact && acct.baseContact._address) {
      if (acct.baseContact._address.address_1) {
        address += acct.baseContact._address.address_1 + "\n";
      }
      if (acct.baseContact._address.address_2) {
        address += acct.baseContact._address.address_2 + "\n";
      }
      if (acct.baseContact._address.state) {
        address += acct.baseContact._address.state + ",";
      }
      if (acct.baseContact._address.city) {
        address += acct.baseContact._address.city + " ";
      }
      if (acct.baseContact._address.zip) {
        address += acct.baseContact._address.zip;
      }
    }
    return address;
  };

  Account.showFullName = function showFullName(acct) {
    var acctName = "";
    if (acct.baseContact) {
      acctName = acct.baseContact.name;
    }
    return acctName;
  };

  Account.showAllCustomer = async function showAllCustomer(acct) {
    var allCustomer = await Account.app.models.Customer.find({
      where: {
        and: [{ accountId: acct.id }, { isActive: true }]
      },
      fields: {
        name: true,
        id: true,
        accountId: false,
        baseContact: true
      }
    });
    return allCustomer;
  };
  Account.showAllDeal = async function showAllDeal(acct) {
    var allDeal = await Account.app.models.Deal.find({
      where: {
        and: [{ accountId: acct.id }]
      },
      fields: {
        name: true,
        stageId: true,
        amount: true,
        closingDate: true,
        typeId: true,
        sourceId: true,
        id: true
      }
    });
    return allDeal;
  };
  Account.accountExist = async function accountExist(accountName) {
    try {
      var pattern = new RegExp(".*" + accountName + ".*", "i");
      var existAccount = await Account.find({
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

  Account.remoteMethod("accountExist", {
    accepts: [{ arg: "accountName", type: "string", required: true }],
    returns: [{ arg: "count", type: "number" }, { arg: "data", type: "array" }]
  });
};
