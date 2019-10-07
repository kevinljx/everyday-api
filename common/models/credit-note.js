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

        const Accountreconcile = Creditnote.app.models.AccountReconcile

        try {
  
          const creditNoteObject = await Creditnote.create(creditNote)

          await Accountreconcile.create({
            debit_id : "",
            debit_type: "",
            credit_id : creditNoteObject.id,
            credit_type: 3,
            amount: creditNoteObject.amount,
            reconciled : false,
            accountId: creditNoteObject.customer
          })

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
      const Invoice = Creditnote.app.models.Invoice
      try {

        const creditNote = await Creditnote.findById(data)
        
        const AccountReconcileSource = await Accountreconcile.find({where : {'credit_id': data}})

        let reconcileSource = []
        for (const reconcileObject of AccountReconcileSource) { 

          let source = reconcileObject

          if(reconcileObject.debit_id){
            const invoice = await Invoice.findById(reconcileObject.debit_id)
            source.__data.quoteID = invoice.quoteID
            reconcileSource.push(source)
          } else {
            reconcileSource.push(source)
          }

        }

        if(reconcileSource.length == AccountReconcileSource.length){
          return {creditNote, reconcileSource}
        }
      
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
    
    Creditnote.convertcredit = async function(id) {

        const Accountreconcile = Creditnote.app.models.AccountReconcile
        const Invoice = Creditnote.app.models.Invoice

        try {
          
          const SingleAccountReconcileSource = await Accountreconcile.findOne({where : {'credit_id': id, 'reconciled': false}})
      
          SingleAccountReconcileSource.reconciled = true
          await SingleAccountReconcileSource.save()

          const creditNoteObject = await Creditnote.findById(SingleAccountReconcileSource.credit_id)
          creditNoteObject.reconciled = true
          await creditNoteObject.save()
          
          const reconcileSource = await Accountreconcile.find({where : {'credit_id': id}})

          let AccountReconcileSource = []
          for (const reconcileObject of reconcileSource) { 
  
            let source = reconcileObject
  
            if(reconcileObject.debit_id){
              const invoice = await Invoice.findById(reconcileObject.debit_id)
              source.__data.quoteID = invoice.quoteID
              AccountReconcileSource.push(source)
            } else {
              AccountReconcileSource.push(source)
            }
  
          }

          return {creditNoteObject, AccountReconcileSource}
            
        } catch (e) {
          console.log(e)
          return [0, {}]
        }

    }
      
    Creditnote.remoteMethod("convertcredit", {
      accepts: [{ arg: "data", type: "any" }],
      http: { path: "/convertcredit", verb: "post" },
      returns: [
        { arg: "data", type: "object" },
      ]
    });


};
