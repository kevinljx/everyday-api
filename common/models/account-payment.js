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


    Accountpayment.payment = async function (datum) {
       
        const balancePayment = datum.balance
        // console.log('datum.balance')
        // console.log(datum.balance)

        const data = datum.payment
        // console.log('datum.payment')
        // console.log(datum.payment)

        const Accountreconcile = Accountpayment.app.models.AccountReconcile
        const Invoice = Accountpayment.app.models.Invoice

        try {
        
          if(balancePayment.length > 0) {
            for (const balanceItem of balancePayment) { 
                        
                // find the outstanding reconcile object
                const balancePaymentReconcile = await Accountreconcile.findOne({where : {"_id": balanceItem.id}})
               
                // Invoice.findOne always pick the one oldest entry by default
                const InvoiceSource = await Invoice.findOne({where : {'accountId.value': balancePaymentReconcile.accountId, state: { inq: ["Confirmed", "Payment In Progress"]}}})
              
                if(InvoiceSource) {
                  const invoiceReconcile = await Accountreconcile.findOne({where : {'debit_id': InvoiceSource.id, 'credit_id': '', reconciled: false}})
                
                  if(invoiceReconcile) {
                    
                      const remainingAmount = invoiceReconcile.amount - balanceItem.allocation

                      if(remainingAmount > 0) {
                  
                        invoiceReconcile.amount = remainingAmount
                        await invoiceReconcile.save()
                        
                        InvoiceSource.state = "Payment In Progress"
                        await InvoiceSource.save()

              
                        const BalanceRemainingAmount = balancePaymentReconcile.amount - balanceItem.allocation
                        if(BalanceRemainingAmount > 0){
                          await Accountreconcile.create({
                            debit_id : "",
                            debit_type: "",
                            credit_id : balancePaymentReconcile.credit_id,
                            credit_type: balancePaymentReconcile.credit_type,
                            amount: BalanceRemainingAmount,
                            reconciled : false,
                            accountId: balancePaymentReconcile.accountId
                          })
                        }

                        balancePaymentReconcile.debit_id = invoiceReconcile.debit_id
                        balancePaymentReconcile.debit_type = 1
                        // balancePaymentReconcile.credit_type = balancePaymentReconcile.credit_type
                        balancePaymentReconcile.amount = balanceItem.allocation
                        balancePaymentReconcile.reconciled = true
                        await balancePaymentReconcile.save()
                        

                      } else if (remainingAmount < 0) {

                        invoiceReconcile.reconciled = true
                        invoiceReconcile.credit_id = balancePaymentReconcile.credit_id
                        invoiceReconcile.credit_type = balancePaymentReconcile.credit_type
                        await invoiceReconcile.save()

                        balancePaymentReconcile.debit_id = ""
                        balancePaymentReconcile.debit_type = ""
                        balancePaymentReconcile.amount = remainingAmount * -1
                        balancePaymentReconcile.reconciled = false
                        await balancePaymentReconcile.save()
  
                        InvoiceSource.state = "Paid"
                        InvoiceSource.reconcile = true
                        await InvoiceSource.save()

                      } else if (remainingAmount == 0) {

                        invoiceReconcile.reconciled = true
                        invoiceReconcile.credit_id = balancePaymentReconcile.credit_id
                        invoiceReconcile.credit_type = balancePaymentReconcile.credit_type
                        await invoiceReconcile.save()

                        InvoiceSource.state = "Paid"
                        InvoiceSource.reconcile = true
                        await InvoiceSource.save()

                      }
        
                  } else {
                    

                    let remainingAmount = InvoiceSource.totalAmt - balanceItem.allocation

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

                      balancePaymentReconcile.debit_id = InvoiceSource.id
                      balancePaymentReconcile.debit_type = 1
                      balancePaymentReconcile.amount = balanceItem.allocation
                      balancePaymentReconcile.reconciled = true
                      await balancePaymentReconcile.save()
                      
                      if(balancePayment > 0){
                
                        await Accountreconcile.create({
                          debit_id : "",
                          debit_type: "",
                          credit_id : balancePaymentReconcile.credit_id,
                          credit_type: balancePaymentReconcile.credit_type,
                          amount: balancePayment,
                          reconciled : false,
                          accountId: balancePaymentReconcile.accountId
                        })
    
                      } 

                      InvoiceSource.state = "Payment In Progress"
                      await InvoiceSource.save()

                    } else if (remainingAmount < 0) {
                      // need to find the exsiting and replace the old one
              
                      await Accountreconcile.create({
                        debit_id : "",
                        debit_type: "",
                        credit_id : balancePaymentReconcile.credit_id,
                        credit_type: balancePaymentReconcile.credit_type,
                        amount: remainingAmount * -1,
                        reconciled : false,
                        accountId: balancePaymentReconcile.accountId
                      })


                      balancePaymentReconcile.debit_id = InvoiceSource.id
                      balancePaymentReconcile.debit_type = 1
                      balancePaymentReconcile.amount = InvoiceSource.totalAmt
                      balancePaymentReconcile.reconciled = true
                      await balancePaymentReconcile.save()


                      InvoiceSource.state = "Paid"
                      InvoiceSource.reconcile = true
                      await InvoiceSource.save()

                    } else if (remainingAmount == 0) {


                      balancePaymentReconcile.debit_id = InvoiceSource.id
                      balancePaymentReconcile.debit_type = 1
                      balancePaymentReconcile.amount = InvoiceSource.totalAmt
                      balancePaymentReconcile.reconciled = true
                      await balancePaymentReconcile.save()


                      InvoiceSource.state = "Paid"
                      InvoiceSource.reconcile = true
                      await InvoiceSource.save()
                      
                    }

                  }
                }
            }
          }
          
          if(data.payment) {

            const payment = data.payment
            const invoices = data.invoices

            const paymentObject = await Accountpayment.create(payment)
            let balancePayment = paymentObject.amount

            //// loop number of invoices to be paid
            for (const singleInvoice of invoices) { 
             
              const ReconcileSource = await Accountreconcile.findOne({where : {'accountId': payment.customer, 'debit_id': singleInvoice.invoiceId, reconciled: false}})
              
              // Check if exisiting reconcile table object created
              if(ReconcileSource){


                let balance = ReconcileSource.amount - singleInvoice.amount
               

                if(balance > 0){
                  // Balance more than 0

                  const InvoiceSource = await Invoice.findOne({where : {'_id': singleInvoice.invoiceId, state: { inq: ["Confirmed", "Payment In Progress"]}}})

                  if(singleInvoice.reconciled) {
                    
                    await Accountreconcile.create({
                      debit_id : singleInvoice.invoiceId,
                      debit_type: 1,
                      credit_id : paymentObject.id,
                      credit_type: 2,
                      amount: singleInvoice.amount,
                      reconciled : true,
                      accountId: paymentObject.customer
                    })
  
                    ReconcileSource.amount = -balance
                    ReconcileSource.reconciled = true
                    await ReconcileSource.save()


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
                      credit_type: 2,
                      amount: singleInvoice.amount,
                      reconciled : true,
                      accountId: paymentObject.customer
                    })

                    InvoiceSource.state = "Payment In Progress"
                    await InvoiceSource.save()
                                      
                  }

                 
                } else {

                  ReconcileSource.credit_id = paymentObject.id  
                  ReconcileSource.credit_type = 2                                  
                  ReconcileSource.amount = ReconcileSource.amount   
                  ReconcileSource.reconciled = true
                  await ReconcileSource.save()

                  // should convert invoice status to paid
                  const InvoiceSource = await Invoice.findOne({where : {'_id': singleInvoice.invoiceId, state: { inq: ["Confirmed", "Payment In Progress"]}}})
                  InvoiceSource.state = "Paid"
                  InvoiceSource.reconcile = true
                  await InvoiceSource.save()

                
                }

                balancePayment = balancePayment - singleInvoice.amount
                
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
                        credit_type: 2,
                        amount: singleInvoice.amount,
                        reconciled : true,
                        accountId: payment.customer
                      })


                      // 2) create reconcile object with remaining amount and reconciled set to false
                      await Accountreconcile.create({
                        debit_id : singleInvoice.invoiceId,
                        debit_type: 1,
                        credit_id : paymentObject.id,
                        credit_type: 2,
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
                        credit_type: 2,
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
                    
                    InvoiceSource.state = "Payment In Progress"
                    await InvoiceSource.save()

                  } else {
  
                    // 1) create reconcile object with total amount and reconciled set to true
                    await Accountreconcile.create({
                      debit_id : singleInvoice.invoiceId,
                      debit_type: 1,
                      credit_id : paymentObject.id,
                      credit_type: 2,
                      amount: singleInvoice.amount,
                      reconciled : true,
                      accountId: payment.customer
                    })
  
                    InvoiceSource.state = "Paid"
                    InvoiceSource.reconcile = true
                    await InvoiceSource.save()

                  }
                
                  balancePayment = balancePayment - singleInvoice.amount
                
                } else {

                  // Prepare for saving into balance
                  balancePayment = paymentObject.amount
                  
                }
                

              } 


            } // end of loop invoices


            // Check for Balance
            if(!paymentObject.paymentDifference){
              if(balancePayment > 0){
                await Accountreconcile.create({
                  debit_id : "",
                  debit_type: 1,
                  credit_id : paymentObject.id,
                  credit_type: 2,
                  amount: balancePayment,
                  reconciled : false,
                  accountId: paymentObject.customer
                })
              }
            }
  
          } // end of payment

         
          return [1, {}]
  
        } catch (e) {
            console.log(e)
          return [0, {}]
        }
        
    }
  
    Accountpayment.remoteMethod("payment", {
        accepts: [
          { arg: "data", type: "Object" },
        ],
        http: { path: "/payment", verb: "post" },
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "object" },
        ]
    });

};
