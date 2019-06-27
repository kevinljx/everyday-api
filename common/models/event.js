'use strict';

module.exports = function(Event) {
  

  Event.beforeRemote( "**", async function( ctx) {
        var token = ctx.req.accessToken;
        var userId = token && token.userId;
        if (userId){
            ctx.args.userId = userId;
        }
        return;
    });


    Event.events = async function (userId, data) {
        try {
            const insertEvent = {...data}
            insertEvent.userId = userId
            insertEvent.createdBy = userId
            .updatedinsertEventBy = userId
            await Event.create(insertEvent)
            // const allEvents = await Event.find({userID: userId})
            return [1];
           
        } catch (e) {
            throw e;
            // return [0];
        }
    }



    Event.remoteMethod("events", {
        accepts: [
          {arg: 'userId', type: 'any'},
          { arg: "data", type: "object",}
        ],
        http: {path: '/', verb: 'post'},
        returns: [
          { arg: "success", type: "number" },
        ]
      });
    
};



// {
//     "title": "string",
//     "start": "2019-06-26T01:33:07.458Z",
//     "end": "2019-06-26T01:33:07.458Z",
//     "desc": "string",
//     "location": "string",
//     "color": "string",
//     "allDay": false,
//     "name": "string",
//     "eventableId": "string",
//     "eventableType": "string",
//   }
// { arg: "title", type: "string",},
// { arg: "start", type: "string"},
// { arg: "end", type: "string"},
// { arg: "desc", type: "string", },
// { arg: "location", type: "string" },
// { arg: "color", type: "string" },
// { arg: "allDay", type: "boolean" },
// { arg: "name", type: "string" },
// { arg: "eventableId", type: "string" },
// { arg: "eventableType", type: "string" },