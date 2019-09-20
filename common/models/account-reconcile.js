'use strict';

module.exports = function(Accountreconcile) {



    Accountreconcile.payment = async function (datum) {
       
        // console.log("datum")
        // console.log(datum)

        const data = datum.payment
        const balancePayment = datum.balance


        try {
        
          if(balancePayment.length > 0) {
            console.log('commencing balance payment')
            for (const balanceItem of balancePayment) { 
                
                // find the outstanding reconcile object
                const balancePaymentReconcile = await Accountreconcile.findOne({where : {"_id": balanceItem.id}})
               
                // Invoice.findOne always pick the one oldest entry by default
                const Invoice = Accountreconcile.app.models.Invoice
                const InvoiceSource = await Invoice.findOne({where : {'accountId.value': balancePaymentReconcile.accountId, state: "Confirmed"}})
                const invoiceReconcile = await Accountreconcile.findOne({where : {'debit_id': InvoiceSource.id, 'credit_id': '', reconciled: false}})

                if(invoiceReconcile) {

                  console.log('invoiceReconcile found!')
                  // console.log(invoiceReconcile)
                 
                  const remainingAmount = invoiceReconcile.amount - balanceItem.allocation
                  // invoiceReconcile.amount  = balanceItem.allocation
                  // invoiceReconcile.credit_id = balancePaymentReconcile.credit_id
                  // invoiceReconcile.credit_type = 1
                  // invoiceReconcile.reconciled = true
                  // await invoiceReconcile.save()
                  // console.log('converting invoiceReconcile to true and save into backend')


                  console.log('checking remaining amount')

                  if(remainingAmount > 0) {
                    console.log('remainingAmount more than 0', remainingAmount, 'proceed to create balance in reconcile table')
                    let debit_balance_amount = {
                      debit_id : invoiceReconcile.debit_id,
                      debit_type: 1,
                      credit_id : "",
                      credit_type: "",
                      amount: remainingAmount,
                      reconciled : false,
                      accountId: balancePaymentReconcile.accountId
                    }
                    // console.log(debit_balance_amount)
                    await Accountreconcile.create(debit_balance_amount)

                  } else if (remainingAmount < 0) {
                    console.log('remainingAmount less than 0, expecting negative value', remainingAmount, '')

                    // need to find the exsiting and replace the old one
                    // invoiceReconcile.amount = InvoiceSource.totalAmt
                    // invoiceReconcile.credit_id = balancePaymentReconcile.credit_id
                    // invoiceReconcile.credit_type = 1
                    // invoiceReconcile.reconciled = true

                    // console.log('Deducting reconcile invoice from the balance payment, save into backend')
                    // // console.log(invoiceReconcile)
                    // await invoiceReconcile.save()

                    let objectToCopy = {
                      debit_id : "",
                      debit_type: "",
                      credit_id : balancePaymentReconcile.credit_id,
                      credit_type: 2,
                      amount: remainingAmount * -1,
                      reconciled : false,
                      accountId: balancePaymentReconcile.accountId
                    }

                    console.log('clone and create new payment balance, with negative change to positive')
                    await Accountreconcile.create(objectToCopy)


                    console.log('remaining less than 0, converting to paid for invoice')
                    // should convert invoice status to paid
                    InvoiceSource.state = "Paid"
                    await InvoiceSource.save()

                  }


                  const balancePayment = balancePaymentReconcile.amount - balanceItem.allocation
                  balancePaymentReconcile.amount = balancePaymentReconcile.amount - balanceItem.allocation
                  balancePaymentReconcile.debit_id = invoiceReconcile.debit_id
                  balancePaymentReconcile.debit_type = 1
                  balancePaymentReconcile.credit_type = 1
                  balancePaymentReconcile.amount = balanceItem.allocation
                  balancePaymentReconcile.reconciled = true
                  console.log('Balance payment used, reconciled to true, proceed to save')
                  console.log(balancePaymentReconcile)
                  await balancePaymentReconcile.save()
                  
                  console.log('balancePayment')
                  console.log(balancePayment)
                  if(balancePayment > 0){
                   
                    let objectToCopy = {
                      debit_id : '',
                      debit_type: "",
                      credit_id : balancePaymentReconcile.id,
                      credit_type: 2,
                      amount: balancePayment,
                      reconciled : false,
                      accountId: balancePaymentReconcile.accountId
                    }


                    console.log('clone and create new payment balance')
                    console.log(objectToCopy)
                    await Accountreconcile.create(objectToCopy)

                    console.log('end of process')

                  }

            
                } else {
                  
                  console.log('no invoiceReconcile')

                  let remainingAmount = InvoiceSource.totalAmt - balanceItem.allocation

                  console.log('remainingAmount')
                  console.log(remainingAmount)

                  console.log('InvoiceSource.totalAmt')
                  console.log(InvoiceSource.totalAmt)

                  if(remainingAmount > 0) {
                    console.log('remaining amount > 0')

                    // const reconcile_object = {
                    //   debit_id : InvoiceSource.id,
                    //   debit_type: 1,
                    //   credit_id : balancePaymentReconcile.credit_id,
                    //   credit_type: 1,
                    //   amount: balanceItem.allocation,
                    //   reconciled : true,
                    //   accountId: balancePaymentReconcile.accountId
                    // }
  
                    // console.log('because no reconcile object found in table, new object and user paid lesser than the amount')
                    // await Accountreconcile.create(reconcile_object)
  
                    let debit_balance_amount = {
                      debit_id : InvoiceSource.id,
                      debit_type: 1,
                      credit_id : "",
                      credit_type: "",
                      amount: remainingAmount,
                      reconciled : false,
                      accountId: balancePaymentReconcile.accountId
                    }

                    console.log('creating new debit balance amount')
                    await Accountreconcile.create(debit_balance_amount)
  
                    const balancePayment = balancePaymentReconcile.amount - balanceItem.allocation

                    // balancePaymentReconcile.amount = balancePaymentReconcile.amount - balanceItem.allocation
                    balancePaymentReconcile.debit_id = InvoiceSource.id
                    balancePaymentReconcile.debit_type = 1
                    balancePaymentReconcile.credit_type = 1
                    balancePaymentReconcile.amount = balanceItem.allocation
                    balancePaymentReconcile.reconciled = true
                    console.log('Balance payment used, reconciled to true, proceed to save')
                    console.log(balancePaymentReconcile)
                    await balancePaymentReconcile.save()
                    
                    if(balancePayment > 0){
                   
                      let objectToCopy = {
                        debit_id : "",
                        debit_type: "",
                        credit_id : balancePaymentReconcile.credit_id,
                        credit_type: 2,
                        amount: balancePayment,
                        reconciled : false,
                        accountId: balancePaymentReconcile.accountId
                      }
  
                      console.log('clone and create new payment balance')
                      console.log(objectToCopy)
                      await Accountreconcile.create(objectToCopy)
  
                      console.log('end of process')
  
                    } 

                  } else if (remainingAmount < 0) {
                    console.log('remaining amount < 0')
                    // need to find the exsiting and replace the old one
     
                    balancePaymentReconcile.debit_id = InvoiceSource.id
                    balancePaymentReconcile.debit_type = 1
                    balancePaymentReconcile.amount = InvoiceSource.totalAmt
                    balancePaymentReconcile.credit_type = 1
                    balancePaymentReconcile.reconciled = true
                    await balancePaymentReconcile.save()

                    let objectToCopy = {
                      debit_id : "",
                      debit_type: "",
                      credit_id : balancePaymentReconcile.credit_id,
                      credit_type: 2,
                      amount: remainingAmount * -1,
                      reconciled : false,
                      accountId: balancePaymentReconcile.accountId
                    }

                    console.log('clone and create new payment balance, with negative change to positive')
                    await Accountreconcile.create(objectToCopy)

                    console.log('remaining less than 0, converting to paid for invoice')
                    // should convert invoice status to paid
                    InvoiceSource.state = "Paid"
                    await InvoiceSource.save()

                    console.log('end of process')

                  }

                }
              
                console.log('----END---')
                console.log('----------')
                console.log('----------')
                console.log('----------')
                console.log('----------')

            }
          }
          
          // LOOP FOR EACH PAYMENT FROM FRONTEND
          if(data.length > 0){
 
            for (const paymentItem of data) { 
          
              // Create & Save payment object
              var Accountpayment = Accountreconcile.app.models.AccountPayment
              const Invoice = Accountreconcile.app.models.Invoice

              // CREATE PAYMENT OBJECT
              const paymentObject = await Accountpayment.create(paymentItem)
            

              // CHECK FOR RECONCILE TABLE
              const ReconcileSource = await Accountreconcile.findOne({where : {'accountId': paymentItem.customer, 'debit_id': paymentItem.invoiceId, reconciled: false}})

              let reconcile_object = {
                debit_id : paymentItem.invoiceId,
                debit_type: 1,
                credit_id : paymentObject.id,
                credit_type: 1,
                amount: paymentObject.amount,
                reconciled : true,
                accountId: paymentItem.customer
              }
              
              // got record
              if(ReconcileSource){

                let balance = ReconcileSource.amount - paymentObject.amount
                
                if(balance > 0) {

                  ReconcileSource.amount = balance
                  await ReconcileSource.save()
                  await Accountreconcile.create(reconcile_object)

                } else {

                  if(balance < 0){
                    balance = balance * -1
    
                    const credit_reconcile_object = {
                      debit_id : "",
                      debit_type: "",
                      credit_id : paymentObject.id,
                      credit_type: 2,
                      amount: balance,
                      reconciled : false,
                      accountId: paymentItem.customer
                    }                 

                    ReconcileSource.credit_id = paymentObject.id  
                    ReconcileSource.credit_type = 1                                              
                    ReconcileSource.amount = ReconcileSource.amount   
                    ReconcileSource.reconciled = true

                    await ReconcileSource.save()
                    await Accountreconcile.create(credit_reconcile_object)
    
                  } else {
                    await Accountreconcile.create(reconcile_object)
                  }

                  // should convert invoice status to paid
                  const InvoiceSource = await Invoice.findOne({where : {'_id': paymentItem.invoiceId, state: "Confirmed"}})
                  InvoiceSource.state = "Paid"
                  await InvoiceSource.save()

                }

              } else {
                // no record
                
                const InvoiceSource = await Invoice.findOne({where : {'_id': paymentItem.invoiceId, state: "Confirmed"}})

                let balance = InvoiceSource.totalAmt - paymentObject.amount

                if(balance > 0) {

                  const reconcile_object = {
                    debit_id : paymentItem.invoiceId,
                    debit_type: 1,
                    credit_id : paymentObject.id,
                    credit_type: 1,
                    amount: paymentObject.amount,
                    reconciled : true,
                    accountId: paymentItem.customer
                  }

                  console.log('because no reconcile object found in table, new object and user paid lesser than the amount')
                  await Accountreconcile.create(reconcile_object)

                  let debit_balance_amount = {
                    debit_id : paymentItem.invoiceId,
                    debit_type: 1,
                    credit_id : "",
                    credit_type: "",
                    amount: balance,
                    reconciled : false,
                    accountId: paymentItem.customer
                  }
      
                  await Accountreconcile.create(debit_balance_amount)

                } else {

                  if(balance < 0){
                    balance = balance * -1

                    let credit_reconcile_object = {
                      debit_id : "",
                      debit_type: "",
                      credit_id : paymentObject.id,
                      credit_type: 2,
                      amount: balance,
                      reconciled : false,
                      accountId: paymentItem.customer
                    }

                    const new_reconcile_object = {
                      debit_id : paymentItem.invoiceId,
                      debit_type: 1,
                      credit_id : paymentObject.id,
                      credit_type: 1,
                      amount: InvoiceSource.totalAmt,
                      reconciled : true,
                      accountId: paymentItem.customer
                    }

                    await Accountreconcile.create(new_reconcile_object)
                    await Accountreconcile.create(credit_reconcile_object)
    
                  } else {
                    await Accountreconcile.create(reconcile_object)
                  }

                  // should convert invoice status to paid
                  InvoiceSource.state = "Paid"
                  await InvoiceSource.save()

                }
            
              }

            }
          }


          return [1, {}]
  
        } catch (e) {
            console.log(e)
          return [0, {}]
        }
        
    }
  
    Accountreconcile.remoteMethod("payment", {
        accepts: [
          { arg: "data", type: "Object" },
        ],
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "object" },
        ]
    });

    Accountreconcile.getpaymentaccounts = async function(data) {
        console.log('getpaymentaccounts')
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
        
        console.log('getSingleCompanyPayments', data)

        const singlePaymentId = data 
  
        try {

            const singleInvoices = Accountreconcile.app.models.Invoice
            const singlePayment = Accountreconcile.app.models.AccountPayment

            const getSinglePaymentObject = await singlePayment.findById(singlePaymentId)
                       
            console.log(getSinglePaymentObject.id)
            const getReconcileObject = await Accountreconcile.find({where: {["credit_id"]: getSinglePaymentObject.id}}) 
         
            console.log(getReconcileObject.length)
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
                    allocated: eachPayment.amount
                    // openBalance: openBalance,
                    // reconcile: {disabled: reconcile, reconcile: reconcile},
                  })
  
              } else {

                  getAllInvoicesPayment.push({
                    id: '',
                    invoiceId: '',
                    dated: '',
                    dueDate: '',
                    originalAmount: '',
                    allocated: eachPayment.amount
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
      console.log('getAllCompanyPayments')

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
      console.log('getAllInvoicesOneCompany', id)
      let getAllInvoicesPayment = []

      try {

        const Invoice = Accountreconcile.app.models.Invoice

        const InvoiceSource = await Invoice.find({where : {'accountId.value': id, state: "Confirmed"}})
        // const ReconcileSource = await Accountreconcile.find({where : {'accountId': id, 'credit_id': ''}})
        // console.log('ReconcileSource', ReconcileSource.length)
        // const filterInvoice = getSimilarity(InvoiceSource, ReconcileSource)
        
        for (const perInvoice of InvoiceSource) { 

          const checkingPaymentReconcile = await Accountreconcile.findOne({where : {'debit_id': perInvoice.id, 'credit_id': '', reconciled: false}})

          getAllInvoicesPayment.push({
              id :perInvoice.id,
              invoiceId: perInvoice.quoteID,
              dated: perInvoice.sent_date,
              dueDate: new Date(perInvoice.dueDate),
              originalAmount: perInvoice.totalAmt,
              openBalance: checkingPaymentReconcile? checkingPaymentReconcile.amount : perInvoice.totalAmt,
              reconciled: false,
              amount: 0 ,
          })

        }
          
        let checkingBalancePayment = []
        const balanceArray = await Accountreconcile.find({where : {'debit_id': '', 'accountId': id, reconciled: false}})
        // console.log('checkingBalancePayment')
        // console.log(checkingBalancePayment)
        for (const perPayment of balanceArray) { 

          // console.log(perPayment)
          // const checkingPaymentReconcile = await Accountreconcile.find({where : {'debit_id': perInvoice.id, 'credit_id': '', reconciled: false}})

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
          })

        }

        return {getAllInvoicesPayment, checkingBalancePayment}

      } catch (e) {

      }
    }

    Accountreconcile.remoteMethod("getAllInvoicesOneCompany", {
      accepts: [{ arg: "id", type: "any" }],
      returns: [{ arg: "fields", type: "any" }]
    });

};


function getSimilarity(result1, result2){
  const uniqueResult = result1.filter(function(obj) {
    return result2.some(function(obj2) {
        return obj.id == obj2.debit_id;
    });
  });

  return uniqueResult
}


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


/*

 getAllInvoicesOneCompany

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

*/



// {
//   startTime: 'unix timestamp',
//   isActive: Boolean,
//   title: String,
//   userInfo: {
//     name: String,
//     email: String,
//   },
//   Key: String,
//   recurringFrequency: "",

// },

// recurringFrequencyOption: {
//   "Daily",
//   "Weekly",
//   "Fortnightly",
//   "Monthly",
//   "Yearly"
// }
