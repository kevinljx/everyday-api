'use strict';

module.exports = function(Creditnote) {


    Creditnote.getAllCompanyCreditNotes = async function(userId) {

        try {
  
          const CreditNoteSource = await Creditnote.find({where : {userId:userId}}).map(
            (item) => {
             
              return { 

                id: item.id,
                customerName: item.customerName,
                amount: item.amount,
                paidOff: item.paidOff,
                reconciled: item.reconciled,
                paymentMethod: item.paymentMethod,
                paymentRef: item.paymentRef,
                date: item.date,

              };
          })
  
          return CreditNoteSource

        } catch (e) {
  
        }
    }
  
    Creditnote.beforeRemote("getAllCompanyCreditNotes", async function (ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
        ctx.args.userId = userId;
    }
    return;
    });

    Creditnote.remoteMethod("getAllCompanyCreditNotes", {
        accepts: [{ arg: "userId", type: "any" }],
        http: { path: "/getAllCompanyCreditNotes", verb: "get" },
        returns: [{ arg: "fields", type: "any" }]
    });
  
    Creditnote.credit = async function(data) {

        const creditNote = data.creditNote
        const creditNoteItem = data.creditNoteItem

        const Accountreconcile = Creditnote.app.models.AccountReconcile
        const Invoice = Creditnote.app.models.Invoice

        try {
  
          const creditNoteObject = await Creditnote.create(creditNote)

          if(creditNoteObject.paidOff){

            await Accountreconcile.create({
              debit_id : "",
              debit_type: "",
              credit_id : creditNoteObject.id,
              credit_type: 3,
              amount: creditNoteObject.amount,
              reconciled : true,
              accountId: creditNoteObject.customer
            })

          } else {
            
            await Accountreconcile.create({
              debit_id : "",
              debit_type: "",
              credit_id : creditNoteObject.id,
              credit_type: 3,
              amount: creditNoteObject.amount,
              reconciled : creditNoteObject.reconciled,
              accountId: creditNoteObject.customer
            })

          }


          return [1, {}]
        
        } catch (e) {
          return [0, {}]
        }
    }
  
    Creditnote.remoteMethod("credit", {
      accepts: [
        { arg: "data", type: "Object" },
      ],
      http: { path: "/credit", verb: "post" },
      returns: [
        { arg: "success", type: "number" },
        { arg: "data", type: "object" },
      ]
    });
  

    Creditnote.getSingleCompanyCreditNotes = async function(data) {
      
      const Accountreconcile = Creditnote.app.models.AccountReconcile


      try {

        const creditNote = await Creditnote.findById(data)
        

        const AccountReconcileSource = await Accountreconcile.find({where : {'credit_id': data}})


        return {creditNote, AccountReconcileSource}
      
      } catch (e) {
        return {}
      }
    }

    Creditnote.remoteMethod("getSingleCompanyCreditNotes", {
      accepts: [
        { arg: "data", type: "any" },
      ],
      http: { path: "/getSingleCompanyCreditNotes", verb: "post" },
      returns: [
        // { arg: "success", type: "number" },
        { arg: "data", type: "object" },
      ]
    });
    

};
