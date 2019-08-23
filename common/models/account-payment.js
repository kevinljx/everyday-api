'use strict';

module.exports = function(Accountpayment) {

    Accountpayment.beforeRemote("getAllPayments", async function (ctx) {
        var token = ctx.req.accessToken;
        var userId = token && token.userId;
        if (userId) {
          ctx.args.userId = userId;
        }
        return;
      });
  
    Accountpayment.getAllPayments = async function (userId) {
      
        try {
  
          const PaymentSource = await Accountpayment.find({ userId }).map(
            async (source) => {
                let dataSource =  source

                const setup = {
                    id : source.customer,
                    name: source.customerName
                }
                dataSource.setup = setup

              return dataSource
            }
          );
  
        //   const users = await Quotation.app.models.BaseUser.find({ userId }).map(
        //     user => {
        //       return { name: user.name, value: user.id };
        //     }
        //   );
    
          return PaymentSource
        } catch (e) {
          console.log(e);
          throw e;
        }
    };
  
    Accountpayment.remoteMethod("getAllPayments", {
        accepts: [{ arg: "userId", type: "any" }],
        http: { path: "/getAllPayments", verb: "get" },
        returns: [{ arg: "fields", type: "any" }]
      });
  

};
