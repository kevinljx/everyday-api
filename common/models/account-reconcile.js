'use strict';

module.exports = function(Accountreconcile) {



    Accountreconcile.payment = async function (data) {

        // save payment Id and create new item for reconcile table
        // payment object - company, 
        try {
          var Accountpayment = Accountreconcile.app.models.AccountPayment
          const paymentObject = await Accountpayment.create(data)

          const reconcile_object = {
            debit_id : data.invoiceId,
            debit_type: 1,
            credit_id : paymentObject.id,
            credit_type: 1,
            amount: paymentObject.paidAmount,
            reconciled : false,
          }

          console.log('item payment and reconcile created')

          await Accountreconcile.create(reconcile_object)

          return [1, {}]
  
        } catch (e) {
            console.log(e)
          return [0, {}]
        }
        
    }
  
    Accountreconcile.remoteMethod("payment", {
        accepts: [
          { arg: "data", type: "object" },
        ],
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "object" },
        ]
    });


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

        const companyId = data
        console.log("companyId")
        console.log(companyId)
        try {

            let getAllInvoicesPayment = []

            const Invoice = Accountreconcile.app.models.Invoice
        
            const confirmedInvoices = await Invoice.find({where : {'accountId.value': String(companyId), state: "Confirmed", }})
                 
            console.log(confirmedInvoices.length)

            for (const perInvoice of confirmedInvoices) { 

                const reconcileInvoice = await Accountreconcile.find({where: {debit_id: perInvoice.id}}) 
        
                let currentPaymentTillDate = 0

                for (const reconcileItem of reconcileInvoice) { 
                    currentPaymentTillDate = currentPaymentTillDate + reconcileItem.amount
                }

                const openBalance = perInvoice.totalAmt - currentPaymentTillDate
                let reconcile = (openBalance <= 0)? true : false
                getAllInvoicesPayment.push({
                    invoiceId: perInvoice.quoteID,
                    dated: perInvoice.sent_date,
                    dueDate: new Date(perInvoice.dueDate),
                    originalAmount: perInvoice.totalAmt,
                    openBalance: openBalance,
                    reconcile: {disabled: reconcile, reconcile: reconcile}
                })

                // i += 1
            }

            const Company = await Accountreconcile.app.models.Account.findById(companyId).then(Result =>{
                return { name: Result.baseContact.name, id: Result.id };
            })

          
            console.log(getAllInvoicesPayment)
            return [1, getAllInvoicesPayment, Company]
          
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
















};



