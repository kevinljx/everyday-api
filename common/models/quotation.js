'use strict';

module.exports = function(Quotation) {

    // Deep cloning the last mongo Object into object and resave as new entry
    Quotation.convert = async function (data) {
        let quotation = await Quotation.findById(data.id)
        quotation.state = "Closed"
        quotation.latest = false
        await quotation.save()

        let objectToCopy = JSON.parse(JSON.stringify(quotation))
        delete objectToCopy.id;
        objectToCopy.version = objectToCopy.version + 1 
        objectToCopy.state = "Open"
        objectToCopy.latest = true
        let newQuotation = await Quotation.create(objectToCopy)

        return [1, newQuotation]
    }

    Quotation.remoteMethod("convert", {
        accepts: [
          { arg: "data", type: "object" },
        ],
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "object" },
        ]
    });
   

    // Delete the latest quotation and convert last second as Open invoice
    Quotation.revertQuotation = async function (data) {
      let currentQuotation = await Quotation.findById(data.id)
      await Quotation.destroyById(data.id)

      let previousQuotation = await Quotation.findOne({where: {version:currentQuotation.version-1, quoteID: data.quoteID,}})
      previousQuotation.state = "Open"
      previousQuotation.latest = true
      await previousQuotation.save()

      return [1, previousQuotation]
    }

    Quotation.remoteMethod("revertQuotation", {
      accepts: [
        { arg: "data", type: "object" },
      ],
      returns: [
        { arg: "success", type: "number" },
        { arg: "data", type: "object" },
      ]
  });




};
