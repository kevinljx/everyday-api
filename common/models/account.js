"use strict";

module.exports = function(Account) {
  Account.showFullAddress = function showFullAddress(acct) {
    var address = "";
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
    return address;
  };

  Account.showFullName = function showFullName(acct) {
    return acct.baseContact.name;
  };
};
