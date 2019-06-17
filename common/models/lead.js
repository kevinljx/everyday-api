"use strict";

module.exports = function(Lead) {
  Lead.showFullAddress = function showFullAddress(lead) {
    var address = "";
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
    return address;
  };

  Lead.showFullName = function showFullName(lead) {
    var fullName = lead.baseContact.firstName + " " + lead.baseContact.lastName;
    return fullName;
  };

  Lead.convert = async function(leadID, dealDetails) {
    console.log(leadID);
    console.log(dealDetails);
  };

  Lead.remoteMethod("convert", {
    accepts: [
      { arg: "leadID", type: "string", required: true },
      { arg: "dealDetails", type: "object", required: false }
    ],
    returns: [{ arg: "data", type: "object" }]
  });
};
