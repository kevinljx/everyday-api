'use strict';
module.exports = function (Model, bootOptions = {}) {


    Model.beforeRemote('**', function(ctx, user, next) {

        // Reminder before remote
        const Reminder = Model.app.models.Reminder;

        // Checking of arg data
        /*
            args = {
                data : {}
                notification : {}
            }

            // will get error if check directly 
            // ctx.args.data.reminder, so added double lines to check
            // can be refactored properly, if better solution is found.
        */

        if(ctx.args.data){
            if(ctx.args.data.reminder){
                // if reminder object is found, Reminde model will create new object
                Reminder.create(ctx.args.data.reminder)
            }
        } else {
            console.log('no reminder')
        }

        next();
    });

}
