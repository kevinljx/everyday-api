'use strict';

module.exports = function(Accountreconcile) {


    Accountreconcile.getpaymentaccounts = async function(data) {

        try {
            const userId = data

            const Account = Accountreconcile.app.models.Account
            const Invoice = Accountreconcile.app.models.Invoice

            // push processed data into this array
            let getPaymentAccounts = []
            // let iAccountCount = 0

            // find all accounts under the userid of the user
            const AccountList  = await Account.find({where : {userId:userId}})
            // loop to find id of the account
            for (const item of AccountList) {            
                        
                const id = item.id
                const companyName = item.baseContact.name
            
                // findall confirmed invoices and id with key.id
                const confirmedInvoices = await Invoice.find({where : {'accountId.value': String(id), state: "Confirmed", }})

                    // let i = 0
                    let totalInvoicesAmt = 0
                    let currentPaymentTillDate = 0

                    // loop to find of the invoice
                    for (const perInvoice of confirmedInvoices) {            

                        const invoiceId = perInvoice.id
                        
                        // keep track of the total amount of the debit of an company
                        totalInvoicesAmt = totalInvoicesAmt + perInvoice.totalAmt

                        // findall reconcile items under an invoice
                        const reconcileInvoice = await Accountreconcile.find({where: {debit_id: invoiceId}}) 
                    
                        // keep track of the total amount of the payment till date
                        for (const reconcileItem of reconcileInvoice) { 
                            currentPaymentTillDate = currentPaymentTillDate + reconcileItem.amount
                        }

                        // i += 1
                        // if all invoice checked, return data
                        // if(confirmedInvoices.length == i){
                            getPaymentAccounts.push({
                                companyName: {companyName, id: item.id},
                                companyId: item.id,
                                invoiceTotalAmt: totalInvoicesAmt,
                                invoiceTotalAmtPaid: currentPaymentTillDate,
                                duePayment: totalInvoicesAmt- currentPaymentTillDate
                            })
                        // }

                    }   

            }
              
            return [1, getPaymentAccounts]

        } catch (e) {
            console.log(e)
          return [0, []]
        }
    }

    Accountreconcile.remoteMethod("getpaymentaccounts", {
        accepts: [
          { arg: "data", type: "string" },
        ],
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "array" },
        ]
    });

    Accountreconcile.getSingleCompanyPayments = async function(data) {
        
        const singlePaymentId = data 
  
        try {

            const singleInvoices = Accountreconcile.app.models.Invoice
            const singlePayment = Accountreconcile.app.models.AccountPayment

            const getSinglePaymentObject = await singlePayment.findById(singlePaymentId)
                       
            const getReconcileObject = await Accountreconcile.find({where: {["credit_id"]: getSinglePaymentObject.id}}) 
         
            let getAllInvoicesPayment = []

            for (const eachPayment of getReconcileObject) { 
               
                const OneInvoice = await singleInvoices.findOne({where: {['id']: eachPayment.debit_id}})
     
                if(OneInvoice){

                  getAllInvoicesPayment.push({
                    id: OneInvoice.id,
                    invoiceId: OneInvoice.quoteID,
                    dated: OneInvoice.sent_date,
                    dueDate: OneInvoice.dueDate,
                    originalAmount: OneInvoice.totalAmt,
                    allocated: eachPayment.amount,
                    // openBalance: openBalance,
                    reconciled: eachPayment.reconciled,
                  })
  
              } else {

                  getAllInvoicesPayment.push({
                    id: '',
                    invoiceId: '',
                    dated: '',
                    dueDate: '',
                    originalAmount: '',
                    allocated: eachPayment.amount,
                    reconciled: eachPayment.reconciled,
                    // openBalance: openBalance,
                    // reconcile: {disabled: reconcile, reconcile: reconcile},
                  })
  
              }
                

            }


            return [1, getSinglePaymentObject, getAllInvoicesPayment]

       
            // const Company = await Accountreconcile.app.models.Account.findById(companyId).then(Result =>{
            //     return { name: Result.baseContact.name, id: Result.id };
            // })

           
        } catch (e) {
            console.log(e)
            return [0, []]
        }
    }

    Accountreconcile.remoteMethod("getSingleCompanyPayments", {
        accepts: [
          { arg: "data", type: "string" },
        ],
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "array" },
          { arg: "company", type: "any" },
        ]
    });

    Accountreconcile.getAllCompanyPayments = async function(userId) {

      try {

        const Account = Accountreconcile.app.models.Account

        const CompanySource = await Account.find({where : {userId:userId}}).map(
          (source) => {

            return { 
              name: source.baseContact.name,
              id: source.id,
              value: source.baseContact.name,
            };
          }
        )

        return CompanySource
        
      } catch (e) {

      }
    }

    Accountreconcile.beforeRemote("getAllCompanyPayments", async function (ctx) {
      var token = ctx.req.accessToken;
      var userId = token && token.userId;
      if (userId) {
        ctx.args.userId = userId;
      }
      return;
    });

    Accountreconcile.remoteMethod("getAllCompanyPayments", {
        accepts: [{ arg: "userId", type: "any" }],
        returns: [{ arg: "fields", type: "any" }]
    });

    Accountreconcile.getAllInvoicesOneCompany = async function(data) {

      const id = data.id
      const key = data.key
      // const id = data
  
      let getAllInvoicesPayment = []

      try {

        const Invoice = Accountreconcile.app.models.Invoice

        const InvoiceSource = await Invoice.find({where : {'accountId.value': id, state: "Confirmed"}})
     
        for (const perInvoice of InvoiceSource) { 

          const checkingPaymentReconcile = await Accountreconcile.findOne({where : {'debit_id': perInvoice.id, 'credit_id': '', reconciled: false}})

          getAllInvoicesPayment.push({
            invoiceId :perInvoice.id,
              invoiceQuote: perInvoice.quoteID,
              dated: perInvoice.sent_date,
              dueDate: new Date(perInvoice.dueDate),
              originalAmount: perInvoice.totalAmt,
              openBalance: checkingPaymentReconcile? checkingPaymentReconcile.amount : perInvoice.totalAmt,
              reconciled: false,
              amount: 0 ,
          })

        }

        let checkingBalancePayment = []

        let balanceArray 

        if(key === "all"){
          balanceArray = await Accountreconcile.find({where : {'debit_id': '', 'accountId': id, reconciled: false}})
        } else if (key === ""){
          balanceArray = await Accountreconcile.find({where : {'debit_id': '', 'credit_type': 2, 'accountId': id, reconciled: false}})
        }

        
        for (const perPayment of balanceArray) { 
      
          let type
          switch (perPayment.credit_type) {
            case 2:
                type = "Debit"
              break;
            case 3:
                type = "Credit"
              break
            default:
                type = "Invoice"
              break;
          }

          checkingBalancePayment.push({
              id : perPayment.id,
              // invoiceId: "-",
              dated: perPayment.createdAt,
              dueDate: perPayment.createdAt,
              // originalAmount: 0,
              // openBalance: 0,
              reconciled: false,
              amount: perPayment.amount,
              allocation: 0,
              type: type
          })

        }

        return {getAllInvoicesPayment, checkingBalancePayment}

      } catch (e) {

      }
    }

    Accountreconcile.remoteMethod("getAllInvoicesOneCompany", {
      accepts: [{ arg: "data", type: "any" }],
      returns: [{ arg: "fields", type: "any" }]
    });

};

