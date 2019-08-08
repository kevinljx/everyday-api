'use strict';

module.exports = function(Quotation) {


    Quotation.quotations = async function (data) {
      try {

        let datum = {...data}

        datum.quoteID = 'Not applicable'
        datum.version = 1
        datum.terms = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id felis ut sapien finibus vestibulum. Ut eget faucibus ligula. Integer vitae vehicula est. Aenean id neque enim. Fusce tempus nibh at augue feugiat, at aliquet elit sollicitudin. Fusce tellus massa, sollicitudin sit amet malesuada nec, sagittis dignissim neque. Nunc lacinia placerat est, a euismod odio sagittis nec. Aenean rhoncus lorem eget felis tristique facilisis. Vivamus convallis, justo nec consectetur laoreet, felis ante euismod neque, sit amet condimentum dolor justo fringilla enim. Donec pulvinar nulla non malesuada sagittis."  

        await Quotation.create(datum)
        console.log('created!')
        return [1, {}]

      } catch (e) {

        return [0, {}]
      }
      
      // Sequencesetting
    }
    Quotation.remoteMethod("quotations", {
        accepts: [
          { arg: "data", type: "object" },
        ],
        http: {path: '/', verb: 'post'},
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "object" },
        ]
    });


    Quotation.updateStatus = async function (data) {

      try {

        let currentQuotation = await Quotation.findById(data.id)

        console.log(currentQuotation)

        const Sequencesetting = Quotation.app.models.SequenceSetting
        currentQuotation.quoteID = await Sequencesetting.generateNumber(currentQuotation.userId, "Quotation")
        currentQuotation.state = 'Open'

        await currentQuotation.save()

        console.log('patching done!')
        return [1, currentQuotation]

      } catch (e) {
        return [0, {}]
      }
      
      // Sequencesetting
    }
    Quotation.remoteMethod("updateStatus", {
        accepts: [
          { arg: "data", type: "object" },
        ],
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "object" },
        ]
    });


    // Deep cloning the last mongo Object into object and resave as new entry
    Quotation.newVersion = async function (data) {

      try {

        let quotation = await Quotation.findById(data.id)
        quotation.state = "Closed"
        quotation.latest = false
        await quotation.save()

        let objectToCopy = JSON.parse(JSON.stringify(quotation))
        delete objectToCopy.id;
        objectToCopy.version = objectToCopy.version + 1 
        objectToCopy.state = "Open"
        objectToCopy.latest = true

        var Sequencesetting = Quotation.app.models.SequenceSetting
        objectToCopy.quoteID = await Sequencesetting.generateNumber(objectToCopy.userId, "Quotation")
        let newQuotation = await Quotation.create(objectToCopy)

        return [1, newQuotation]

      } catch (e) {

        return [0, {}]
      }

    }
    Quotation.remoteMethod("newVersion", {
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

      try {
      
        let currentQuotation = await Quotation.findById(data.id)
        await Quotation.destroyById(data.id)

        let previousQuotation = await Quotation.findOne({where: {version:currentQuotation.version-1, quoteID: data.quoteID,}})
        previousQuotation.state = "Open"
        previousQuotation.latest = true
        await previousQuotation.save()

        return [1, previousQuotation]

      } catch (e) {
        return [0, {}]
      }

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


    Quotation.convertInvoice = async function (data){

      try {
      
        let currentQuotation = await Quotation.findById(data.id)

        currentQuotation.state = "Converted"
        var Sequencesetting = Quotation.app.models.SequenceSetting
        currentQuotation.quoteID = await Sequencesetting.generateNumber(currentQuotation.userId, "Quotation")
        await currentQuotation.save()

        // create invoice
        var Invoice = Quotation.app.models.Invoice
        var newInvoice = JSON.parse(JSON.stringify(currentQuotation))
        delete newInvoice.id;

        newInvoice.quoteID = await Sequencesetting.generateNumber(newInvoice.userId, "Invoice")
        newInvoice.state = "Confirmed"
        newInvoice.terms = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id felis ut sapien finibus vestibulum. Ut eget faucibus ligula. Integer vitae vehicula est. Aenean id neque enim. Fusce tempus nibh at augue feugiat, at aliquet elit sollicitudin. Fusce tellus massa, sollicitudin sit amet malesuada nec, sagittis dignissim neque. Nunc lacinia placerat est, a euismod odio sagittis nec. Aenean rhoncus lorem eget felis tristique facilisis. Vivamus convallis, justo nec consectetur laoreet, felis ante euismod neque, sit amet condimentum dolor justo fringilla enim. Donec pulvinar nulla non malesuada sagittis."  
        await Invoice.create(newInvoice)


        return [1, currentQuotation]

      } catch (e) {
        console.log(e)
        return [0, {}]
      }

    }
    Quotation.remoteMethod("convertInvoice", {
      accepts: [
        { arg: "data", type: "object" },
      ],
      returns: [
        { arg: "success", type: "number" },
        { arg: "data", type: "object" },
      ]
    })



};
