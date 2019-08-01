'use strict';

module.exports = function(Invoice) {


    Invoice.invoices = async function (data) {
        console.log(data)
        try {
  
          let datum = {...data}
          // const {userId} = datum
      
          // var Sequencesetting = Invoice.app.models.SequenceSetting
          // datum.quoteID = await Sequencesetting.generateNumber(userId, "Invoice")
          datum.quoteID = '-------'
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

      
};
