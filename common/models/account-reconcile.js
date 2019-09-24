'use strict';

module.exports = function(Accountreconcile) {


    Accountreconcile.payment = async function (datum) {
       
        const balancePayment = datum.balance
        const data = datum.payment

        console.log('data')
        console.log(data)

        try {
        
          if(balancePayment.length > 0) {
            console.log('commencing balance payment')
            for (const balanceItem of balancePayment) { 
                
                console.log('balanceItem')
                console.log(balanceItem)

                // find the outstanding reconcile object
                const balancePaymentReconcile = await Accountreconcile.findOne({where : {"_id": balanceItem.id}})
               
                // Invoice.findOne always pick the one oldest entry by default
                const Invoice = Accountreconcile.app.models.Invoice
                const InvoiceSource = await Invoice.findOne({where : {'accountId.value': balancePaymentReconcile.accountId, state: "Confirmed"}})
                const invoiceReconcile = await Accountreconcile.findOne({where : {'debit_id': InvoiceSource.id, 'credit_id': '', reconciled: false}})

                if(invoiceReconcile) {

                    console.log('invoiceReconcile found!')
                  
                    const remainingAmount = invoiceReconcile.amount - balanceItem.allocation
                
                    if(remainingAmount > 0) {
                
                      invoiceReconcile.amount = remainingAmount
                      await invoiceReconcile.save()
            
                      balancePaymentReconcile.debit_id = invoiceReconcile.debit_id
                      balancePaymentReconcile.debit_type = 1
                      balancePaymentReconcile.credit_type = 1
                      balancePaymentReconcile.amount = balanceItem.allocation
                      balancePaymentReconcile.reconciled = true

                      await balancePaymentReconcile.save()
                      
                      // await Accountreconcile.create({
                      //   debit_id : '',
                      //   debit_type: "",
                      //   credit_id : balancePaymentReconcile.id,
                      //   credit_type: 2,
                      //   amount: balanceItem.allocation,
                      //   reconciled : false,
                      //   accountId: balancePaymentReconcile.accountId
                      // })

                    } else if (remainingAmount < 0) {

                      invoiceReconcile.reconciled = true
                      invoiceReconcile.credit_id = balancePaymentReconcile.id
                      invoiceReconcile.credit_type = 1
                      await invoiceReconcile.save()

                      console.log('clone and create new payment balance, with negative change to positive')
                      await Accountreconcile.create({
                        debit_id : "",
                        debit_type: "",
                        credit_id : balancePaymentReconcile.credit_id,
                        credit_type: 2,
                        amount: remainingAmount * -1,
                        reconciled : false,
                        accountId: balancePaymentReconcile.accountId
                      }
  )
                      InvoiceSource.state = "Paid"
                      InvoiceSource.reconcile = true
                      await InvoiceSource.save()

                    } else if (remainingAmount == 0) {

                      invoiceReconcile.reconciled = true
                      invoiceReconcile.credit_id = balancePaymentReconcile.id
                      invoiceReconcile.credit_type = 1
                      await invoiceReconcile.save()

                      InvoiceSource.state = "Paid"
                      InvoiceSource.reconcile = true
                      await InvoiceSource.save()

                    }

                    console.log('end of process')

      
                } else {
                  
                  console.log('no invoiceReconcile')

                  let remainingAmount = InvoiceSource.totalAmt - balanceItem.allocation

                  console.log('remainingAmount')
                  console.log(remainingAmount)

                  console.log('InvoiceSource.totalAmt')
                  console.log(InvoiceSource.totalAmt)

                  if(remainingAmount > 0) {

                    await Accountreconcile.create({
                      debit_id : InvoiceSource.id,
                      debit_type: 1,
                      credit_id : "",
                      credit_type: "",
                      amount: remainingAmount,
                      reconciled : false,
                      accountId: balancePaymentReconcile.accountId
                    })
  
                    const balancePayment = balancePaymentReconcile.amount - balanceItem.allocation

                    // balancePaymentReconcile.amount = balancePaymentReconcile.amount - balanceItem.allocation
                    balancePaymentReconcile.debit_id = InvoiceSource.id
                    balancePaymentReconcile.debit_type = 1
                    balancePaymentReconcile.credit_type = 1
                    balancePaymentReconcile.amount = balanceItem.allocation
                    balancePaymentReconcile.reconciled = true
                    
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
  
                      
                      await Accountreconcile.create(objectToCopy)
  
                      console.log('end of process')
  
                    } 

                  } else if (remainingAmount < 0) {
                    console.log('remaining amount < 0')
                    // need to find the exsiting and replace the old one
            
                    await Accountreconcile.create({
                      debit_id : "",
                      debit_type: "",
                      credit_id : balancePaymentReconcile.credit_id,
                      credit_type: 2,
                      amount: remainingAmount * -1,
                      reconciled : false,
                      accountId: balancePaymentReconcile.accountId
                    })


                    balancePaymentReconcile.debit_id = InvoiceSource.id
                    balancePaymentReconcile.debit_type = 1
                    balancePaymentReconcile.amount = InvoiceSource.totalAmt
                    balancePaymentReconcile.credit_type = 1
                    balancePaymentReconcile.reconciled = true
                    await balancePaymentReconcile.save()


                    InvoiceSource.state = "Paid"
                    InvoiceSource.reconcile = true
                    await InvoiceSource.save()

                  } else if (remainingAmount == 0) {


                    balancePaymentReconcile.debit_id = InvoiceSource.id
                    balancePaymentReconcile.debit_type = 1
                    balancePaymentReconcile.amount = InvoiceSource.totalAmt
                    balancePaymentReconcile.credit_type = 1
                    balancePaymentReconcile.reconciled = true
                    await balancePaymentReconcile.save()


                    InvoiceSource.state = "Paid"
                    InvoiceSource.reconcile = true
                    await InvoiceSource.save()
                    
                  }

                }
         
            }
          }
          
          // Check if there is payment object
          if(data.payment) {

            const payment = data.payment
            const invoices = data.invoices
            let balancePayment = 0


            const Accountpayment = Accountreconcile.app.models.AccountPayment
            const paymentObject = await Accountpayment.create(payment)

            //// loop number of invoices to be paid
            for (const singleInvoice of invoices) { 
             
              const Invoice = Accountreconcile.app.models.Invoice
              const ReconcileSource = await Accountreconcile.findOne({where : {'accountId': payment.customer, 'debit_id': singleInvoice.invoiceId, reconciled: false}})

              
              // Check if exisiting reconcile table object created
              if(ReconcileSource){

                let balance = ReconcileSource.amount - singleInvoice.amount
               
                if(balance > 0){
                  // Balance more than 0

                  if(singleInvoice.reconciled) {
                    console.log('singleInvoice.reconciled')
                    console.log(singleInvoice.reconciled)

                    await Accountreconcile.create({
                      debit_id : singleInvoice.invoiceId,
                      debit_type: 1,
                      credit_id : paymentObject.id,
                      credit_type: 1,
                      amount: singleInvoice.amount,
                      reconciled : true,
                      accountId: paymentObject.customer
                    })
  
                    ReconcileSource.amount = -balance
                    ReconcileSource.reconciled = true
                    await ReconcileSource.save()


                    const InvoiceSource = await Invoice.findOne({where : {'_id': singleInvoice.invoiceId, state: "Confirmed"}})
                    InvoiceSource.state = "Paid"
                    InvoiceSource.reconcile = true
                    await InvoiceSource.save()

                  } else {

                    // 1) Update the existing reconcileSource with the remaining balance
                    ReconcileSource.amount = balance
                    await ReconcileSource.save()

                    // 2) create reconcile object with remaining amount and reconciled set to true
                    await Accountreconcile.create({
                      debit_id : singleInvoice.invoiceId,
                      debit_type: 1,
                      credit_id : paymentObject.id,
                      credit_type: 1,
                      amount: singleInvoice.amount,
                      reconciled : true,
                      accountId: paymentObject.customer
                    })

                  }

                } else {

                  ReconcileSource.credit_id = paymentObject.id  
                  ReconcileSource.credit_type = 1                                              
                  ReconcileSource.amount = ReconcileSource.amount   
                  ReconcileSource.reconciled = true
                  await ReconcileSource.save()

                  // should convert invoice status to paid
                  const InvoiceSource = await Invoice.findOne({where : {'_id': singleInvoice.invoiceId, state: "Confirmed"}})
                  InvoiceSource.state = "Paid"
                  InvoiceSource.reconcile = true
                  await InvoiceSource.save()

                  balancePayment = paymentObject.amount - singleInvoice.amount

                }


              } else {

                const InvoiceSource = await Invoice.findOne({where : {'_id': singleInvoice.invoiceId, state: "Confirmed"}})

                // Incase balance payment clear the invoice
                if(InvoiceSource){

                  let balance = InvoiceSource.totalAmt - singleInvoice.amount

                  if(balance > 0){
                    // Balance more than 0
  
                    if(singleInvoice.reconciled) {
                      
                      // 1) create reconcile object with current amount and reconciled set to true
                      await Accountreconcile.create({
                        debit_id : singleInvoice.invoiceId,
                        debit_type: 1,
                        credit_id : paymentObject.id,
                        credit_type: 1,
                        amount: singleInvoice.amount,
                        reconciled : true,
                        accountId: payment.customer
                      })


                      // 2) create reconcile object with remaining amount and reconciled set to false
                      await Accountreconcile.create({
                        debit_id : singleInvoice.invoiceId,
                        debit_type: 1,
                        credit_id : paymentObject.id,
                        credit_type: 1,
                        amount: balance * -1,
                        reconciled : true,
                        accountId: payment.customer
                      })


                      InvoiceSource.state = "Paid"
                      InvoiceSource.reconcile = true
                      await InvoiceSource.save()


                    } else {
                      
                      // 1) create reconcile object with current amount and reconciled set to true
                      await Accountreconcile.create({
                        debit_id : singleInvoice.invoiceId,
                        debit_type: 1,
                        credit_id : paymentObject.id,
                        credit_type: 1,
                        amount: singleInvoice.amount,
                        reconciled : true,
                        accountId: payment.customer
                      })
    
                      // 2) create reconcile object with remaining amount and reconciled set to false
                      await Accountreconcile.create({
                        debit_id : singleInvoice.invoiceId,
                        debit_type: 1,
                        credit_id : "",
                        credit_type: "",
                        amount: balance,
                        reconciled : false,
                        accountId: payment.customer
                      })

                    }
                    
  
                  } else {
  
                    // 1) create reconcile object with total amount and reconciled set to true
                    await Accountreconcile.create({
                      debit_id : singleInvoice.invoiceId,
                      debit_type: 1,
                      credit_id : paymentObject.id,
                      credit_type: 1,
                      amount: singleInvoice.amount,
                      reconciled : true,
                      accountId: payment.customer
                    })
  
                    InvoiceSource.state = "Paid"
                    InvoiceSource.reconcile = true
                    await InvoiceSource.save()
  
                    balancePayment = paymentObject.amount - singleInvoice.amount

                  }
                
                } else {

                  // Prepare for saving into balance
                  balancePayment = paymentObject.amount
                  
                }
                

              } 


              // Check for Balance
              if(!paymentObject.paymentDifference){
                if(balancePayment > 0){
                  await Accountreconcile.create({
                    debit_id : "",
                    debit_type: 1,
                    credit_id : paymentObject.id,
                    credit_type: 1,
                    amount: balancePayment,
                    reconciled : false,
                    accountId: paymentObject.customer
                  })
                }
              }

            } // end of loop invoices

      
            
            //  else {
            //   if(balancePayment){
            //     await Accountreconcile.create({
            //       debit_id : "",
            //       debit_type: 1,
            //       credit_id : paymentObject.id,
            //       credit_type: 1,
            //       amount: balancePayment,
            //       reconciled : true,
            //       accountId: paymentObject.customer
            //     })
            //   }
            // }
           

          } // end of payment

         
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

