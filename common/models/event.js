"use strict";

module.exports = function(Event) {
  /**
   * Create Event
   */
  Event.beforeRemote("customCreate", async function(ctx) {
    var token = ctx.req.accessToken;
    var userId = token && token.userId;
    if (userId) {
      ctx.args.userId = userId;
    }
    return;
  });
  /**
   * Participants
   * [{ email, participantsType, participantsId, name, rsvp }]
   */
  Event.customCreate = async function(data, userId) {
    try {
      const { participants, ...others } = data;

      var newEvent = await Event.create({ ...others, userId });
      if (participants.length > 0) {
        for (let i = 0; i < participants.length; i++) {
          var part = await Event.app.models.EventParticipant.create({
            ...participants[i],
            eventId: newEvent.id
          });
          console.log(part);
        }
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  Event.remoteMethod("customCreate", {
    accepts: [{ arg: "data", type: "object" }, { arg: "userId", type: "any" }],
    http: { path: "/", verb: "post" },
    returns: [{ arg: "data", type: "object" }]
  });
};
