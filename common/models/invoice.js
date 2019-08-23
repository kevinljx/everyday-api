'use strict';


module.exports = function(Invoice) {


    Invoice.invoices = async function (data) {
        try {
  
          let datum = {...data}
          // const {userId} = datum
      
          // var Sequencesetting = Invoice.app.models.SequenceSetting
          // datum.quoteID = await Sequencesetting.generateNumber(userId, "Invoice")
          datum.quoteID = 'Not applicable'
          datum.version = 1
          datum.terms = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id felis ut sapien finibus vestibulum. Ut eget faucibus ligula. Integer vitae vehicula est. Aenean id neque enim. Fusce tempus nibh at augue feugiat, at aliquet elit sollicitudin. Fusce tellus massa, sollicitudin sit amet malesuada nec, sagittis dignissim neque. Nunc lacinia placerat est, a euismod odio sagittis nec. Aenean rhoncus lorem eget felis tristique facilisis. Vivamus convallis, justo nec consectetur laoreet, felis ante euismod neque, sit amet condimentum dolor justo fringilla enim. Donec pulvinar nulla non malesuada sagittis."  
  
          await Invoice.create(datum)
  
          return [1, {}]
  
        } catch (e) {
  
          return [0, {}]
        }
        
        // Sequencesetting
    }
    Invoice.remoteMethod("invoices", {
        accepts: [
          { arg: "data", type: "object" },
        ],
        http: {path: '/', verb: 'post'},
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "object" },
        ]
    });

  
    Invoice.updateStatus = async function (data) {
      // console.log(data.value)

      try {

        let currentInvoice = await Invoice.findById(data.id)
  
        // not sure if current invoice has sequenceSettings, if don't have, just changed status
        if(data.value == "Current"){

          currentInvoice.state = data.value

        } else {
          
          // changed to confirmed state, input sequenceSettings
          const Sequencesetting = Invoice.app.models.SequenceSetting
          currentInvoice.quoteID = await Sequencesetting.generateNumber(currentInvoice.userId, "Invoice")
          currentInvoice.state = data.value
      
        }        

        await currentInvoice.save()

        return [1, currentInvoice]

      } catch (e) {
        return [0, {}]
      }
      
      // Sequencesetting
    }
    Invoice.remoteMethod("updateStatus", {
      accepts: [
        { arg: "data", type: "object" },
      ],
      returns: [
        { arg: "success", type: "number" },
        { arg: "data", type: "object" },
      ]
    });


    // Deep cloning the last mongo Object into object and resave as new entry
    Invoice.convert = async function (data) {

      try {

        let invoice = await Invoice.findById(data.id)
        invoice.state = "Cancelled"
        invoice.latest = false

        await invoice.save()

        let objectToCopy = JSON.parse(JSON.stringify(invoice))
        delete objectToCopy.id;
        objectToCopy.version = objectToCopy.version + 1 
        objectToCopy.state = "Current"
        objectToCopy.latest = true

        // var Sequencesetting = Invoice.app.models.SequenceSetting
        // objectToCopy.quoteID = await Sequencesetting.generateNumber(objectToCopy.userId, "Invoice")
        let newInvoice = await Invoice.create(objectToCopy)
        
        return [1, newInvoice]

      } catch (e) {

        return [0, {}]
      }

    }
    Invoice.remoteMethod("convert", {
        accepts: [
          { arg: "data", type: "object" },
        ],
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "object" },
        ]
    });


    
    Invoice.beforeRemote("getAllInvoices", async function (ctx) {
      var token = ctx.req.accessToken;
      var userId = token && token.userId;
      if (userId) {
        ctx.args.userId = userId;
      }
      return;
    });
    
    Invoice.getAllInvoices = async function (userId) {
     
      try {
        const InvoiceSource = await Invoice.find({ userId }).map(
          source => {
            
            return { 
              quoteID: source.quoteID, 
              id: source.id,  
              attn_toId: 
              source.attn_toId, 
              totalAmt: source.totalAmt, 
              sent_date:source.sent_date, 
              dueDate:source.dueDate, 
              version:source.version, 
              state:source.state,
              companyName: source.companyName
            };
          }
        );

        return InvoiceSource

      } catch (e) {
        console.log(e);
        throw e;
      }
    };

    Invoice.remoteMethod("getAllInvoices", {
      accepts: [{ arg: "userId", type: "any" }],
      http: { path: "/getAllInvoices", verb: "get" },
      returns: [{ arg: "fields", type: "object" }]
    });

      
};
