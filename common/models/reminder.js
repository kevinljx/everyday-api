'use strict';

module.exports = function(Reminder) {

    Reminder.createReminder = async function (data) {

        try {

           console.log('createReminder')
           console.log(data)
           
           await Reminder.create(data)

           return [1, {}]
  
        } catch (e) {
  
           return [0, {}]
        }
        
    }

    Reminder.remoteMethod("createReminder", {
        accepts: [{ arg: "data", type: "object" },],
        returns: [
          { arg: "success", type: "number" },
          { arg: "data", type: "object" },
        ]
    });







};
