"use strict";

module.exports = function(Customer) {
  Customer.showFullAddress = function showFullAddress(cust) {
    var address = "";
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
    return address;
  };

  Customer.showFullName = function showFullName(cust) {
    var fullName = cust.baseContact.firstName + " " + cust.baseContact.lastName;
    return fullName;
  };

  Customer.showAccountInfo = async function showAccountInfo(cust) {
    if (cust.accountId) {
      var account = await Customer.app.models.Account.findById(cust.accountId);
      return { id: account.id, name: account.name };
    }
  };
};
