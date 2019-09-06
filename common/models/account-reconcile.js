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
       
        const singlePaymentId = data 
  

        try {

            const singleInvoices = Accountreconcile.app.models.Invoice
            const singlePayment = Accountreconcile.app.models.AccountPayment

            const getSinglePaymentObject = await singlePayment.findById(singlePaymentId)
            

            const getAllAccountReconcileObjects = await Accountreconcile.find({where: {["credit_id"]: getSinglePaymentObject.id}}) 
            // console.log('getAllAccountReconcileObjects')
            // console.log(getAllAccountReconcileObjects)

            let getAllInvoicesPayment = []

            for (const perReconcileItem of getAllAccountReconcileObjects) { 
               
                // console.log('perReconcileItem')
                // console.log(perReconcileItem)

                const AllInvoices = await singleInvoices.find({where: {['id']: perReconcileItem.debit_id}})

                // console.log('perInvoice')
                // console.log(AllInvoices)

                let currentPaymentTillDate = 0

                for (const eachInvoice of AllInvoices) { 

                    currentPaymentTillDate = currentPaymentTillDate + eachInvoice.amount

                    const getReconciledPaymentObjects = await Accountreconcile.find({where: {["debit_id"]: eachInvoice.id}}) 
                    // console.log('getReconciledPaymentObjects')
                    // console.log(getReconciledPaymentObjects)

                    let totalPaidAmount = 0
                    for (const eachPaidObjects of getReconciledPaymentObjects) { 
                        // console.log('eachPaidObjects')
                        // console.log(eachPaidObjects)
                        totalPaidAmount = eachPaidObjects.amount + totalPaidAmount
                    }


                    let openBalance = eachInvoice.totalAmt - totalPaidAmount
                    let reconcile = (openBalance <= 0)? true : false

                    getAllInvoicesPayment.push({
                        id: eachInvoice.id,
                        invoiceId: eachInvoice.quoteID,
                        dated: eachInvoice.sent_date,
                        dueDate: new Date(eachInvoice.dueDate),
                        originalAmount: eachInvoice.totalAmt,
                        openBalance: openBalance,
                        reconcile: {disabled: reconcile, reconcile: reconcile},
                        allocated: perReconcileItem.amount
                    })

                }


                // i += 1
            }


            console.log('getAllInvoicesPayment')
            console.log(getAllInvoicesPayment)

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

        // for (const eachCompany of AccountList) { 

        //   const allInvoices = await Invoice.find({where: {'accountId.value': String(eachCompany.id)}}) 
        //   console.log('allInvoices')
        //   console.log(allInvoices)

        //   for (const eachCompany of AccountList) { 

        //   }

        // }

        //  return company  with all invoices, confirmed and unpaid // imcomplete invoices
        /*
        
          [
            {
              companyName : 'text',
              invoices :[
                {}
              ]
            }
          ]
        
        */
        
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


    Accountreconcile.getAllInvoicesOneCompany = async function(id) {
      
      let getAllInvoicesPayment = []

      try {

        const Invoice = Accountreconcile.app.models.Invoice
        const InvoiceSource = await Invoice.find({where : {'accountId.value': id, state: "Confirmed", }})

        for (const perInvoice of InvoiceSource) { 

          // Date - date
          // Due Date - dueDate
          // Original Amount - totalAmt
          // Open Balance - 
          // Reconcile -
          // Allocation -

          const reconcileInvoice = await Accountreconcile.find({where: {debit_id: perInvoice.id}}) 
  
          let currentPaymentTillDate = 0

          for (const reconcileItem of reconcileInvoice) { 
              currentPaymentTillDate = currentPaymentTillDate + reconcileItem.amount
          }

          const openBalance = perInvoice.totalAmt - currentPaymentTillDate
          let reconcile = (openBalance <= 0)? true : false
          getAllInvoicesPayment.push({
              id :perInvoice.id,
              invoiceId: perInvoice.quoteID,
              dated: perInvoice.sent_date,
              dueDate: new Date(perInvoice.dueDate),
              originalAmount: perInvoice.totalAmt,
              openBalance: openBalance,
              reconcile: {disabled: reconcile, reconcile: reconcile},
              allocation:0,
          })

        }

        return getAllInvoicesPayment

      } catch (e) {

      }
    }

    Accountreconcile.remoteMethod("getAllInvoicesOneCompany", {
      accepts: [{ arg: "id", type: "any" }],
      returns: [{ arg: "fields", type: "any" }]
    });

};




// --------- Backup for showing all invoices and reconcile items ----------- //


// Accountreconcile.getSingleCompanyPayments = async function(data) {
       
//   const singlePaymentId = data 
//   console.log('singlePaymentId')
//   console.log(singlePaymentId)

//   try {

//       let getAllInvoicesPayment = []

//       const Invoice = Accountreconcile.app.models.Invoice
  
//       const confirmedInvoices = await Invoice.find({where : {'accountId.value': String(companyId), state: "Confirmed", }})
           

//       for (const perInvoice of confirmedInvoices) { 

//           const reconcileInvoice = await Accountreconcile.find({where: {debit_id: perInvoice.id}}) 
  
//           let currentPaymentTillDate = 0

//           for (const reconcileItem of reconcileInvoice) { 
//               currentPaymentTillDate = currentPaymentTillDate + reconcileItem.amount
//           }

//           const openBalance = perInvoice.totalAmt - currentPaymentTillDate
//           let reconcile = (openBalance <= 0)? true : false
//           getAllInvoicesPayment.push({
//               invoiceId: perInvoice.quoteID,
//               dated: perInvoice.sent_date,
//               dueDate: new Date(perInvoice.dueDate),
//               originalAmount: perInvoice.totalAmt,
//               openBalance: openBalance,
//               reconcile: {disabled: reconcile, reconcile: reconcile}
//           })

//           // i += 1
//       }

//       const Company = await Accountreconcile.app.models.Account.findById(companyId).then(Result =>{
//           return { name: Result.baseContact.name, id: Result.id };
//       })

    
//       return [1, getAllInvoicesPayment, Company]
    
//   } catch (e) {
//       console.log(e)
//       return [0, []]
//   }
// }

