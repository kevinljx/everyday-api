'use strict';

module.exports = function(Quotation) {





    Quotation.quotations = async function(data) {
        //check if user already signed up with same email address

        const quotations = data.item

        const quotationLines = data.products
        // console.log(quotationLines)
        
 
        // var QuotationOrder = Quotation.app.models.Quotation;
        // var pp = await QuotationOrder.create({
        //     date : quotations.date,
        //     // attn_to: quotations.attn_toId.id,
        //     // account: quotations.account.id,
        //     attn_toId: quotations.attn_toId.id,
        //     accountId: quotations.account.id,
        //     currency: quotations.currency,
        //     currency_rate: quotations.currency_rate,
        //     sent_date: (new Date().toDateString()),
        //     dueDate: new Date().setDate(new Date().getDate() + 3),
        //     tnc: "Terms and Conditions",
        //     version: 1,
        //     totalAmt: quotations.total,
        //     subtotal: quotations.subtotal,
        //     tax_amount: quotations.tax_amount,
        //     quoteID: quotations.quoteID
        //     // quotationline: quotationLines   
        // })

        // console.log(pp)

        // save quotation line
        // console.log(data.products)

        // - num: the sequence number. if there are 10 items in the quotation, then num will run from 1 to 10.
       
            
        // - date: the date of the quotation. By default it takes the current date, but the user can still change the date to backdate or move the quotation date to future.
        
        // - quote_days: number of days the quote will remain valid. The default can be set in settings.
        // - state: possible options in earlier email. State cannot be changed directly by the user.
      
        // - shipping_cost: shown before subtotal. editable by user. It should be used in tax calculation.
        // - discount_total: discount $ based on selected DiscountSetting (see discountsetting). Shown before subtotal. Not editable by user
        // - subtotal: shown at the end of a quotation. This is the subtotal of all the quotation lines + shipping_cost - discount_total. Not editable by user.
        // - tax_id: Tax selected from drop down list of available tax objects.
        // - tax_amount: calculated tax amount based on subtotal and tax_id selected. Not editable
        // - total: subtotal + tax.
        // - custinfo: this is an editable field, but retrieved from the accounts and attn_to selection. E.g the user selects - Company A account and Kevin as the customer... so the custinfo will show 
        // " Attn: Kevin
        // Company A
        // Abc St 1
        // Singapore 123456"
        // But this text field is still editable by the user, and will be used in the quotation print-out.
        // - shipinfo: Same as custinfo but for shipping.
        // - account - links to the Account object
        // - attn_to - links to the Customer objects that belong to Account
        // - ship_to - links to Account object
        // - tax - the tax object. When selected, the entire quotation will have the tax setting applied to it.
        // - discount: links to the DiscountSetting object. the selected discount will apply to the entire quotation. DiscountSetting can be as percentage or as $. 

        // attn_to = attn_toId.id
        // account = account.id
        // date: '2019-07-08T05:08:56.444Z',
        // currency: { name: 'SGD', rate: 1 },
        // currency_rate: 1,

     

        try {
        } catch (e) {
          console.log(e);
          throw e;
        }


    };



    // Quotation.remoteMethod('quotations',{
    //     accepts: {arg: 'data', type: 'object'},
    //     returns: { arg: "success", type: "number" },
    //     http: {path: '/', verb: 'post'}
    // });
      

};
